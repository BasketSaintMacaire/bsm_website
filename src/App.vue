<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { ref } from 'vue'

const currentYear = ref(new Date().getFullYear())
</script>

<template>
  <header class="bg-[#1A1A1A] px-6 py-4">
    <div class="max-w-7xl mx-auto flex items-center justify-around">
      <RouterLink to="/" class="flex-shrink-0">
        <img alt="Vue logo" class="w-16 h-16" src="/logo.png" />
      </RouterLink>

      <nav class="flex items-center gap-8">
        <RouterLink
          v-for="(link, index) in [
            { to: '/leclub', text: 'LE CLUB' },
            { to: '/planning', text: 'PLANNINGS' },
            { to: '/boutique', text: 'BOUTIQUE' },
            { to: '/actualites', text: 'ACTUALITÉS' },
          ]"
          :key="index"
          :to="link.to"
          class="text-white font-bold text-sm uppercase tracking-wider hover:text-gray-300 transition-colors"
        >
          {{ link.text }}
        </RouterLink>

        <RouterLink
          to="/contact"
          class="inline-block bg-purple-600 text-white px-6 py-2 rounded-md font-bold text-sm uppercase tracking-wider shadow-md hover:bg-purple-700 active:bg-purple-800 active:shadow-none transform active:translate-y-0.5 transition-all duration-150"
        >
          Contact
        </RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />

  <footer class="bg-[#1A1A1A] text-white py-12">
    <div class="container mx-auto px-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Logo and Tagline -->
        <div class="space-y-4">
          <img src="/logo.png" alt="BSM Logo" class="w-20 h-20" />
          <p class="text-sm text-gray-400">La force des loups est dans la meute</p>
        </div>

        <!-- Contact Info -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Contact</h3>
          <ul class="space-y-2 text-sm text-gray-400">
            <li>Stade Georges Raymond</li>
            <li>06 84 41 53 02</li>
            <li>basket.stmacaire@yahoo.fr</li>
          </ul>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Liens Rapides</h3>
          <ul class="space-y-2 text-sm">
            <li><a href="#" class="hover:text-purple-400 transition-colors">Le Club</a></li>
            <li><a href="#" class="hover:text-purple-400 transition-colors">Plannings</a></li>
            <li><a href="#" class="hover:text-purple-400 transition-colors">Boutique</a></li>
            <li><a href="#" class="hover:text-purple-400 transition-colors">Actualités</a></li>
            <li>
              <a href="#" class="text-purple-400 hover:text-purple-300 transition-colors"
                >Contact</a
              >
            </li>
          </ul>
        </div>

        <!-- Social and Newsletter -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Suivez-nous</h3>
          <div class="flex space-x-4 mb-4">
            <a
              href="#"
              class="text-gray-400 hover:text-yellow-400 transition-colors"
              aria-label="Instagram"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
                />
              </svg>
            </a>
            <a
              href="#"
              class="text-gray-400 hover:text-yellow-400 transition-colors"
              aria-label="Facebook"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div
        class="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400"
      >
        <p>&copy; {{ currentYear }} BASKET SAINT MACAIRE. Tous droits réservés.</p>
        <div class="mt-4 md:mt-0">
          <a href="#" class="hover:text-purple-400 transition-colors">Mentions légales</a>
          <span class="mx-2">|</span>
          <a href="#" class="hover:text-purple-400 transition-colors"
            >Politique de confidentialité</a
          >
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Antonio:wght@400;600;700&display=swap');

body {
  font-family: 'Antonio', sans-serif;
}

.router-link-active:not(.bg-purple-600) {
  color: theme('colors.purple.600');
}

html {
  scroll-behavior: smooth;
}
</style>
