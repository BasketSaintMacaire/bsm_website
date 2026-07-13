<script setup lang="ts">
import { useRouter, RouterLink } from 'vue-router'
import { useAdminAuth } from '@/composables/useAdminAuth'

const router = useRouter()
const { logout } = useAdminAuth()

function handleLogout() {
  logout()
  router.push({ name: 'admin-login' })
}

const navItems = [
  { name: 'Tableau de bord', to: { name: 'admin-dashboard' } },
  { name: 'Comités', to: { name: 'admin-committees' } },
  { name: 'Rôles clés', to: { name: 'admin-key-roles' } },
  { name: 'Historique', to: { name: 'admin-history-events' } },
  { name: 'Matchs', to: { name: 'admin-matches' } },
  { name: 'Actualités', to: { name: 'admin-news' } },
  { name: 'Produits', to: { name: 'admin-products' } },
  { name: 'Événements saison', to: { name: 'admin-season-events' } },
  { name: 'Équipes', to: { name: 'admin-teams' } },
  { name: 'Planning entraînement', to: { name: 'admin-training-schedules' } },
]
</script>

<template>
  <div class="flex min-h-screen bg-gray-100">
    <!-- Sidebar -->
    <aside class="w-60 bg-gray-900 flex flex-col shrink-0">
      <div class="px-5 py-4 border-b border-gray-700">
        <span class="text-white font-bold text-lg">BSM Admin</span>
      </div>
      <nav class="flex-1 overflow-y-auto py-2">
        <RouterLink
          v-for="item in navItems"
          :key="item.name"
          :to="item.to"
          class="block px-5 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          active-class="bg-purple-700 text-white"
        >
          {{ item.name }}
        </RouterLink>
      </nav>
      <div class="px-5 py-4 border-t border-gray-700">
        <button
          @click="handleLogout"
          class="w-full text-left text-sm text-gray-400 hover:text-white transition-colors"
        >
          Déconnexion
        </button>
      </div>
    </aside>

    <!-- Main -->
    <main class="flex-1 overflow-y-auto">
      <RouterView />
    </main>
  </div>
</template>
