<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { X, Calendar, User, Tag } from 'lucide-vue-next'

gsap.registerPlugin(ScrollTrigger)

interface NewsArticle {
  id: number
  title: string
  excerpt: string
  content: string
  author: string
  date: string
  image: string
  category: string
}

const articles = ref<NewsArticle[]>([
  {
    id: 1,
    title: 'Direction la Région pour nos U13 M1 et U15 M1',
    excerpt:
      'Félicitations à nos équipes qui ont brillamment décroché leur place en Région lors de la première phase !',
    content:
      'Un grand bravo à nos U13 M1 et nos U15 M1 qui accèdent désormais à la Région grâce à leurs remarquables performances lors de cette première phase. Nos U15 M1 ont réalisé un sans-faute avec 10 victoires en 10 matchs, tandis que nos U13 M1 s’imposent avec 7 victoires sur 8 matchs disputés. Nous comptons sur vous pour continuer à les encourager et les soutenir afin qu’ils poursuivent leur ascension. #laforcedesloups',
    author: 'Jeanne Moreau',
    date: '2025-01-06',
    image: '/gallery/news/img_region.jpg',
    category: 'Compétitions',
  },
  {
    id: 2,
    title: 'Remise du Label Départemental MiniBasket',
    excerpt:
      'Le Basket Saint-Macaire reçoit le Label MiniBasket autour d’une journée de matchs et de festivités.',
    content:
      'Ce samedi, le Basket Saint-Macaire a officiellement reçu le Label Départemental MiniBasket lors d’une cérémonie ponctuée de rencontres MiniBasket. Le label or a été remis par Nathalie BOURRY, responsable du Pôle Développement et Vivre Ensemble, à Céline GRASSET (présidente), Jérémy POILANE (référent MiniBasket) et Julien BEAUDOUIN (entraîneur des U7), en présence de Chantal GOURDON, adjointe territoriale de Saint-Macaire-en-Mauges, et Vincent BLANCHARD, adjoint aux sports. Un grand merci également à @intersport_clubscoentreprises et au @creditmutuel, partenaires de ce label. #B49',
    author: 'Ilona Danet',
    date: '2024-12-04',
    image: 'gallery/news/remise_label_mini_basket.jpg',
    category: 'Événements',
  },
  {
    id: 3,
    title: 'TOUS EN ROSE : BSM s’engage pour Octobre Rose',
    excerpt:
      'Le BSM organise une bourriche et une vente de crêpes au profit de la lutte contre le cancer du sein.',
    content:
      'Samedi 12 octobre, le Basket Saint-Macaire se mobilise pour Octobre Rose ! Le bureau des jeunes organise une bourriche et une vente de crêpes dès 16h15 à la salle Georges Raymond. Les participants pourront tenter de deviner le nombre de bonbons roses, tout en soutenant une bonne cause. L’intégralité des fonds récoltés sera reversée à la Ligue contre le cancer du sein. Venez nombreux participer et soutenir cette belle initiative !',
    author: 'Bureau des jeunes',
    date: '2024-10-08',
    image: 'gallery/news/octobre_rose.jpg',
    category: 'Événements',
  },
  {
    id: 4,
    title: 'Tournoi du Fair-Play 2025 : Respect et Convivialité au Rendez-vous',
    excerpt:
      'Le célèbre tournoi du Fair-play revient le dimanche 06 avril 2025 pour les catégories U09 et U11.',
    content:
      'Notre célèbre Tournoi du Fair-play fait son grand retour le dimanche 06 avril 2025 ! Destiné aux U09 et U11, cet événement mythique se déroulera autour de la thématique du respect. Pour vous inscrire, rendez-vous sur le lien suivant : https://www.tournify.fr/live/tournoi-fairplay2025-bsm?fbclid=PAZXh0bgNhZW0CMTEAAaZlj62Yc6hgEqV4P5GroIEvKe0QoXGOHt1jqI4eO-ZFZPEnkb8YXOk6GWg_aem_GXu0hgnPg2512x5k0NmytQ. Nous comptons sur vous pour faire de cette journée un moment inoubliable, placé sous le signe de la convivialité et du fair-play !',
    author: 'Jeanne Moreau',
    date: '2025-01-18',
    image: '/gallery/news/tournoi_fair_play.jpg',
    category: 'Tournois',
  },
  {
    id: 1,
    title: 'Le BSM Déraille : Soirée Basket Édition 2025',
    excerpt:
      'Découvrez l’affiche officielle de la soirée basket 2025 du BSM, sous le thème “Le BSM Déraille”.',
    content:
      "Chers abonnés du BSM, préparez-vous pour un événement hors du commun ! Nous avons l'honneur de vous dévoiler l’affiche officielle de la soirée du basket édition 2025, placée sous le thème « Le BSM Déraille ». Nous comptons sur vous pour arborer une tenue choc, pleine de couleurs et de folie. Bloquez d’ores et déjà la date dans vos agendas : rendez-vous en mars pour célébrer ensemble cette soirée inoubliable !",
    author: 'Le Bureau',
    date: '2025-01-18',
    image: '/gallery/news/soiree_basket.jpg',
    category: 'Événements',
  },
])

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
                <p class="text-sm font-medium text-mainText dark:text-mainText-dark">
                  {{ article.author }}
                </p>
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
                    <User class="w-4 h-4 mr-2" />
                    <span>{{ selectedArticle?.author }}</span>
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
