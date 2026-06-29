import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import ContactView from './ContactView.vue'

vi.mock('@/lib/api', () => ({ api: { post: vi.fn() } }))

import { api } from '@/lib/api'

afterEach(() => vi.clearAllMocks())

async function fillForm(
  wrapper: ReturnType<typeof mount>,
  overrides: Partial<{
    lastName: string
    firstName: string
    email: string
    about: string
    message: string
    consent: boolean
  }> = {},
) {
  const fields = {
    lastName: 'Dupont',
    firstName: 'Marie',
    email: 'marie@example.com',
    about: 'contact',
    message: 'Bonjour',
    consent: true,
    ...overrides,
  }
  await wrapper.find('#lastName').setValue(fields.lastName)
  await wrapper.find('#firstName').setValue(fields.firstName)
  await wrapper.find('#email').setValue(fields.email)
  await wrapper.find('#about').setValue(fields.about)
  await wrapper.find('#message').setValue(fields.message)
  if (fields.consent) await wrapper.find('#consent').setValue(true)
}

describe('ContactView — form validation', () => {
  it('shows a lastName error when last name is missing', async () => {
    const wrapper = mount(ContactView)
    await fillForm(wrapper, { lastName: '' })
    await wrapper.find('form').trigger('submit')
    expect(wrapper.text()).toContain('Le nom est requis')
    expect(api.post).not.toHaveBeenCalled()
  })

  it('shows a firstName error when first name is missing', async () => {
    const wrapper = mount(ContactView)
    await fillForm(wrapper, { firstName: '' })
    await wrapper.find('form').trigger('submit')
    expect(wrapper.text()).toContain('Le prénom est requis')
    expect(api.post).not.toHaveBeenCalled()
  })

  it('shows a required error when email is missing', async () => {
    const wrapper = mount(ContactView)
    await fillForm(wrapper, { email: '' })
    await wrapper.find('form').trigger('submit')
    expect(wrapper.text()).toContain("L'email est requis")
    expect(api.post).not.toHaveBeenCalled()
  })

  it('shows a format error for an invalid email', async () => {
    const wrapper = mount(ContactView)
    await fillForm(wrapper, { email: 'not-an-email' })
    await wrapper.find('form').trigger('submit')
    expect(wrapper.text()).toContain("L'email n'est pas valide")
    expect(api.post).not.toHaveBeenCalled()
  })

  it('shows an about error when no subject is selected', async () => {
    const wrapper = mount(ContactView)
    await fillForm(wrapper, { about: '' })
    await wrapper.find('form').trigger('submit')
    expect(wrapper.text()).toContain('Veuillez sélectionner un sujet')
    expect(api.post).not.toHaveBeenCalled()
  })

  it('shows a message error when message is missing', async () => {
    const wrapper = mount(ContactView)
    await fillForm(wrapper, { message: '' })
    await wrapper.find('form').trigger('submit')
    expect(wrapper.text()).toContain('Le message est requis')
    expect(api.post).not.toHaveBeenCalled()
  })

  it('shows a consent error when the checkbox is unchecked', async () => {
    const wrapper = mount(ContactView)
    await fillForm(wrapper, { consent: false })
    await wrapper.find('form').trigger('submit')
    expect(wrapper.text()).toContain('Vous devez accepter les conditions')
    expect(api.post).not.toHaveBeenCalled()
  })
})

describe('ContactView — isRegistration', () => {
  it('shows the registration info block when subject is "secretaire"', async () => {
    const wrapper = mount(ContactView)
    await wrapper.find('#about').setValue('secretaire')
    expect(wrapper.text()).toContain('Avant de nous contacter')
  })

  it('hides the registration info block for other subjects', async () => {
    const wrapper = mount(ContactView)
    await wrapper.find('#about').setValue('planning')
    expect(wrapper.text()).not.toContain('Avant de nous contacter')
  })
})

describe('ContactView — handleSubmit', () => {
  it('calls api.post with the correct payload on a valid submission', async () => {
    vi.mocked(api.post).mockResolvedValue({})
    const wrapper = mount(ContactView)
    await fillForm(wrapper)
    await wrapper.find('form').trigger('submit')
    await flushPromises()
    expect(api.post).toHaveBeenCalledWith('/contact', {
      firstName: 'Marie',
      lastName: 'Dupont',
      email: 'marie@example.com',
      about: 'contact',
      message: 'Bonjour',
      consent: true,
    })
  })

  it('resets the form and shows the success message after a successful submission', async () => {
    vi.mocked(api.post).mockResolvedValue({})
    const wrapper = mount(ContactView)
    await fillForm(wrapper)
    await wrapper.find('form').trigger('submit')
    await flushPromises()
    expect(wrapper.text()).toContain('Message envoyé !')
    expect(wrapper.find('form').exists()).toBe(false)
  })

  it('shows an error message when the API call fails', async () => {
    vi.mocked(api.post).mockRejectedValue(new Error('network error'))
    const wrapper = mount(ContactView)
    await fillForm(wrapper)
    await wrapper.find('form').trigger('submit')
    await flushPromises()
    expect(wrapper.text()).toContain('Une erreur est survenue')
    expect(wrapper.find('form').exists()).toBe(true)
  })

  it('shows the form again when "Envoyer un autre message" is clicked', async () => {
    vi.mocked(api.post).mockResolvedValue({})
    const wrapper = mount(ContactView)
    await fillForm(wrapper)
    await wrapper.find('form').trigger('submit')
    await flushPromises()
    await wrapper.find('button').trigger('click')
    expect(wrapper.find('form').exists()).toBe(true)
  })
})
