<script setup lang="ts">
import { ref, computed } from 'vue'
import { api } from '@/lib/api'

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
const submitted = ref(false)
const submitError = ref(false)

// NOTE: supprimez le doublon "planning" dans vos options
const aboutOptions = [
  { value: 'planning', label: 'Planning' },
  { value: 'tournoi', label: 'Tournoi' },
  { value: 'boutique', label: 'Boutique' },
  { value: 'sponsoring', label: 'Sponsoring' },
  { value: 'bar', label: 'Bar' },
  { value: 'technique', label: 'Equipe/Entrainement' },
  { value: 'secretaire', label: 'Inscription' },
  { value: 'contact', label: 'Autre' },
]

// ————— NOUVEAU: documents à télécharger (remplacez les URLs par vos vrais fichiers)
type DownloadDoc = { name: string; url: string }
const registrationDocs: DownloadDoc[] = [
  {
    name: 'Fiche d’inscription BSM 2025-2026',
    url: '/files/fiche-inscription-2025-2026.pdf',
  },
  { name: 'Modalites d’inscription 2025-2026', url: '/files/modalites-inscription-2025-2026.pdf' },
]

// ————— NOUVEAU: état pour “Inscription” et validation dédiée
const isRegistration = computed(() => formData.value.about === 'secretaire')

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
  submitError.value = false
  try {
    await api.post('/contact', {
      firstName: formData.value.firstName,
      lastName: formData.value.lastName,
      email: formData.value.email,
      about: formData.value.about,
      message: formData.value.message,
      consent: formData.value.consent,
    })

    formData.value = { lastName: '', firstName: '', email: '', about: '', message: '', consent: false }
    errors.value = {}
    submitted.value = true
  } catch (error) {
    console.error('Error submitting form:', error)
    submitError.value = true
  }
}
</script>

<template>
  <!-- Outer container uses theme tokens for background/text -->
  <div
    class="min-h-screen flex items-center justify-center bg-page dark:bg-page-dark text-mainText dark:text-mainText-dark p-4"
  >
    <!-- Card container for the form -->
    <div class="w-full max-w-4xl bg-card dark:bg-card-dark rounded-lg shadow-2xl">
      <div class="p-8">
        <!-- Form header -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-mainText dark:text-mainText-dark mb-2">
            VOUS AVEZ UNE DEMANDE ?
          </h1>
          <h2 class="text-2xl font-bold text-mainText dark:text-mainText-dark">CONTACTEZ-NOUS !</h2>
        </div>

        <!-- Success state -->
        <div
          v-if="submitted"
          class="flex flex-col items-center gap-4 py-12 text-center"
        >
          <div class="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
            <svg class="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-mainText dark:text-mainText-dark">Message envoyé !</h3>
          <p class="text-mutedText dark:text-mutedText-dark">
            Nous avons bien reçu votre message et reviendrons vers vous dans les plus brefs délais.
          </p>
          <button
            type="button"
            @click="submitted = false"
            class="mt-2 px-6 py-2 text-sm font-medium text-purple-600 dark:text-purple-400 underline hover:no-underline"
          >
            Envoyer un autre message
          </button>
        </div>

        <!-- Form -->
        <form v-else @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Name Fields -->
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <!-- Last Name -->
            <div>
              <label
                for="lastName"
                class="block text-sm font-medium mb-1 text-mainText dark:text-mainText-dark"
                >Nom*</label
              >
              <input
                id="lastName"
                v-model="formData.lastName"
                type="text"
                required
                class="block w-full rounded-md bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-mainText dark:text-mainText-dark shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:ring-2 focus:ring-purple-500 sm:text-sm sm:leading-6 p-3"
              />
              <p v-if="errors.lastName" class="mt-1 text-sm text-red-500">{{ errors.lastName }}</p>
            </div>

            <!-- First Name -->
            <div>
              <label
                for="firstName"
                class="block text-sm font-medium mb-1 text-mainText dark:text-mainText-dark"
                >Prénom*</label
              >
              <input
                id="firstName"
                v-model="formData.firstName"
                type="text"
                required
                class="block w-full rounded-md bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-mainText dark:text-mainText-dark shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:ring-2 focus:ring-purple-500 sm:text-sm sm:leading-6 p-3"
              />
              <p v-if="errors.firstName" class="mt-1 text-sm text-red-500">
                {{ errors.firstName }}
              </p>
            </div>
          </div>

          <!-- Email & About -->
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <!-- Email -->
            <div>
              <label
                for="email"
                class="block text-sm font-medium mb-1 text-mainText dark:text-mainText-dark"
                >E-Mail*</label
              >
              <input
                id="email"
                v-model="formData.email"
                type="email"
                required
                class="block w-full rounded-md bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-mainText dark:text-mainText-dark shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:ring-2 focus:ring-purple-500 sm:text-sm sm:leading-6 p-3"
              />
              <p v-if="errors.email" class="mt-1 text-sm text-red-500">{{ errors.email }}</p>
            </div>

            <!-- Subject/About -->
            <div>
              <label
                for="about"
                class="block text-sm font-medium mb-1 text-mainText dark:text-mainText-dark"
                >À propos de*</label
              >
              <select
                id="about"
                v-model="formData.about"
                required
                class="block w-full rounded-md bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-mainText dark:text-mainText-dark shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:ring-2 focus:ring-purple-500 sm:text-sm sm:leading-6 p-3"
              >
                <option value="" disabled selected>Choisissez un sujet</option>
                <option v-for="option in aboutOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
              <p v-if="errors.about" class="mt-1 text-sm text-red-500">{{ errors.about }}</p>
            </div>
          </div>

          <!-- ————— Encart affiché uniquement pour “Inscription” -->
          <div
            v-if="isRegistration"
            class="mt-4 rounded-md border border-yellow-300 bg-yellow-50 dark:bg-yellow-900/30 p-4 text-yellow-900 dark:text-yellow-100"
          >
            <p class="font-semibold mb-2">
              Avant de nous contacter, merci de lire et de remplir les deux documents ci-dessous 👇
            </p>
            <ul class="list-disc ml-6 space-y-1">
              <li v-for="doc in registrationDocs" :key="doc.url">
                <a
                  :href="doc.url"
                  download
                  class="text-purple-700 dark:text-purple-300 underline hover:no-underline"
                >
                  {{ doc.name }}
                </a>
              </li>
            </ul>

            <div class="mt-3">
              <p>
                Une fois complétés, vous pouvez nous les transmettre et/ou poser vos questions
                directement par e‑mail à
                <a
                  href="mailto:secretaire@bsmbasket.fr"
                  class="font-semibold text-purple-700 dark:text-purple-300 underline hover:no-underline"
                >
                  secretaire@bsmbasket.fr </a
                >.
              </p>
            </div>
          </div>

          <!-- Message -->
          <div>
            <label
              for="message"
              class="block text-sm font-medium mb-1 text-mainText dark:text-mainText-dark"
              >Message*</label
            >
            <textarea
              id="message"
              v-model="formData.message"
              rows="6"
              required
              class="block w-full rounded-md bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-mainText dark:text-mainText-dark shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:ring-2 focus:ring-purple-500 sm:text-sm sm:leading-6 p-3"
            ></textarea>
            <p v-if="errors.message" class="mt-1 text-sm text-red-500">{{ errors.message }}</p>
          </div>

          <!-- Consent Checkbox -->
          <div>
            <div class="flex items-start space-x-3">
              <div class="flex items-center h-6">
                <input
                  id="consent"
                  v-model="formData.consent"
                  type="checkbox"
                  required
                  class="h-4 w-4 rounded border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700 text-purple-600 focus:ring-purple-500"
                />
              </div>
              <label for="consent" class="text-sm text-mutedText dark:text-mutedText-dark">
                En cochant cette case et en soumettant ce formulaire, j'accepte que mes données
                personnelles soient utilisées pour me recontacter dans le cadre de ma demande
                indiquée dans ce formulaire. Aucun autre traitement ne sera effectué avec mes
                informations.
              </label>
            </div>
            <p v-if="errors.consent" class="mt-1 text-sm text-red-500">{{ errors.consent }}</p>
          </div>

          <p v-if="submitError" class="text-sm text-red-500">
            Une erreur est survenue lors de l'envoi. Veuillez réessayer.
          </p>

          <div class="flex justify-end">
            <button
              type="submit"
              class="px-8 py-3 bg-purple-600 text-white font-semibold rounded-md md:hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transform transition-all duration-200 uppercase tracking-wider"
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
/* You can keep the custom CSS for autofill backgrounds if desired. */
:root {
  --input-bg: #2a3142;
}

input:-webkit-autofill,
textarea:-webkit-autofill,
select:-webkit-autofill {
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
