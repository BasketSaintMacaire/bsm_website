<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { X, Calendar, Tag } from 'lucide-vue-next'
import type { NewsArticle } from '@/models/NewsArticle'
import newsArticleDataJson from '@/assets/storage_json/news_article.json'

gsap.registerPlugin(ScrollTrigger)

const articles = ref<NewsArticle[]>(newsArticleDataJson as NewsArticle[])

const selectedArticle = ref<NewsArticle | null>(null)
const showModal = ref(false)

const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('fr-FR', options)
}

const openModal = (article: NewsArticle) => {
  selectedArticle.value = article
  showModal.value = true
  document.body.style.overflow = 'hidden'
}

const closeModal = () => {
  showModal.value = false
  document.body.style.overflow = 'auto'
}

let scrollTween: gsap.core.Tween

onMounted(() => {
  const newsText = document.querySelector('.news-text') as HTMLElement
  if (newsText) {
    const textWidth = newsText.offsetWidth
    const windowWidth = window.innerWidth

    scrollTween = gsap.to(newsText, {
      x: () => -(textWidth - windowWidth),
      ease: 'none',
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
      },
    })
  }

  gsap.utils.toArray<Element>('.news-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top bottom-=100',
        toggleActions: 'play none none reverse',
      },
      opacity: 0,
      y: 100,
      duration: 0.8,
      delay: i * 0.1,
    })
  })
})

onUnmounted(() => {
  if (scrollTween) {
    scrollTween.kill()
  }
})
</script>

<template>
  <!-- Main Wrapper: token-based background and text -->
  <div class="min-h-screen bg-page dark:bg-page-dark text-mainText dark:text-mainText-dark">
    <!-- Marquee Section (accent color) -->
    <div class="bg-purple-700 text-white py-4 w-full overflow-hidden">
      <div class="container mx-auto px-4">
        <div class="relative overflow-hidden h-32">
          <div
            class="news-text absolute whitespace-nowrap flex items-center h-full text-6xl font-bold"
          >
            News de BSM • News de BSM • News de BSM • News de BSM • News de BSM • News de BSM • News
            de BSM • News de BSM • News de BSM • News de BSM • News de BSM • News de BSM • News de
            BSM • News de BSM • News de BSM • News de BSM • News de BSM • News de BSM
          </div>
        </div>
      </div>
    </div>

    <!-- Main Container for Articles -->
    <main class="container mx-auto px-4 py-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <article
          v-for="article in articles.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          )"
          :key="article.id"
          class="news-card bg-card dark:bg-card-dark rounded-lg shadow-lg overflow-hidden transform transition duration-300 md:hover:scale-105 cursor-pointer"
          @click="openModal(article)"
        >
          <img :src="article.image" :alt="article.title" class="w-full h-48 object-cover" />

          <div class="p-6">
            <!-- Category Accent -->
            <span class="text-xs font-semibold text-purple-400 uppercase tracking-wider">
              {{ article.category }}
            </span>

            <!-- Title -->
            <h2
              class="mt-2 text-xl font-semibold text-mainText dark:text-mainText-dark leading-tight"
            >
              {{ article.title }}
            </h2>

            <!-- Excerpt -->
            <p class="mt-3 text-mutedText dark:text-mutedText-dark">
              {{ article.excerpt }}
            </p>

            <!-- Author & Date -->
            <div class="mt-4 flex items-center">
              <div class="ml-3">
                <div class="flex space-x-1 text-sm text-mutedText dark:text-mutedText-dark">
                  <time :datetime="article.date">
                    {{ formatDate(article.date) }}
                  </time>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </main>

    <!-- Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-black bg-opacity-75 transition-opacity"
        aria-hidden="true"
        @click="closeModal"
      ></div>

      <!-- Modal Content -->
      <div
        class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0"
      >
        <!-- Spacer to center in older browsers -->
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"
          >&#8203;</span
        >

        <div
          class="inline-block align-bottom bg-card dark:bg-card-dark rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full relative"
        >
          <!-- Close Button -->
          <div class="absolute top-0 right-0 pt-4 pr-4">
            <button
              @click="closeModal"
              class="text-mutedText dark:text-mutedText-dark hover:text-mainText dark:hover:text-mainText-dark focus:outline-none transition ease-in-out duration-150"
              aria-label="Close"
            >
              <X class="h-6 w-6" />
            </button>
          </div>

          <!-- Modal Body -->
          <div class="px-4 pt-5 pb-4 sm:p-6 sm:pb-4 max-h-[90vh] overflow-y-auto">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3
                  class="text-3xl leading-6 font-bold text-mainText dark:text-mainText-dark mb-4"
                  id="modal-title"
                >
                  {{ selectedArticle?.title }}
                </h3>

                <!-- Meta Info (Date, Author, Category) -->
                <div
                  class="flex items-center justify-between mb-6 text-sm text-mutedText dark:text-mutedText-dark"
                >
                  <div class="flex items-center">
                    <Calendar class="w-4 h-4 mr-2" />
                    <span>{{ formatDate(selectedArticle?.date || '') }}</span>
                  </div>
                  <div class="flex items-center">
                    <Tag class="w-4 h-4 mr-2" />
                    <span>{{ selectedArticle?.category }}</span>
                  </div>
                </div>

                <!-- Image -->
                <div class="relative overflow-hidden mb-6">
                  <img
                    :src="selectedArticle?.image"
                    :alt="selectedArticle?.title"
                    class="w-full h-auto object-cover"
                  />
                </div>

                <!-- Content -->
                <div class="text-base text-mutedText dark:text-mutedText-dark mb-8">
                  {{ selectedArticle?.content }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.news-text {
  min-width: 200%;
}
</style>
