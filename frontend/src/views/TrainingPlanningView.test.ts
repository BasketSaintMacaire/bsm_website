import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import TrainingPlanningView from './TrainingPlanningView.vue'

vi.mock('@/composables/useApiList', () => ({ useApiList: vi.fn() }))

import { useApiList } from '@/composables/useApiList'

const sampleSchedule = [
  {
    name: 'Semaine 1',
    period: 'Du 1 au 7 septembre 2025',
    days: [
      {
        date: 'Lundi 01/09',
        sessions: [
          { time: '18h00', groups: ['U11', 'U13'], location: 'Gymnase A', trainer: 'Coach Dupont', notes: '' },
        ],
      },
      {
        date: 'Mardi 02/09',
        sessions: [],
      },
    ],
  },
  {
    name: 'Semaine 2',
    period: 'Du 8 au 14 septembre 2025',
    days: [
      {
        date: 'Lundi 08/09',
        sessions: [
          { time: '19h00', groups: ['Seniors'], location: 'Gymnase B', trainer: '-', notes: 'Match amical' },
        ],
      },
    ],
  },
]

let scheduleData: ReturnType<typeof ref>

beforeEach(() => {
  scheduleData = ref([])
  vi.mocked(useApiList).mockReturnValue({
    data: scheduleData,
    loading: ref(false),
    error: ref(null),
  })
})

async function mountWithData() {
  const wrapper = mount(TrainingPlanningView)
  scheduleData.value = sampleSchedule
  await nextTick()
  return wrapper
}

describe('TrainingPlanningView — week tabs', () => {
  it('renders a tab button for each week', async () => {
    const wrapper = await mountWithData()
    const tabs = wrapper.findAll('button')
    const weekTabs = tabs.filter((b) => b.text().includes('Semaine'))
    expect(weekTabs).toHaveLength(2)
    expect(weekTabs[0].text()).toBe('Semaine 1')
    expect(weekTabs[1].text()).toBe('Semaine 2')
  })

  it('shows the first week content by default', async () => {
    const wrapper = await mountWithData()
    expect(wrapper.text()).toContain('Lundi 01/09')
    expect(wrapper.text()).toContain('Coach Dupont')
  })

  it('shows the period label for the selected week', async () => {
    const wrapper = await mountWithData()
    expect(wrapper.text()).toContain('Du 1 au 7 septembre 2025')
  })

  it('switches to the second week when its tab is clicked', async () => {
    const wrapper = await mountWithData()
    const tabs = wrapper.findAll('button').filter((b) => b.text().includes('Semaine'))
    await tabs[1].trigger('click')
    expect(wrapper.text()).toContain('Lundi 08/09')
    expect(wrapper.text()).toContain('Du 8 au 14 septembre 2025')
  })

  it('shows "Pas d\'entraînement" for a day with no sessions', async () => {
    const wrapper = await mountWithData()
    expect(wrapper.text()).toContain("Pas d'entraînement")
  })

  it('shows "Non renseigné" when the trainer is a dash', async () => {
    const wrapper = await mountWithData()
    const tabs = wrapper.findAll('button').filter((b) => b.text().includes('Semaine'))
    await tabs[1].trigger('click')
    expect(wrapper.text()).toContain('Non renseigné')
  })

  it('shows the session note when present', async () => {
    const wrapper = await mountWithData()
    const tabs = wrapper.findAll('button').filter((b) => b.text().includes('Semaine'))
    await tabs[1].trigger('click')
    expect(wrapper.text()).toContain('Match amical')
  })
})
