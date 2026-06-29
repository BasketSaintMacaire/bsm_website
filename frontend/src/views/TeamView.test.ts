import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import TeamView from './TeamView.vue'
import type { Team } from '@/models/Team'

vi.mock('gsap', () => ({
  gsap: {
    from: vi.fn(),
  },
}))
vi.mock('@/composables/useApiList', () => ({ useApiList: vi.fn() }))
vi.mock('@/components/LazyImage.vue', () => ({
  default: { name: 'LazyImage', template: '<img />' },
}))

import { useApiList } from '@/composables/useApiList'

const sampleTeams: Team[] = [
  {
    id: 1,
    name: 'Seniors Masculins 1',
    image: '/team1.jpg',
    season: '2025-2026',
    category: 'men',
    players: [
      { id: 1, name: 'Alice', position: 'PG', number: 7 },
      { id: 2, name: 'Bob', position: 'C', number: 14 },
    ],
  },
  {
    id: 2,
    name: 'Seniors Féminines',
    image: '/team2.jpg',
    season: '2025-2026',
    category: 'women',
    players: [],
  },
  {
    id: 3,
    name: 'Seniors Masculins 2',
    image: '/team3.jpg',
    season: '2024-2025',
    category: 'men',
    players: [],
  },
]

// Each test gets a fresh ref so the watch fires when data is assigned after mount
let teamsData: ReturnType<typeof ref<Team[]>>

beforeEach(() => {
  teamsData = ref<Team[]>([])
  vi.mocked(useApiList).mockReturnValue({
    data: teamsData,
    loading: ref(false),
    error: ref(null),
  })
})

async function mountWithTeams() {
  const wrapper = mount(TeamView)
  teamsData.value = sampleTeams // triggers the watch → selectedSeason is set
  await nextTick()
  await nextTick()
  return wrapper
}

describe('TeamView — seasons computed', () => {
  it('lists unique seasons sorted newest first', async () => {
    const wrapper = await mountWithTeams()
    const options = wrapper.findAll('select option').map((o) => o.text())
    expect(options).toEqual(['2025-2026', '2024-2025'])
  })
})

describe('TeamView — filteredTeams', () => {
  it('shows only men teams for the default season', async () => {
    const wrapper = await mountWithTeams()
    const cards = wrapper.findAll('.team-card')
    // selectedSeason = '2025-2026', category = 'men' → 1 team
    expect(cards).toHaveLength(1)
    expect(cards[0].text()).toContain('Seniors Masculins 1')
  })

  it('shows women teams after switching category', async () => {
    const wrapper = await mountWithTeams()
    await wrapper.findAll('.category-button')[1].trigger('click')
    const cards = wrapper.findAll('.team-card')
    expect(cards).toHaveLength(1)
    expect(cards[0].text()).toContain('Seniors Féminines')
  })

  it('shows no cards when a category has no teams', async () => {
    const wrapper = await mountWithTeams()
    await wrapper.findAll('.category-button')[2].trigger('click')
    expect(wrapper.findAll('.team-card')).toHaveLength(0)
  })
})

describe('TeamView — selectTeam', () => {
  it('opens the sliding panel when a team card is clicked', async () => {
    const wrapper = await mountWithTeams()
    expect(wrapper.find('.sliding-panel').exists()).toBe(false)
    await wrapper.find('.team-card').trigger('click')
    expect(wrapper.find('.sliding-panel').exists()).toBe(true)
  })

  it('displays the team name and its players in the panel', async () => {
    const wrapper = await mountWithTeams()
    await wrapper.find('.team-card').trigger('click')
    const panel = wrapper.find('.sliding-panel')
    expect(panel.text()).toContain('Seniors Masculins 1')
    expect(panel.text()).toContain('Alice')
    expect(panel.text()).toContain('Bob')
  })
})

describe('TeamView — closePanel', () => {
  it('closes the panel when the X button is clicked', async () => {
    const wrapper = await mountWithTeams()
    await wrapper.find('.team-card').trigger('click')
    expect(wrapper.find('.sliding-panel').exists()).toBe(true)
    await wrapper.find('.sliding-panel button').trigger('click')
    expect(wrapper.find('.sliding-panel').exists()).toBe(false)
  })
})

describe('TeamView — changeCategory', () => {
  it('resets the selected team when the category changes', async () => {
    const wrapper = await mountWithTeams()
    await wrapper.find('.team-card').trigger('click')
    expect(wrapper.find('.sliding-panel').exists()).toBe(true)
    await wrapper.findAll('.category-button')[1].trigger('click')
    expect(wrapper.find('.sliding-panel').exists()).toBe(false)
  })
})
