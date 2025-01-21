<script setup lang="ts">
import { ref } from 'vue'
import {
  Calendar,
  Trophy,
  Megaphone,
  PiggyBank,
  Beer,
  UserPlus,
  Store,
  Crown,
  Coins,
  FileText,
} from 'lucide-vue-next'

interface Committee {
  id: number
  name: string
  description: string
  icon: any
  members: string[]
}

interface KeyRole {
  title: string
  name: string
  icon: any
}

// Key roles
const keyRoles = ref<KeyRole[]>([
  { title: 'Président', name: 'Céline GRASSET', icon: Crown },
  { title: 'Trésorier', name: 'Valentin DEVANNE', icon: Coins },
  { title: 'Secrétaire', name: 'Yasmine HUMEAU', icon: FileText },
])

// Committees
const committees = ref<Committee[]>([
  {
    id: 1,
    name: 'Commission Technique',
    description: 'Gestion des équipes et de la politique sportive du club',
    icon: Trophy,
    members: [
      'Thibault HUTEAU',
      'Maxime COTTENCEAU',
      'Flavien MAILET',
      'Jérémie JOREAU',
      'Antoine GALLARD',
      'Jérémy POILANE',
      'Axel NAUD',
      'Julien BEAUDOUIN',
      'Florent PAVAGEAU',
      'Jason BIOTTEAU',
    ],
  },
  {
    id: 2,
    name: 'Commission Bar et Animation',
    description: 'Organisation des événements et de la vie du club',
    icon: Beer,
    members: ['Basile BOUMARD', 'Nathanael CERQUEUX', 'Anthony HERVE', 'Julien MORINIERE'],
  },
  {
    id: 3,
    name: 'Commission Communication',
    description: 'Gestion de la communication interne et externe',
    icon: Megaphone,
    members: [
      'Laureen HAYE',
      'Jeanne MOREAU',
      'Ilona DANET',
      'Loris BLANCHARD',
      'Simon GRASSET',
      'Claire CHARPENTIER',
      'Simon GRASSET',
      'Noa BREVET',
      'Camille BLANC',
    ],
  },
  {
    id: 4,
    name: 'Commission Sponsoring',
    description: 'Recherche et relation avec les partenaires',
    icon: PiggyBank,
    members: ['Martin BIOTTEAU', 'Justin LANDREAU'],
  },
  {
    id: 5,
    name: 'Commission Planning',
    description: 'Gestion des plannings et des feuilles de match',
    icon: Calendar,
    members: ['Olivier BARON', 'Emmanuelle'],
  },
  {
    id: 6,
    name: 'Commission Ressources Humaines',
    description: 'Gestion des recrutements',
    icon: UserPlus,
    members: ['Martin BIOTTEAU', 'Céline GRASSET', 'Yasmine HUMEAU', 'Valentin DEVANNE'],
  },
  {
    id: 7,
    name: 'Commission Boutique',
    description: 'Gestion de la boutique et des stocks',
    icon: Store,
    members: ['Emmanuelle'],
  },
])
</script>

<template>
  <!-- Main wrapper uses theme tokens for background/text -->
  <div
    class="min-h-screen bg-page dark:bg-page-dark text-mainText dark:text-mainText-dark py-16 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-7xl mx-auto">
      <!-- Header Section -->
      <div class="text-center mb-16">
        <!-- Replace text-white with text-mainText so it adapts to dark mode -->
        <h1 class="text-4xl font-bold text-mainText dark:text-mainText-dark mb-6">Le Bureau</h1>

        <!-- For muted text, use text-mutedText token -->
        <p class="text-xl text-mutedText dark:text-mutedText-dark max-w-3xl mx-auto">
          Une équipe passionnée de
          {{
            Array.from(
              new Set(
                committees
                  .flatMap((committee) => committee.members)
                  .concat(keyRoles.map((role) => role.name)),
              ),
            ).length
          }}
          bénévoles qui œuvrent ensemble pour faire grandir le BSM.
        </p>
      </div>

      <!-- Main Image Section with gradient overlay -->
      <div class="relative rounded-xl overflow-hidden mb-16 group">
        <img
          src="@/assets/committeesHeaderImg.png"
          alt="Réunion du bureau"
          class="w-full h-[400px] object-cover transition-transform duration-700 md:group-hover:scale-105"
        />
        <!-- Gradient overlay: from black in light mode, from dark-page in dark mode -->
        <div
          class="absolute inset-0 bg-gradient-to-t from-black dark:from-page-dark to-transparent"
        ></div>

        <div class="absolute bottom-0 left-0 p-8">
          <!-- For body text, use mainText or mutedText as you prefer -->
          <p class="text-mutedText dark:text-mainText-dark text-lg max-w-2xl">
            Le bureau, composé d'une vingtaine de membres, se réunit environ une fois par mois et
            plus souvent à l'approche des manifestations programmées.
          </p>
        </div>
      </div>

      <!-- Key Roles Section -->
      <div class="mb-16">
        <h2 class="text-3xl font-bold text-mainText dark:text-mainText-dark mb-8 text-center">
          Membres Clés du Bureau
        </h2>

        <!-- Key roles: keep gradient if you like the accent -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            v-for="role in keyRoles"
            :key="role.title"
            class="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6 text-center transform md:hover:scale-105 transition-all duration-300 shadow-lg"
          >
            <!-- Icon in white for contrast on purple gradient -->
            <component :is="role.icon" class="w-16 h-16 text-white mx-auto mb-4" />
            <h3 class="text-2xl font-bold text-white mb-2">
              {{ role.title }}
            </h3>
            <p class="text-xl text-gray-200">
              {{ role.name }}
            </p>
          </div>
        </div>
      </div>

      <!-- Committees Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div
          v-for="committee in committees"
          :key="committee.id"
          class="rounded-xl p-6 transform md:hover:-translate-y-2 transition-all duration-300 bg-card dark:bg-card-dark"
        >
          <div class="flex items-center mb-4">
            <!-- Keep icon color or switch to theme token -->
            <component :is="committee.icon" class="w-8 h-8 text-purple-500 mr-3" />
            <h3 class="text-xl font-semibold text-mainText dark:text-mainText-dark">
              {{ committee.name }}
            </h3>
          </div>

          <p class="text-mutedText dark:text-mutedText-dark mb-4">
            {{ committee.description }}
          </p>

          <!-- Member badges -->
          <div class="flex flex-wrap gap-2">
            <span
              v-for="member in committee.members"
              :key="member"
              class="px-3 py-1 text-sm rounded-full bg-gray-200 dark:bg-gray-700 text-mutedText dark:text-mutedText-dark transition-colors duration-300"
            >
              {{ member }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Only keep transitions/animations or layout rules here;
   we've moved color/size/border to Tailwind classes. */

/* Smooth transition for an optional volunteer form (if used) */
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
