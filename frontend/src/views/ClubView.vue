<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronRight, Award, Activity, Check } from 'lucide-vue-next'

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

// Mini Basket Label Features
const miniBasketFeatures = ref([
  'Formation de qualité pour les 5-11 ans',
  'Encadrement par des éducateurs diplômés',
  'Approche pédagogique adaptée aux enfants',
  'Matériel spécifique et adapté',
  'Événements dédiés aux jeunes basketteurs',
])

// Basket Fit Label Features
const basketFitFeatures = ref([
  'Programme de fitness basé sur le basketball',
  'Accessible à tous les niveaux',
  'Combinaison de cardio et renforcement musculaire',
  'Ambiance conviviale et dynamique',
  'Encadré par des coachs certifiés',
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
            src="@/assets/club_plan_large.webp"
            alt="Basketball action"
            class="w-full h-[400px] object-cover transition-transform duration-700 md:group-hover:scale-105"
          />
          <div class="absolute top-4 left-4 z-10">
            <img src="/logo.webp" alt="BSM Logo" class="w-24 h-24" />
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

      <!-- Règlement du Club Section -->
      <div class="mb-16">
        <div class="relative bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl overflow-hidden">
          <div class="absolute top-0 right-0 w-64 h-64 opacity-10">
            <Award class="w-full h-full" />
          </div>

          <div class="p-8">
            <div class="flex items-center mb-4">
              <Award class="w-10 h-10 text-white mr-3" />
              <h3 class="text-2xl font-bold text-white">RÈGLEMENT INTÉRIEUR</h3>
            </div>
            <p class="text-white mb-6 max-w-2xl">
              Consultez et téléchargez le règlement intérieur du BSM pour connaître les droits et
              obligations de tous les membres du club.
            </p>
            <a
              href="/files/reglement-interieur-bsm.pdf"
              download
              class="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-300"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                ></path>
              </svg>
              Télécharger le règlement
            </a>
          </div>
        </div>
      </div>

      <!-- Labels Section Title -->
      <div class="mb-12 text-center">
        <h2
          class="text-3xl md:text-4xl font-bold text-center bg-clip-text text-transparent bg-purple-600"
        >
          NOS LABELS D'EXCELLENCE
        </h2>
        <p class="mt-2 text-mutedText dark:text-mutedText-dark">
          Découvrez les reconnaissances officielles qui distinguent notre club
        </p>
      </div>

      <!-- Mini Basket Gold Label Section -->
      <div class="mb-16 overflow-hidden">
        <div
          class="relative bg-gradient-to-r from-yellow-500 to-amber-600 rounded-xl overflow-hidden"
        >
          <div class="absolute top-0 right-0 w-64 h-64 opacity-10">
            <Award class="w-full h-full" />
          </div>

          <div class="grid md:grid-cols-2 gap-8 p-8">
            <div class="flex flex-col justify-center">
              <div class="flex items-center mb-4">
                <Award class="w-10 h-10 text-white mr-3" />
                <h3 class="text-2xl font-bold text-white">LABEL MINI BASKET OR</h3>
              </div>
              <p class="text-white mb-6">
                Le Label Mini Basket Or est la plus haute distinction décernée par la Fédération
                Française de Basketball pour la qualité de la formation des jeunes. Cette
                reconnaissance témoigne de l'engagement de notre club à offrir un environnement
                d'apprentissage exceptionnel pour les enfants de 5 à 11 ans.
              </p>
              <ul class="space-y-2">
                <li v-for="feature in miniBasketFeatures" :key="feature" class="flex items-start">
                  <div
                    class="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-white text-amber-600 mr-2"
                  >
                    <Check class="h-4 w-4" />
                  </div>
                  <span class="text-white">{{ feature }}</span>
                </li>
              </ul>
            </div>

            <div class="flex items-center justify-center">
              <div class="relative">
                <div class="absolute -inset-0.5 bg-white rounded-full opacity-20 blur"></div>
                <div class="relative bg-amber-600 rounded-full p-6 shadow-lg">
                  <img
                    src="@/assets/minibasketlabel.webp"
                    alt="Label Mini Basket Or"
                    class="w-64 h-64 object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Basket Fit Label Section -->
      <div class="mb-16 overflow-hidden">
        <div
          class="relative bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl overflow-hidden"
        >
          <div class="absolute top-0 right-0 w-64 h-64 opacity-10">
            <Activity class="w-full h-full" />
          </div>

          <div class="grid md:grid-cols-2 gap-8 p-8">
            <div class="flex items-center justify-center order-2 md:order-1">
              <div class="relative">
                <div class="absolute -inset-0.5 bg-white rounded-full opacity-20 blur"></div>
                <div class="relative bg-indigo-600 rounded-full p-6 shadow-lg">
                  <img
                    src="@/assets/baskettoniklabel.webp"
                    alt="Label Basket Fit"
                    class="w-64 h-64 object-contain"
                    onerror="this.src='/placeholder.svg?height=256&width=256'; this.onerror=null;"
                  />
                </div>
              </div>
            </div>

            <div class="flex flex-col justify-center order-1 md:order-2">
              <div class="flex items-center mb-4">
                <Activity class="w-10 h-10 text-white mr-3" />
                <h3 class="text-2xl font-bold text-white">LABEL BASKET FIT</h3>
              </div>
              <p class="text-white mb-6">
                Le Label Basket Fit reconnaît notre engagement à promouvoir le basketball comme
                activité de bien-être et de fitness. Ce programme innovant combine les mouvements du
                basketball avec des exercices de fitness pour offrir une expérience sportive
                complète, accessible à tous les âges et tous les niveaux.
              </p>
              <ul class="space-y-2">
                <li v-for="feature in basketFitFeatures" :key="feature" class="flex items-start">
                  <div
                    class="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-white text-indigo-600 mr-2"
                  >
                    <Check class="h-4 w-4" />
                  </div>
                  <span class="text-white">{{ feature }}</span>
                </li>
              </ul>
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
