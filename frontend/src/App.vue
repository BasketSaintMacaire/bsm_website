<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { Menu, X, Moon, Sun, ChevronDown, ExternalLink } from 'lucide-vue-next'

const currentYear = computed(() => new Date().getFullYear())

interface NavChild {
  to: string
  text: string
}

interface NavGroup {
  id: string
  text: string
  to?: string
  children?: NavChild[]
}

const navGroups: NavGroup[] = [
  {
    id: 'club',
    text: 'LE CLUB',
    children: [
      { to: '/leclub', text: 'Présentation du club' },
      { to: '/histoire', text: 'Notre histoire & nos valeurs' },
      { to: '/equipes', text: 'Nos équipes' },
      { to: '/bureau', text: 'Le bureau' },
      { to: '/basketfit', text: "Basket'Fit" },
    ],
  },
  {
    id: 'plannings',
    text: 'PLANNINGS',
    children: [
      { to: '/planning', text: 'Matchs' },
      { to: '/planning-entrainement', text: 'Entraînements' },
    ],
  },
  { id: 'actualites', text: 'ACTUALITÉS', to: '/actualites' },
  {
    id: 'ressources',
    text: 'RESSOURCES',
    children: [
      { to: '/ressources/e-marque', text: 'e-Marque' },
      { to: '/ressources', text: 'Documents du club' },
    ],
  },
  { id: 'contact', text: 'CONTACT', to: '/contact' },
]

const BOUTIQUE_URL = 'https://mister-school.fr/615-49450-basket-saint-macaire'

const isMenuOpen = ref(false)
const openGroupId = ref<string | null>(null)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
  openGroupId.value = null
}

const closeMenu = () => {
  isMenuOpen.value = false
  openGroupId.value = null
}

const toggleGroup = (id: string) => {
  openGroupId.value = openGroupId.value === id ? null : id
}

const headerEl = ref<HTMLElement | null>(null)

const onDocumentPointerDown = (event: Event) => {
  if (headerEl.value && !headerEl.value.contains(event.target as Node)) closeMenu()
}

const onDocumentKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') closeMenu()
}

onMounted(() => {
  document.addEventListener('pointerdown', onDocumentPointerDown)
  document.addEventListener('keydown', onDocumentKeydown)
})

onUnmounted(() => {
  document.removeEventListener('pointerdown', onDocumentPointerDown)
  document.removeEventListener('keydown', onDocumentKeydown)
})

// --- THEME LOGIC ---
const isDark = ref(false)
const hasUserToggled = ref(false)

function getSystemPref() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function updateHtmlClass(value: boolean) {
  if (value) {
    document.documentElement.classList.add('dark')
    localStorage.theme = 'dark'
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.theme = 'light'
  }
}

onMounted(() => {
  if (localStorage.theme === 'dark') {
    isDark.value = true
  } else if (localStorage.theme === 'light') {
    isDark.value = false
  } else {
    isDark.value = getSystemPref()
  }
  updateHtmlClass(isDark.value)
})

watch(isDark, (value) => {
  updateHtmlClass(value)
})

onMounted(() => {
  const media = window.matchMedia('(prefers-color-scheme: dark)')
  const handler = (e: { matches: boolean }) => {
    if (!hasUserToggled.value && !('theme' in localStorage)) {
      isDark.value = e.matches
    }
  }
  media.addEventListener('change', handler)
})

function toggleTheme() {
  isDark.value = !isDark.value
  hasUserToggled.value = true
}
</script>

<template>
  <div
    class="flex flex-col min-h-screen bg-page dark:bg-page-dark text-mainText dark:text-mainText-dark"
  >
    <!-- HEADER -->
    <header
      ref="headerEl"
      class="bg-card dark:bg-card-dark fixed top-0 left-0 right-0 z-50 shadow border-b border-borderColor/40 dark:border-borderColor-dark/40"
    >
      <div
        class="max-w-7xl mx-auto px-4 sm:px-6 h-24 flex items-center justify-between gap-3 lg:gap-4"
      >
        <!-- Logo -->
        <RouterLink to="/" class="flex-shrink-0" aria-label="Accueil BSM" @click="closeMenu">
          <img alt="BSM logo" class="w-16 h-16" src="/logo.webp" />
        </RouterLink>

        <!-- Desktop nav -->
        <nav aria-label="Navigation principale" class="hidden xl:flex items-center">
          <template v-for="group in navGroups" :key="group.id">
            <!-- Simple link -->
            <RouterLink
              v-if="group.to"
              :to="group.to"
              class="px-4 py-2 rounded-md font-bold text-xl uppercase tracking-wider hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              {{ group.text }}
            </RouterLink>

            <!-- Dropdown group -->
            <div
              v-else
              class="relative"
              @mouseenter="openGroupId = group.id"
              @mouseleave="openGroupId = null"
            >
              <button
                type="button"
                :aria-expanded="openGroupId === group.id"
                :aria-controls="`menu-${group.id}`"
                class="flex items-center gap-1 px-4 py-2 rounded-md font-bold text-xl uppercase tracking-wider hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                @click="toggleGroup(group.id)"
              >
                {{ group.text }}
                <ChevronDown
                  class="w-5 h-5 transition-transform"
                  :class="openGroupId === group.id && 'rotate-180'"
                />
              </button>

              <div
                v-show="openGroupId === group.id"
                :id="`menu-${group.id}`"
                class="absolute left-0 top-full pt-2 w-64"
              >
                <ul
                  class="rounded-xl bg-card dark:bg-card-dark border border-borderColor dark:border-borderColor-dark shadow-xl py-2 overflow-hidden"
                >
                  <li v-for="child in group.children" :key="child.to">
                    <RouterLink
                      :to="child.to"
                      class="block px-4 py-2.5 text-base font-medium hover:bg-purple-50 dark:hover:bg-purple-950/50 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                      @click="closeMenu"
                    >
                      {{ child.text }}
                    </RouterLink>
                  </li>
                </ul>
              </div>
            </div>
          </template>

          <a
            :href="BOUTIQUE_URL"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-1 px-4 py-2 rounded-md font-bold text-xl uppercase tracking-wider hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          >
            Boutique
            <ExternalLink class="w-4 h-4" />
          </a>
        </nav>

        <!-- Right side actions -->
        <div class="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <RouterLink
            to="/inscription"
            class="hidden sm:inline-block bg-purple-600 text-white px-4 lg:px-6 py-2.5 rounded-md font-bold text-sm lg:text-base uppercase tracking-wider shadow-md hover:bg-purple-700 active:bg-purple-800 active:shadow-none transform active:translate-y-0.5 transition-all duration-150"
            @click="closeMenu"
          >
            S'inscrire
          </RouterLink>

          <button
            type="button"
            :aria-label="isDark ? 'Activer le thème clair' : 'Activer le thème sombre'"
            class="p-2 rounded-md hover:bg-purple-50 dark:hover:bg-purple-950/50 transition-colors"
            @click="toggleTheme"
          >
            <Moon v-if="!isDark" class="w-5 h-5" />
            <Sun v-else class="w-5 h-5" />
          </button>

          <!-- Mobile menu toggle -->
          <button
            type="button"
            class="xl:hidden p-2 rounded-md hover:bg-purple-50 dark:hover:bg-purple-950/50 transition-colors"
            :aria-expanded="isMenuOpen"
            aria-controls="mobile-nav"
            :aria-label="isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'"
            @click="toggleMenu"
          >
            <Menu v-if="!isMenuOpen" class="w-6 h-6" />
            <X v-else class="w-6 h-6" />
          </button>
        </div>
      </div>

      <!-- Mobile nav (accordion) -->
      <nav
        v-show="isMenuOpen"
        id="mobile-nav"
        aria-label="Navigation principale"
        class="xl:hidden border-t border-borderColor dark:border-borderColor-dark bg-card dark:bg-card-dark max-h-[calc(100vh-6rem)] overflow-y-auto"
      >
        <ul class="px-4 py-2 divide-y divide-borderColor/50 dark:divide-borderColor-dark/50">
          <li v-for="group in navGroups" :key="group.id">
            <RouterLink
              v-if="group.to"
              :to="group.to"
              class="block py-4 font-bold text-xl uppercase tracking-wider"
              @click="closeMenu"
            >
              {{ group.text }}
            </RouterLink>

            <template v-else>
              <button
                type="button"
                class="w-full flex items-center justify-between py-4 font-bold text-xl uppercase tracking-wider"
                :aria-expanded="openGroupId === group.id"
                :aria-controls="`mobile-menu-${group.id}`"
                @click="toggleGroup(group.id)"
              >
                {{ group.text }}
                <ChevronDown
                  class="w-5 h-5 transition-transform"
                  :class="openGroupId === group.id && 'rotate-180'"
                />
              </button>
              <ul
                v-show="openGroupId === group.id"
                :id="`mobile-menu-${group.id}`"
                class="pb-3 pl-4 space-y-1"
              >
                <li v-for="child in group.children" :key="child.to">
                  <RouterLink
                    :to="child.to"
                    class="block py-2.5 text-mutedText dark:text-mutedText-dark"
                    @click="closeMenu"
                  >
                    {{ child.text }}
                  </RouterLink>
                </li>
              </ul>
            </template>
          </li>

          <li>
            <a
              :href="BOUTIQUE_URL"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-1.5 py-4 font-bold text-xl uppercase tracking-wider"
            >
              Boutique
              <ExternalLink class="w-4 h-4" />
            </a>
          </li>

          <li class="py-4 sm:hidden">
            <RouterLink
              to="/inscription"
              class="block text-center bg-purple-600 text-white px-5 py-3 rounded-md font-bold text-sm uppercase tracking-wider"
              @click="closeMenu"
            >
              S'inscrire
            </RouterLink>
          </li>
        </ul>
      </nav>
    </header>

    <!-- MAIN CONTENT -->
    <main class="flex-grow mt-24">
      <RouterView />
    </main>

    <!-- FOOTER -->
    <footer class="bg-card dark:bg-card-dark text-mainText dark:text-mainText-dark py-12">
      <div class="container mx-auto px-4 sm:px-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <!-- Logo & Tagline -->
          <div class="space-y-4">
            <img src="/logo.webp" alt="BSM Logo" class="w-20 h-20" />
            <p class="text-sm text-mutedText dark:text-mutedText-dark">
              La force des loups est dans la meute
            </p>
          </div>

          <!-- Contact Info -->
          <section>
            <h2 class="text-lg font-semibold mb-4">Contact</h2>
            <address class="space-y-2 text-sm text-mutedText dark:text-mutedText-dark not-italic">
              <p>Stade Georges Raymond</p>
              <p>contact@bsmbasket.fr</p>
            </address>
            <RouterLink
              to="/contact"
              class="inline-block mt-4 text-sm font-semibold text-purple-500 hover:text-purple-400 transition-colors"
            >
              Nous écrire →
            </RouterLink>
          </section>

          <!-- Sitemap mirroring the header groups -->
          <div class="sm:col-span-2 grid grid-cols-2 gap-8">
            <nav
              v-for="group in navGroups.filter((g) => g.children)"
              :key="group.id"
              :aria-label="group.text"
            >
              <h2 class="text-lg font-semibold mb-4">{{ group.text }}</h2>
              <ul class="space-y-2 text-sm">
                <li v-for="child in group.children" :key="child.to">
                  <RouterLink
                    :to="child.to"
                    class="text-mutedText dark:text-mutedText-dark hover:text-purple-400 transition-colors"
                  >
                    {{ child.text }}
                  </RouterLink>
                </li>
              </ul>
            </nav>

            <section>
              <h2 class="text-lg font-semibold mb-4">Suivez-nous</h2>
              <nav aria-label="Réseaux sociaux" class="flex space-x-4">
                <a
                  href="https://www.instagram.com/basket_st_macaire/"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-mutedText dark:text-mutedText-dark hover:text-yellow-400 transition-colors"
                  aria-label="Instagram"
                >
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
                    />
                  </svg>
                </a>
                <a
                  href="https://www.facebook.com/BsmBasketBall"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-mutedText dark:text-mutedText-dark hover:text-yellow-400 transition-colors"
                  aria-label="Facebook"
                >
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.52c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                    />
                  </svg>
                </a>
              </nav>

              <RouterLink
                to="/inscription"
                class="inline-block mt-6 bg-purple-600 text-white px-5 py-2.5 rounded-md font-bold text-xs uppercase tracking-wider hover:bg-purple-700 transition-colors"
              >
                S'inscrire
              </RouterLink>
            </section>
          </div>
        </div>

        <!-- Bottom Bar -->
        <div
          class="mt-12 pt-8 border-t border-borderColor dark:border-borderColor-dark flex flex-col sm:flex-row justify-between items-center text-sm text-mutedText dark:text-mutedText-dark"
        >
          <p>&copy; {{ currentYear }} BASKET SAINT MACAIRE. Tous droits réservés.</p>
          <nav aria-label="Liens légaux" class="mt-4 sm:mt-0">
            <RouterLink
              to="/mentions-legales"
              class="hover:text-purple-400 transition-colors text-mainText dark:text-mainText-dark"
            >
              Mentions légales
            </RouterLink>
            <span class="mx-2">|</span>
            <RouterLink
              to="/politique-de-confidentialite"
              class="hover:text-purple-400 transition-colors text-mainText dark:text-mainText-dark"
            >
              Politique de confidentialité
            </RouterLink>
          </nav>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.router-link-active:not(.bg-purple-600) {
  color: theme('colors.purple.600');
}
</style>
