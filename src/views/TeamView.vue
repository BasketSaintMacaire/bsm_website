<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { X, Users, Trophy, Smile } from 'lucide-vue-next'
import teamDataJson from '@/assets/storage_json/team.json'
import type { Team } from '@/models/Team'

const teams = ref<Team[]>(teamDataJson as Team[])
const selectedCategory = ref<'men' | 'women' | 'pleasure'>('men')
const selectedTeam = ref<Team | null>(null)
const isPanelOpen = ref(false)

const filteredTeams = computed(() => {
  return teams.value.filter((team) => team.category === selectedCategory.value)
})

const selectTeam = (team: Team) => {
  selectedTeam.value = team
  isPanelOpen.value = true
  gsap.from('.player-card', {
    opacity: 0,
    x: 50,
    stagger: 0.05,
    duration: 0.5,
    ease: 'power2.out',
  })
}

const changeCategory = (category: 'men' | 'women' | 'pleasure') => {
  selectedCategory.value = category
  selectedTeam.value = null
  isPanelOpen.value = false
  gsap.from('.team-card', {
    opacity: 0,
    scale: 0.9,
    stagger: 0.1,
    duration: 0.5,
    ease: 'power2.out',
  })
}

const closePanel = () => {
  isPanelOpen.value = false
}

const handleOutsideClick = (event: MouseEvent) => {
  const panel = document.querySelector('.sliding-panel')
  if (isPanelOpen.value && panel && !panel.contains(event.target as Node)) {
    closePanel()
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleOutsideClick)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleOutsideClick)
})
</script>

<template>
  <!-- Wrapper with token-based background & text -->
  <div class="min-h-screen bg-page dark:bg-page-dark text-mainText dark:text-mainText-dark pb-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1
        class="text-5xl font-extrabold text-center py-16 bg-clip-text text-transparent bg-purple-600"
      >
        Nos Équipes BSM
      </h1>

      <!-- Category Buttons -->
      <div class="flex justify-center space-x-6 mb-16">
        <button
          v-for="(category, index) in ['men', 'women', 'pleasure']"
          :key="category"
          @click="changeCategory(category as 'men' | 'women' | 'pleasure')"
          class="category-button relative group flex flex-col items-center"
        >
          <div
            class="w-20 h-20 rounded-full flex items-center justify-center bg-card dark:bg-card-dark md:group-hover:bg-purple-600 transition-colors duration-300"
            :class="{ 'bg-purple-600 dark:bg-purple-600': selectedCategory === category }"
          >
            <component
              :is="index === 0 ? Users : index === 1 ? Trophy : Smile"
              class="w-10 h-10"
              :class="
                selectedCategory === category
                  ? 'text-white'
                  : 'text-mutedText dark:text-mutedText-dark md:group-hover:text-white'
              "
            />
          </div>
          <span
            class="mt-2 text-lg font-medium transition-colors"
            :class="
              selectedCategory === category
                ? 'text-purple-400'
                : 'text-mutedText dark:text-mutedText-dark md:group-hover:text-purple-400'
            "
          >
            {{ category === 'men' ? 'Masculin' : category === 'women' ? 'Féminin' : 'Plaisir' }}
          </span>
        </button>
      </div>

      <!-- Teams Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="team in filteredTeams"
          :key="team.id"
          class="team-card group relative overflow-hidden rounded-xl shadow-lg cursor-pointer"
          @click.stop="selectTeam(team)"
        >
          <div
            class="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60 z-10"
          ></div>
          <img
            :src="team.image"
            :alt="team.name"
            class="w-full h-80 object-cover transition-transform duration-500 md:group-hover:scale-110"
          />
          <div class="absolute bottom-0 left-0 right-0 p-6 z-20">
            <h2 class="text-3xl font-bold text-white mb-2">{{ team.name }}</h2>
            <p class="text-mutedText dark:text-mutedText-dark text-lg">
              {{ team.players.length }} joueurs
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Overlay -->
    <div
      v-if="isPanelOpen"
      class="fixed inset-0 bg-black bg-opacity-50 dark:bg-white dark:bg-opacity-10 transition-opacity duration-300 ease-in-out z-40"
    ></div>

    <!-- Sliding Right Panel -->
    <div
      v-if="isPanelOpen"
      class="sliding-panel fixed inset-y-0 right-0 w-full sm:w-96 bg-card dark:bg-card-dark shadow-2xl transform transition-transform duration-300 ease-in-out z-50 overflow-y-auto"
      :class="isPanelOpen ? 'translate-x-0' : 'translate-x-full'"
    >
      <div class="h-full p-6">
        <!-- Panel Header -->
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-3xl font-bold text-purple-400">{{ selectedTeam?.name }}</h2>
          <button
            @click.stop="closePanel"
            class="text-mutedText dark:text-mutedText-dark hover:text-mainText dark:hover:text-mainText-dark"
          >
            <X class="w-6 h-6" />
          </button>
        </div>

        <!-- Players List -->
        <div v-if="selectedTeam" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            v-for="player in selectedTeam.players"
            :key="player.id"
            class="player-card bg-gray-200 dark:bg-gray-700 rounded-lg p-4 shadow transform transition duration-300 md:hover:scale-105 md:hover:bg-purple-700"
          >
            <div class="flex items-center justify-between mb-2">
              <span class="text-3xl font-bold text-purple-400">{{ player.number }}</span>
              <span
                class="text-sm font-semibold bg-gray-300 dark:bg-gray-600 text-mainText dark:text-mainText-dark px-2 py-1 rounded"
              >
                {{ player.position }}
              </span>
            </div>
            <h3 class="text-lg font-semibold text-mainText dark:text-mainText-dark">
              {{ player.name }}
            </h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.team-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

@media (min-width: 768px) {
  .team-card:hover::after {
    opacity: 1;
  }

  .player-card:hover {
    transform: rotateY(10deg);
  }
}

.player-card {
  backface-visibility: hidden;
  perspective: 1000px;
}
</style>
