<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { Menu, X, Moon, Sun } from 'lucide-vue-next'

// Existing code
const currentYear = computed(() => new Date().getFullYear())
const isMenuOpen = ref(false)

const links = [
  { to: '/leclub', text: 'LE CLUB' },
  { to: '/planning', text: 'PLANNINGS' },
  { to: '/planning-entrainement', text: 'ENTRAINEMENT' },
  { to: '/boutique', text: 'BOUTIQUE' },
  { to: '/actualites', text: 'ACTUALITÉS' },
]

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

// NEW: Dark-mode state
const isDark = ref(false)

// On mount, check localStorage for theme preference
onMounted(() => {
  if (localStorage.theme === 'dark') {
    isDark.value = true
  }
})

// Whenever isDark changes, add/remove the .dark class and store preference
watch(isDark, (value) => {
  if (value) {
    document.documentElement.classList.add('dark')
    localStorage.theme = 'dark'
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.theme = 'light'
  }
})
</script>

<template>
  <!-- Use token-based backgrounds & text on the root container -->
  <div
    class="flex flex-col min-h-screen bg-page dark:bg-page-dark text-mainText dark:text-mainText-dark"
  >
    <!-- HEADER -->
    <!-- Replace bg-[#1A1A1A] with 'bg-card dark:bg-card-dark' or your chosen color token -->
    <header
      class="bg-card dark:bg-card-dark px-4 sm:px-6 py-4 fixed top-0 left-0 right-0 z-50 shadow"
    >
      <div class="w-full mx-autoflex items-center">
        <!-- Mobile menu toggle -->
        <button @click="toggleMenu" class="md:hidden text-mainText dark:text-mainText-dark">
          <Menu v-if="!isMenuOpen" class="w-6 h-6" />
          <X v-else class="w-6 h-6" />
        </button>

        <!-- Nav links container -->
        <nav
          :class="[
            'md:flex',
            'items-center',
            'justify-around',
            'gap-8',
            {
              hidden: !isMenuOpen,
              'flex flex-col absolute top-full left-0 right-0 bg-card dark:bg-card-dark p-4 md:p-0 md:static md:flex-row':
                isMenuOpen,
            },
          ]"
          class="ml-4"
        >
          <!-- Logo -->
          <RouterLink to="/" class="flex-shrink-0" @click="closeMenu">
            <img alt="BSM logo" class="w-16 h-16" src="/logo.webp" />
          </RouterLink>

          <!-- Main nav links -->
          <RouterLink
            v-for="(link, index) in links"
            :key="index"
            :to="link.to"
            class="font-bold text-xl uppercase tracking-wider py-2 md:py-0 text-mainText dark:text-mainText-dark hover:text-mutedText dark:hover:text-mutedText-dark transition-colors"
            @click="closeMenu"
          >
            {{ link.text }}
          </RouterLink>

          <!-- Contact button -->
          <RouterLink
            to="/contact"
            class="inline-block bg-purple-600 text-white px-6 py-2 rounded-md font-bold text-sm uppercase tracking-wider shadow-md hover:bg-purple-700 active:bg-purple-800 active:shadow-none transform active:translate-y-0.5 transition-all duration-150 mt-4 md:mt-0"
            @click="closeMenu"
          >
            Contact
          </RouterLink>

          <!-- Theme Switch Button (right side) -->
          <button @click="isDark = !isDark" class="text-mainText dark:text-mainText-dark ml-4">
            <!-- Show a Moon if currently light, or a Sun if currently dark -->
            <Moon v-if="!isDark" class="w-6 h-6" />
            <Sun v-else class="w-6 h-6" />
          </button>
        </nav>
      </div>
    </header>

    <!-- MAIN CONTENT -->
    <!-- Add top margin to accommodate fixed header -->
    <main class="flex-grow mt-12 md:mt-24">
      <RouterView />
    </main>

    <!-- FOOTER -->
    <!-- Replace bg-[#1A1A1A] with 'bg-card dark:bg-card-dark' or your chosen color token -->
    <footer class="bg-card dark:bg-card-dark text-mainText dark:text-mainText-dark py-12">
      <div class="container mx-auto px-4 sm:px-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <!-- Logo & Tagline -->
          <div class="space-y-4">
            <img src="/logo.webp" alt="BSM Logo" class="w-20 h-20" />
            <!-- Subtle text: text-mutedText token -->
            <p class="text-sm text-mutedText dark:text-mutedText-dark">
              La force des loups est dans la meute
            </p>
          </div>

          <!-- Contact Info -->
          <div>
            <h3 class="text-lg font-semibold mb-4">Contact</h3>
            <ul class="space-y-2 text-sm text-mutedText dark:text-mutedText-dark">
              <li>Stade Georges Raymond</li>
              <li>06 84 41 53 02</li>
              <li>contact@bsmbasket.fr</li>
            </ul>
          </div>

          <!-- Quick Links -->
          <div>
            <h3 class="text-lg font-semibold mb-4">Liens Rapides</h3>
            <ul class="space-y-2 text-sm">
              <li v-for="(link, index) in links" :key="index">
                <RouterLink
                  :to="link.to"
                  class="hover:text-purple-400 transition-colors text-mainText dark:text-mainText-dark"
                >
                  {{ link.text }}
                </RouterLink>
              </li>
              <li>
                <RouterLink
                  to="/contact"
                  class="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Contact
                </RouterLink>
              </li>
            </ul>
          </div>

          <!-- Social and Newsletter -->
          <div>
            <h3 class="text-lg font-semibold mb-4">Suivez-nous</h3>
            <div class="flex space-x-4 mb-4">
              <a
                href="https://www.instagram.com/basket_st_macaire/"
                class="text-mutedText dark:text-mutedText-dark hover:text-yellow-400 transition-colors"
                aria-label="Instagram"
              >
                <!-- Instagram Icon -->
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
                  />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/BsmBasketBall"
                class="text-mutedText dark:text-mutedText-dark hover:text-yellow-400 transition-colors"
                aria-label="Facebook"
              >
                <!-- Facebook Icon -->
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.52c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <!-- Bottom Bar -->
        <div
          class="mt-12 pt-8 border-t border-borderColor dark:border-borderColor-dark flex flex-col sm:flex-row justify-between items-center text-sm text-mutedText dark:text-mutedText-dark"
        >
          <p>&copy; {{ currentYear }} BASKET SAINT MACAIRE. Tous droits réservés.</p>
          <div class="mt-4 sm:mt-0">
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
            <a href="/" class="hover:text-purple-400 transition-colors"> </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* Keep your custom styles as needed */

.router-link-active:not(.bg-purple-600) {
  color: theme('colors.purple.600');
}

html {
  scroll-behavior: smooth;
}
</style>
