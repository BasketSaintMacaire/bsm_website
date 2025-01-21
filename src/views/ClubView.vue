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
  <!-- Main page wrapper using Tailwind theme tokens -->
  <div class="min-h-screen bg-page dark:bg-page-dark text-mainText dark:text-mainText-dark">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="club-grid">
        <!-- Grid container (layout in <style> below) -->

        <!-- Header Section -->
        <div class="header-section relative rounded-xl overflow-hidden mb-16 group">
          <img
            src="@/assets/club_plan_large.jpg"
            alt="Basketball action"
            class="w-full h-[400px] object-cover transition-transform duration-700 md:group-hover:scale-105"
          />
          <div class="absolute top-4 left-4 z-10">
            <img src="/logo.png" alt="BSM Logo" class="w-24 h-24" />
          </div>
          <!-- Gradient overlay -->
          <div
            class="absolute inset-0 bg-gradient-to-t from-black dark:from-page-dark to-transparent"
          ></div>
          <h1 class="absolute bottom-8 left-8 text-4xl font-bold text-white">
            DÉCOUVREZ<br />NOTRE CLUB
          </h1>
        </div>

        <!-- Grid Sections -->
        <div
          v-for="section in sections"
          :key="section.id"
          :class="[
            // For grid-area layout only
            `section-${section.id}`,

            // Common classes for each section
            'relative cursor-pointer group',

            // Reintroduce min-height & border radius from your original <style>:
            'min-h-[200px] rounded-lg p-6',

            // We'll handle background color & hover with Tailwind classes:
            'bg-card dark:bg-card-dark',

            // Smooth hover transitions
            'transition-colors duration-300',

            // On hover (for md+ screens), lighten in light mode / remain dark in dark mode
            'md:hover:bg-gray-100 dark:md:hover:bg-card-dark',
          ]"
          @click="navigateTo(section.route)"
        >
          <!-- The content inside the clickable section -->
          <div class="h-full flex flex-col justify-between">
            <h2 class="text-2xl font-bold text-mainText dark:text-mainText-dark">
              {{ section.title }}
            </h2>

            <!-- Arrow icon (appears on hover) -->
            <div
              class="absolute bottom-4 right-4 bg-purple-600 rounded-full p-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
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
  padding: 2rem 0; /* optional if you like spacing */
}

.header-section {
  grid-area: header;
}

/* These classes only define the grid-areas, not color/border/height */
.section-history {
  grid-area: history;
}
.section-teams {
  grid-area: teams;
}
.section-board {
  grid-area: board;
}

/* Responsive grid for larger screens */
@media (min-width: 768px) {
  .club-grid {
    grid-template-columns: repeat(3, 1fr);
    grid-template-areas:
      'header header header'
      'history teams board';
  }
}
</style>
