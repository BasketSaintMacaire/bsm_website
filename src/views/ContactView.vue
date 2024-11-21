<script setup lang="ts">
import { ref, computed } from 'vue'

interface FormData {
  lastName: string
  firstName: string
  email: string
  about: string
  message: string
  consent: boolean
}

interface FormErrors {
  lastName?: string
  firstName?: string
  email?: string
  about?: string
  message?: string
  consent?: string
}

const formData = ref<FormData>({
  lastName: '',
  firstName: '',
  email: '',
  about: '',
  message: '',
  consent: false,
})

const errors = ref<FormErrors>({})

const aboutOptions = [
  { value: 'planning', label: 'Planning' },
  { value: 'entrainement', label: 'Entrainement' },
  { value: 'evenement', label: 'Evenement' },
  { value: 'emarque', label: 'Emarque' },
  { value: 'inscription', label: 'Inscription' },
  { value: 'autre', label: 'Autre' },
]

const recipientEmail = computed(() => {
  return `${formData.value.about}@bsmbasket.fr`
})

const validateForm = (): boolean => {
  errors.value = {}
  let isValid = true

  if (!formData.value.lastName) {
    errors.value.lastName = 'Le nom est requis'
    isValid = false
  }

  if (!formData.value.firstName) {
    errors.value.firstName = 'Le prénom est requis'
    isValid = false
  }

  if (!formData.value.email) {
    errors.value.email = "L'email est requis"
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
    errors.value.email = "L'email n'est pas valide"
    isValid = false
  }

  if (!formData.value.about) {
    errors.value.about = 'Veuillez sélectionner un sujet'
    isValid = false
  }

  if (!formData.value.message) {
    errors.value.message = 'Le message est requis'
    isValid = false
  }

  if (!formData.value.consent) {
    errors.value.consent = 'Vous devez accepter les conditions'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return

  try {
    console.log('Form submitted:', formData.value)
    console.log('Recipient email:', recipientEmail.value)
    // Here you would typically send the form data to your backend
    // along with the recipientEmail
    formData.value = {
      lastName: '',
      firstName: '',
      email: '',
      about: '',
      message: '',
      consent: false,
    }
    errors.value = {}
  } catch (error) {
    console.error('Error submitting form:', error)
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-black p-4">
    <div class="w-full max-w-4xl bg-[#1A1A1A] rounded-lg shadow-2xl">
      <div class="p-8">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-white mb-2">VOUS AVEZ UNE DEMANDE ?</h1>
          <h2 class="text-2xl font-bold text-white">CONTACTEZ-NOUS !</h2>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label for="lastName" class="block text-sm font-medium text-white mb-1"> Nom* </label>
              <input
                id="lastName"
                v-model="formData.lastName"
                type="text"
                required
                class="block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm ring-1 ring-inset ring-gray-600 focus:ring-2 focus:ring-purple-500 sm:text-sm sm:leading-6 p-3"
              />
              <p v-if="errors.lastName" class="mt-1 text-sm text-red-500">{{ errors.lastName }}</p>
            </div>

            <div>
              <label for="firstName" class="block text-sm font-medium text-white mb-1">
                Prénom*
              </label>
              <input
                id="firstName"
                v-model="formData.firstName"
                type="text"
                required
                class="block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm ring-1 ring-inset ring-gray-600 focus:ring-2 focus:ring-purple-500 sm:text-sm sm:leading-6 p-3"
              />
              <p v-if="errors.firstName" class="mt-1 text-sm text-red-500">
                {{ errors.firstName }}
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label for="email" class="block text-sm font-medium text-white mb-1"> E-Mail* </label>
              <input
                id="email"
                v-model="formData.email"
                type="email"
                required
                class="block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm ring-1 ring-inset ring-gray-600 focus:ring-2 focus:ring-purple-500 sm:text-sm sm:leading-6 p-3"
              />
              <p v-if="errors.email" class="mt-1 text-sm text-red-500">{{ errors.email }}</p>
            </div>

            <div>
              <label for="about" class="block text-sm font-medium text-white mb-1">
                A propos de*
              </label>
              <select
                id="about"
                v-model="formData.about"
                required
                class="block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm ring-1 ring-inset ring-gray-600 focus:ring-2 focus:ring-purple-500 sm:text-sm sm:leading-6 p-3"
              >
                <option value="" disabled selected>Choisissez un sujet</option>
                <option v-for="option in aboutOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
              <p v-if="errors.about" class="mt-1 text-sm text-red-500">{{ errors.about }}</p>
            </div>
          </div>

          <div>
            <label for="message" class="block text-sm font-medium text-white mb-1">
              Message*
            </label>
            <textarea
              id="message"
              v-model="formData.message"
              rows="6"
              required
              class="block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm ring-1 ring-inset ring-gray-600 focus:ring-2 focus:ring-purple-500 sm:text-sm sm:leading-6 p-3"
            ></textarea>
            <p v-if="errors.message" class="mt-1 text-sm text-red-500">{{ errors.message }}</p>
          </div>

          <div class="flex items-start space-x-3">
            <div class="flex items-center h-6">
              <input
                id="consent"
                v-model="formData.consent"
                type="checkbox"
                required
                class="h-4 w-4 rounded border-gray-600 bg-[#2a3142] text-purple-600 focus:ring-purple-500"
              />
            </div>
            <label for="consent" class="text-sm text-gray-300">
              En cochant cette case et en soumettant ce formulaire, j'accepte que mes données
              personnelles soient utilisées pour me recontacter dans le cadre de ma demande indiquée
              dans ce formulaire. aucun autre traitement ne sera effectué avec mes informations.
            </label>
          </div>
          <p v-if="errors.consent" class="mt-1 text-sm text-red-500">{{ errors.consent }}</p>

          <div class="flex justify-end">
            <button
              type="submit"
              class="px-8 py-3 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transform transition-all duration-200 uppercase tracking-wider"
            >
              Envoyer
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
:root {
  --form-bg: #1e2536;
  --input-bg: #2a3142;
}

input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
textarea:-webkit-autofill,
textarea:-webkit-autofill:hover,
textarea:-webkit-autofill:focus,
select:-webkit-autofill,
select:-webkit-autofill:hover,
select:-webkit-autofill:focus {
  -webkit-text-fill-color: white;
  -webkit-box-shadow: 0 0 0px 1000px var(--input-bg) inset;
  transition: background-color 5000s ease-in-out 0s;
}

input:focus,
textarea:focus,
select:focus {
  outline: none;
}
</style>
