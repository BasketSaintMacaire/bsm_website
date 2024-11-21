<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronRight } from 'lucide-vue-next'

const router = useRouter()

interface Section {
  id: string
  title: string
  route: string
  gridArea: string
}

const sections = ref<Section[]>([
  {
    id: 'history',
    title: 'NOTRE HISTOIRE & NOS VALEURS',
    route: '/histoire',
    gridArea: 'histoire',
  },
  {
    id: 'teams',
    title: 'NOS ÉQUIPES',
    route: '/equipes',
    gridArea: 'equipes',
  },
  {
    id: 'board',
    title: 'NOTRE BUREAU',
    route: '/bureau',
    gridArea: 'board',
  },
])

const navigateTo = (route: string) => {
  router.push(route)
}
</script>

<template>
  <div class="min-h-screen bg-black">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="club-grid">
        <!--Header Section -->
        <div class="header-section relative rounded-xl overflow-hidden mb-16 group">
          <img
            src="@/assets/club_plan_large.jpg"
            alt="Basketball action"
            class="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div class="absolute top-4 left-4 z-10">
            <img src="/logo.png" alt="BSM Logo" class="w-24 h-24" />
          </div>
          <div class="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
          <h1 class="absolute bottom-8 left-8 text-4xl font-bold text-white">
            DÉCOUVREZ<br />NOTRE CLUB
          </h1>
        </div>

        <!-- Grid Sections -->
        <div
          v-for="section in sections"
          :key="section.id"
          :class="`section-${section.id}`"
          class="relative bg-black p-6 cursor-pointer group"
          @click="navigateTo(section.route)"
        >
          <div class="h-full flex flex-col justify-between">
            <h2 class="text-2xl font-bold text-white">{{ section.title }}</h2>

            <!-- Arrow for all sections -->
            <div
              class="absolute bottom-4 right-4 bg-purple-600 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight class="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.club-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: auto auto auto;
  grid-template-areas:
    'header header'
    'history teams'
    'board board';
  gap: 1rem;
  padding: 2rem 0;
}

.header-section {
  grid-area: header;
}

.section-history {
  grid-area: history;
  background-color: #111;
  border-radius: 0.5rem;
  min-height: 200px;
}

.section-teams {
  grid-area: teams;
  background-color: #111;
  border-radius: 0.5rem;
  min-height: 200px;
}

.section-board {
  grid-area: board;
  background-color: #111;
  border-radius: 0.5rem;
  min-height: 200px;
}

@media (min-width: 768px) {
  .club-grid {
    grid-template-columns: repeat(3, 1fr);
    grid-template-areas:
      'header header header'
      'history teams board';
  }
}

/* Hover Effects */
.section-history:hover,
.section-teams:hover,
.section-board:hover {
  background-color: #1a1a1a;
  transition: background-color 0.3s ease;
}
</style>
