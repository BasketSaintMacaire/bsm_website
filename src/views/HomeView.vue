<script setup lang="ts">
import ImageCarrousel from '@/components/ImageCarousel.vue'
import type { SeasonEvent } from '@/models/SeasonEvent'
import { computed, ref } from 'vue'
import SeasonEventsDataJson from '@/assets/storage_json/season_events.json'

// Example corrected scrollToTop function
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const events = ref<SeasonEvent[]>(SeasonEventsDataJson as SeasonEvent[])

const sortedEvents = computed(() => {
  return [...events.value].sort((a, b) => {
    // Convert the day, month, year to numbers
    const aYear = parseInt(a.year, 10)
    const aMonth = parseInt(a.month, 10)
    const aDay = parseInt(a.day, 10)

    const bYear = parseInt(b.year, 10)
    const bMonth = parseInt(b.month, 10)
    const bDay = parseInt(b.day, 10)

    // Option 1: Compare by difference (year, then month, then day)
    if (aYear !== bYear) {
      return aYear - bYear
    }
    if (aMonth !== bMonth) {
      return aMonth - bMonth
    }
    return aDay - bDay
  })
})
</script>

<template>
  <!-- Main wrapper using theme tokens for background/text -->
  <main class="min-h-screen bg-page dark:bg-page-dark text-mainText dark:text-mainText-dark">
    <!-- Hero Section -->
    <section class="relative h-screen">
      <img
        src="@/assets/ImageHomeView.png"
        alt="Basketball players in action"
        class="w-full h-full object-cover"
      />

      <!-- Overlay: keep black or use a token, your choice -->
      <div class="absolute inset-0 bg-black bg-opacity-40">
        <div class="container mx-auto px-6 h-full flex flex-col justify-end pb-24">
          <!-- Hero Text -->
          <h1
            class="text-5xl md:text-7xl font-extrabold max-w-2xl leading-tight bg-clip-text text-transparent bg-purple-600"
          >
            LA FORCE DES LOUPS EST DANS LA MEUTE
          </h1>

          <!-- Social Icons -->
          <div class="flex gap-4 mt-6">
            <a
              href="https://www.instagram.com/basket_st_macaire/"
              class="text-mainText-dark md:hover:text-purple-500"
            >
              <span class="sr-only">Instagram</span>
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069
                   1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919
                   4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92
                   -.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227
                   1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0
                   -3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073
                   1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618
                   6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0
                   3.668-.014 4.948-.072 4.354-.2 6.782-2.618
                   6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196
                   -4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0
                   5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163
                   6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162
                   -6.162-6.162zm0 10.162c-2.209 0-4-1.79
                   -4-4 0-2.209 1.791-4 4-4s4 1.791 4
                   4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645
                   -1.441 1.44s.645 1.44 1.441 1.44c.795 0
                   1.439-.645 1.439-1.44s-.644-1.44-1.439
                   -1.44z"
                />
              </svg>
            </a>

            <a
              href="https://www.facebook.com/BsmBasketBall"
              class="text-mainText-dark md:hover:text-purple-500"
            >
              <span class="sr-only">Facebook</span>
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M24 12.073c0-6.627-5.373-12-12-12S0
                   5.446 0 12.073c0 5.99 4.388 10.954
                   10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0
                   -3.007 1.792-4.669 4.533-4.669 1.312 0
                   2.686.235 2.686.235v2.953h-1.52c-1.491
                   0-1.956.925-1.956 1.874v2.25h3.328l
                   -.532 3.47h-2.796v8.385C19.612 23.027
                   24 18.062 24 12.073z"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Partners Section (kept black if you want, or use bg-page/card) -->
    <!-- Using the same approach for theme-based background is recommended -->
    <section class="py-16 bg-page dark:bg-page-dark">
      <h2
        class="text-3xl md:text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-purple-600"
      >
        MERCI AU SOUTIEN DE NOS PARTENAIRES
      </h2>
      <div class="dark:hidden">
        <ImageCarrousel
          gallery-name="partner_light"
          :item-height="200"
          :item-width="200"
          :zoomed="false"
        />
      </div>
      <div class="hidden dark:block">
        <ImageCarrousel
          gallery-name="partner_dark"
          :item-height="200"
          :item-width="200"
          :zoomed="false"
        />
      </div>
    </section>

    <!-- Events Section -->
    <section class="py-16">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          class="text-3xl md:text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-purple-600"
        >
          NOS ÉVÉNEMENTS DE LA SAISON
        </h2>
        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-10 justify-items-center"
        >
          <div v-for="event in sortedEvents" :key="event.day" class="w-full max-w-xs">
            <!-- Replace bg-gray-800 with a token-based background for dark mode -->
            <div
              class="bg-card dark:bg-card-dark rounded-lg overflow-hidden shadow-lg transition-transform duration-300 md:hover:scale-105"
            >
              <!-- Purple accent for top bar -->
              <div class="bg-purple-600 p-4 text-center">
                <div class="text-4xl font-bold text-white">{{ event.day }}</div>
                <div class="text-xl text-purple-200">{{ event.month }}</div>
              </div>
              <div class="p-4">
                <div class="text-lg font-semibold text-mainText dark:text-mainText-dark mb-2">
                  {{ event.name }}
                </div>
                <div class="text-purple-300">{{ event.year }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Scroll to Top Button -->
    <button
      @click="scrollToTop"
      class="fixed bottom-8 right-8 bg-purple-600 rounded-full p-3 text-white md:hover:bg-purple-700 transition-colors"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </button>
  </main>
</template>

<style scoped>
/* Keep or add any specific overrides here if needed */
</style>
