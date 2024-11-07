<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface NewsArticle {
  id: number
  title: string
  excerpt: string
  author: string
  date: string
  image: string
  category: string
}

const articles = ref<NewsArticle[]>([
  {
    id: 1,
    title: "L'équipe BSM remporte le championnat régional",
    excerpt: 'Une victoire écrasante qui propulse notre équipe vers de nouveaux sommets.',
    author: 'Jean Dupont',
    date: '2024-03-15',
    image: 'https://placehold.co/600x400',
    category: 'Victoires',
  },
  {
    id: 2,
    title: 'Nouveau partenariat avec EquipSport',
    excerpt: "BSM s'associe à EquipSport pour fournir le meilleur équipement à nos joueurs.",
    author: 'Marie Curie',
    date: '2024-03-10',
    image: 'https://placehold.co/600x400',
    category: 'Partenariats',
  },
  {
    id: 3,
    title: "Stage d'été BSM : les inscriptions sont ouvertes",
    excerpt: 'Perfectionnez vos compétences cet été avec nos entraîneurs professionnels.',
    author: 'Pierre Martin',
    date: '2024-03-05',
    image: 'https://placehold.co/600x400',
    category: 'Événements',
  },
  {
    id: 4,
    title: 'Interview exclusive avec notre capitaine',
    excerpt: 'Découvrez les secrets de notre succès avec une interview inédite de notre capitaine.',
    author: 'Sophie Dubois',
    date: '2024-02-28',
    image: 'https://placehold.co/600x400',
    category: 'Interviews',
  },
  {
    id: 5,
    title: 'Bilan de mi-saison : BSM en tête du classement',
    excerpt: 'Analyse des performances exceptionnelles de notre équipe à mi-parcours.',
    author: 'Luc Girard',
    date: '2024-02-20',
    image: 'https://placehold.co/600x400',
    category: 'Analyses',
  },
  {
    id: 6,
    title: 'Journée portes ouvertes : venez découvrir le BSM',
    excerpt: 'Une occasion unique de rencontrer nos joueurs et de visiter nos installations.',
    author: 'Émilie Rousseau',
    date: '2024-02-15',
    image: 'https://placehold.co/600x400',
    category: 'Événements',
  },
])

const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('fr-FR', options)
}

let scrollTween: gsap.core.Tween

onMounted(() => {
  const newsText = document.querySelector('.news-text') as HTMLElement
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
  <div class="min-h-screen bg-black">
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

    <main class="container mx-auto px-4 py-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <article
          v-for="article in articles"
          :key="article.id"
          class="news-card bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105"
        >
          <img :src="article.image" :alt="article.title" class="w-full h-48 object-cover" />
          <div class="p-6">
            <span class="text-xs font-semibold text-purple-600 uppercase tracking-wider">{{
              article.category
            }}</span>
            <h2 class="mt-2 text-xl font-semibold text-gray-800 leading-tight">
              {{ article.title }}
            </h2>
            <p class="mt-3 text-gray-600">{{ article.excerpt }}</p>
            <div class="mt-4 flex items-center">
              <div class="flex-shrink-0">
                <img
                  class="h-10 w-10 rounded-full"
                  src="https://placeholder.co/40x40"
                  :alt="article.author"
                />
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-900">{{ article.author }}</p>
                <div class="flex space-x-1 text-sm text-gray-500">
                  <time :datetime="article.date">{{ formatDate(article.date) }}</time>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </main>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

body {
  font-family: 'Inter', sans-serif;
}

.news-text {
  min-width: 200%;
}
</style>
