<script setup lang="ts">
const cards = [
  { label: 'Comités', to: 'admin-committees' },
  { label: 'Rôles clés', to: 'admin-key-roles' },
  { label: 'Historique', to: 'admin-history-events' },
  { label: 'Matchs', to: 'admin-matches' },
  { label: 'Actualités', to: 'admin-news' },
  { label: 'Produits', to: 'admin-products' },
  { label: 'Événements saison', to: 'admin-season-events' },
  { label: 'Équipes', to: 'admin-teams' },
  { label: 'Planning entraînement', to: 'admin-training-schedules' },
]
</script>

<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Tableau de bord</h1>
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
      <RouterLink
        v-for="card in cards"
        :key="card.label"
        :to="{ name: card.to }"
        class="bg-white rounded-lg shadow-sm p-5 hover:shadow-md hover:border-purple-500 border border-transparent transition-all"
      >
        <span class="text-gray-700 font-medium">{{ card.label }}</span>
      </RouterLink>
    </div>
  </div>
</template>
