<script setup lang="ts">
import { ref, computed } from 'vue'
import { gsap } from 'gsap'

interface Player {
  id: number
  name: string
  position: string
  number: number
}

interface Team {
  id: number
  name: string
  image: string
  players: Player[]
  category: 'men' | 'women' | 'pleasure'
}

const teams = ref<Team[]>([
  {
    id: 1,
    name: 'Les Aigles',
    image: 'https://placehold.co/600x400',
    category: 'men',
    players: [
      { id: 1, name: 'Alex Dubois', position: 'Meneur', number: 5 },
      { id: 2, name: 'Thomas Martin', position: 'Arrière', number: 7 },
      { id: 3, name: 'Lucas Petit', position: 'Ailier', number: 10 },
      { id: 4, name: 'Maxime Leroy', position: 'Ailier fort', number: 12 },
      { id: 5, name: 'Nicolas Roux', position: 'Pivot', number: 15 },
      { id: 6, name: 'Antoine Girard', position: 'Meneur', number: 3 },
      { id: 7, name: 'Julien Moreau', position: 'Arrière', number: 8 },
      { id: 8, name: 'Étienne Lefebvre', position: 'Ailier', number: 14 },
    ],
  },
  {
    id: 2,
    name: 'Les Panthères',
    image: 'https://placehold.co/600x400',
    category: 'women',
    players: [
      { id: 9, name: 'Sophie Dupont', position: 'Meneuse', number: 4 },
      { id: 10, name: 'Emma Bernard', position: 'Arrière', number: 6 },
      { id: 11, name: 'Chloé Lambert', position: 'Ailière', number: 9 },
      { id: 12, name: 'Léa Rousseau', position: 'Ailière forte', number: 11 },
      { id: 13, name: 'Camille Fournier', position: 'Pivot', number: 13 },
      { id: 14, name: 'Manon Garnier', position: 'Meneuse', number: 2 },
      { id: 15, name: 'Inès Mercier', position: 'Arrière', number: 7 },
      { id: 16, name: 'Zoé Lemoine', position: 'Ailière', number: 15 },
    ],
  },
  {
    id: 3,
    name: 'Les Loups',
    image: 'https://placehold.co/600x400',
    category: 'men',
    players: [
      { id: 17, name: 'Hugo Durand', position: 'Meneur', number: 1 },
      { id: 18, name: 'Théo Bonnet', position: 'Arrière', number: 6 },
      { id: 19, name: 'Nathan Roussel', position: 'Ailier', number: 8 },
      { id: 20, name: 'Gabriel Marchand', position: 'Ailier fort', number: 11 },
      { id: 21, name: 'Raphaël Dumas', position: 'Pivot', number: 14 },
      { id: 22, name: 'Louis Guerin', position: 'Meneur', number: 3 },
      { id: 23, name: 'Arthur Fontaine', position: 'Arrière', number: 9 },
      { id: 24, name: 'Paul Chevalier', position: 'Ailier', number: 12 },
    ],
  },
  {
    id: 4,
    name: 'Les Tigres',
    image: 'https://placehold.co/600x400',
    category: 'women',
    players: [
      { id: 25, name: 'Léa Gauthier', position: 'Meneuse', number: 2 },
      { id: 26, name: 'Mathilde Perrin', position: 'Arrière', number: 5 },
      { id: 27, name: 'Elise Caron', position: 'Ailière', number: 7 },
      { id: 28, name: 'Adèle Lemaire', position: 'Ailière forte', number: 10 },
      { id: 29, name: 'Julie Renard', position: 'Pivot', number: 13 },
      { id: 30, name: 'Thea Noel', position: 'Meneuse', number: 4 },
      { id: 31, name: 'Lucie Masson', position: 'Arrière', number: 8 },
      { id: 32, name: 'Nora Meunier', position: 'Ailière', number: 11 },
    ],
  },
  {
    id: 5,
    name: 'Les Phénix',
    image: 'https://placehold.co/600x400',
    category: 'pleasure',
    players: [
      { id: 33, name: 'Jade Lefevre', position: 'Meneuse', number: 3 },
      { id: 34, name: 'Lina Mercier', position: 'Arrière', number: 6 },
      { id: 35, name: 'Eva Roux', position: 'Ailière', number: 9 },
      { id: 36, name: 'Léna Faure', position: 'Ailière forte', number: 12 },
      { id: 37, name: 'Alice Dubois', position: 'Pivot', number: 15 },
      { id: 38, name: 'Chloé Lemoine', position: 'Meneuse', number: 1 },
      { id: 39, name: 'Sarah Moreau', position: 'Arrière', number: 7 },
      { id: 40, name: 'Maëlle Girard', position: 'Ailière', number: 10 },
    ],
  },
])

const selectedCategory = ref<'men' | 'women' | 'pleasure'>('men')
const selectedTeam = ref<Team | null>(null)

const filteredTeams = computed(() => {
  return teams.value.filter((team) => team.category === selectedCategory.value)
})

const selectTeam = (team: Team) => {
  selectedTeam.value = team
  gsap.from('.player-card', {
    opacity: 0,
    y: 50,
    stagger: 0.1,
    duration: 0.5,
    ease: 'power2.out',
  })
}

const changeCategory = (category: 'men' | 'women' | 'pleasure') => {
  selectedCategory.value = category
  selectedTeam.value = null
  gsap.from('.team-card', {
    opacity: 0,
    scale: 0.9,
    stagger: 0.1,
    duration: 0.5,
    ease: 'power2.out',
  })
}
</script>

<template>
  <div class="min-h-screen bg-black text-white">
    <h1 class="text-4xl font-bold text-center py-8">Nos Équipes BSM</h1>

    <div class="full-width-menu mb-12 bg-[#1A1A1A]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center">
          <button
            v-for="category in ['men', 'women', 'pleasure']"
            :key="category"
            @click="changeCategory(category as 'men' | 'women' | 'pleasure')"
            class="flex-1 py-6 text-lg font-medium relative overflow-hidden transition-all duration-300 ease-in-out"
            :class="[
              selectedCategory === category ? 'text-white' : 'text-gray-400 hover:text-purple-400',
            ]"
          >
            <div
              v-if="selectedCategory === category"
              class="absolute inset-0 bg-purple-600 transition-all duration-300 ease-in-out"
            ></div>
            <span class="relative z-10">
              {{ category === 'men' ? 'Hommes' : category === 'women' ? 'Femmes' : 'Plaisir' }}
            </span>
          </button>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
        <div
          v-for="team in filteredTeams"
          :key="team.id"
          class="team-card relative overflow-hidden rounded-lg shadow-lg cursor-pointer transform transition duration-300 hover:scale-105"
          @click="selectTeam(team)"
        >
          <img :src="team.image" :alt="team.name" class="w-full h-48 object-cover" />
          <div class="absolute inset-0 flex items-center justify-center">
            <h2 class="text-2xl font-bold text-white">{{ team.name }}</h2>
          </div>
        </div>
      </div>

      <div v-if="selectedTeam" class="bg-[#1A1A1A] rounded-lg shadow-xl p-6 mb-12">
        <h2 class="text-3xl font-bold mb-6">
          {{ selectedTeam.name }}
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div
            v-for="player in selectedTeam.players"
            :key="player.id"
            class="player-card bg-gray-700 rounded-lg p-4 shadow transform transition duration-300 hover:scale-105"
          >
            <div class="flex items-center justify-between mb-2">
              <span class="text-2xl font-bold">{{ player.number }}</span>
              <span class="text-sm font-semibold text-gray-300">{{ player.position }}</span>
            </div>
            <h3 class="text-lg font-semibold text-white">{{ player.name }}</h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Antonio:wght@400;600;700&display=swap');

body {
  font-family: 'Antonio', sans-serif;
}

.full-width-menu {
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.team-card:hover {
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.player-card:hover {
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>
