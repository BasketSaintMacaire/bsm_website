<script setup lang="ts">
import { ref } from 'vue'
import {
  Users2,
  Calendar,
  Trophy,
  HeartHandshake,
  Megaphone,
  PiggyBank,
  ChevronRight,
} from 'lucide-vue-next'

interface Committee {
  id: number
  name: string
  description: string
  icon: any
  members: string[]
}

const committees = ref<Committee[]>([
  {
    id: 1,
    name: 'Commission Sportive',
    description: 'Gestion des équipes et de la politique sportive du club',
    icon: Trophy,
    members: ['Marie D.', 'Thomas B.', 'Julie M.'],
  },
  {
    id: 2,
    name: 'Commission Animation',
    description: 'Organisation des événements et de la vie du club',
    icon: Calendar,
    members: ['Pierre L.', 'Sophie R.', 'Lucas G.'],
  },
  {
    id: 3,
    name: 'Commission Communication',
    description: 'Gestion de la communication interne et externe',
    icon: Megaphone,
    members: ['Antoine P.', 'Claire M.', 'Nicolas S.'],
  },
  {
    id: 4,
    name: 'Commission Sponsoring',
    description: 'Recherche et relation avec les partenaires',
    icon: PiggyBank,
    members: ['Laurent D.', 'Sarah B.', 'Michel R.'],
  },
])

const showVolunteerForm = ref(false)
const formData = ref({
  name: '',
  email: '',
  interest: '',
})

const submitForm = () => {
  // Handle form submission
  showVolunteerForm.value = false
  formData.value = { name: '', email: '', interest: '' }
}
</script>

<template>
  <div class="min-h-screen bg-black py-16 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header Section -->
      <div class="text-center mb-16">
        <h1 class="text-4xl font-bold text-white mb-6">Le Bureau</h1>
        <p class="text-xl text-gray-300 max-w-3xl mx-auto">
          Une équipe passionnée de
          {{ committees.reduce((acc, curr) => acc + curr.members.length, 0) }} bénévoles qui œuvrent
          ensemble pour faire grandir le BSM.
        </p>
      </div>

      <!-- Main Image Section -->
      <div class="relative rounded-xl overflow-hidden mb-16 group">
        <img
          src="https://placehold.co/400x1200"
          alt="Réunion du bureau"
          class="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
        <div class="absolute bottom-0 left-0 p-8">
          <p class="text-white text-lg max-w-2xl">
            Le bureau, composé d'une vingtaine de membres, se réunit environ une fois par mois et
            plus souvent à l'approche des manifestations programmées.
          </p>
        </div>
      </div>

      <!-- Committees Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div
          v-for="committee in committees"
          :key="committee.id"
          class="bg-[#1A1A1A] rounded-xl p-6 transform hover:-translate-y-2 transition-all duration-300"
        >
          <div class="flex items-center mb-4">
            <component :is="committee.icon" class="w-8 h-8 text-purple-500 mr-3" />
            <h3 class="text-xl font-semibold text-white">{{ committee.name }}</h3>
          </div>
          <p class="text-gray-300 mb-4">{{ committee.description }}</p>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="member in committee.members"
              :key="member"
              class="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm"
            >
              {{ member }}
            </span>
          </div>
        </div>
      </div>

      <!-- Volunteer Section -->
      <div class="bg-[#1A1A1A] rounded-xl p-8 relative overflow-hidden">
        <div class="relative z-10">
          <div class="flex items-center mb-6">
            <HeartHandshake class="w-10 h-10 text-purple-500 mr-4" />
            <h2 class="text-2xl font-bold text-white">Rejoignez-nous !</h2>
          </div>

          <div class="flex flex-col md:flex-row items-center justify-between">
            <div class="mb-6 md:mb-0 md:mr-8 max-w-xl">
              <p class="text-gray-300 mb-4">
                Nous sommes constamment en quête de bénévoles. N'hésitez pas à vous joindre à nous
                pour contribuer avec enthousiasme à nos projets dans une atmosphère conviviale.
              </p>
              <button
                @click="showVolunteerForm = true"
                class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center group"
              >
                Devenir Bénévole
                <ChevronRight
                  class="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform"
                />
              </button>
            </div>

            <!-- Volunteer Form -->
            <div v-if="showVolunteerForm" class="bg-gray-900 p-6 rounded-lg w-full md:w-96">
              <form @submit.prevent="submitForm" class="space-y-4">
                <div>
                  <label for="name" class="block text-sm font-medium text-gray-300 mb-1">Nom</label>
                  <input
                    v-model="formData.name"
                    type="text"
                    id="name"
                    class="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label for="email" class="block text-sm font-medium text-gray-300 mb-1"
                    >Email</label
                  >
                  <input
                    v-model="formData.email"
                    type="email"
                    id="email"
                    class="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label for="interest" class="block text-sm font-medium text-gray-300 mb-1"
                    >Centre d'intérêt</label
                  >
                  <textarea
                    v-model="formData.interest"
                    id="interest"
                    rows="3"
                    class="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  ></textarea>
                </div>
                <div class="flex justify-end space-x-3">
                  <button
                    type="button"
                    @click="showVolunteerForm = false"
                    class="px-4 py-2 text-gray-300 hover:text-white"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold"
                  >
                    Envoyer
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Background Pattern -->
        <div class="absolute top-0 right-0 w-1/3 h-full opacity-10">
          <Users2 class="w-full h-full text-purple-500" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Smooth transition for form */
.volunteer-form-enter-active,
.volunteer-form-leave-active {
  transition: all 0.3s ease;
}

.volunteer-form-enter-from,
.volunteer-form-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
