<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ClipboardList, FileDown, Scale, UserPlus, ChevronRight, FolderOpen } from 'lucide-vue-next'

const featured = {
  to: '/ressources/e-marque',
  title: 'e-Marque',
  subtitle: 'La feuille de match électronique',
  description:
    "Les manuels officiels pour tenir la table de marque, avec un tutoriel vidéo. Deux versions : Mini-Basket (U7 à U11) et e-Marque v2 (U13 à Seniors).",
}

const documents = [
  {
    title: 'Règlement intérieur',
    description: 'Les droits et obligations de tous les membres du club.',
    file: '/files/reglement-interieur-bsm.pdf',
    fileName: 'Reglement interieur BSM.pdf',
    icon: Scale,
    accent: 'text-blue-600 dark:text-blue-400',
  },
  {
    title: 'Bulletin d\'inscription 2026-2027',
    description: 'Le formulaire à compléter pour inscrire un joueur ou une joueuse.',
    file: '/files/Bulletin inscription 2026-2027.pdf',
    fileName: 'Bulletin inscription 2026-2027.pdf',
    icon: UserPlus,
    accent: 'text-purple-600 dark:text-purple-400',
  },
  {
    title: 'Modalités d\'inscription 2026-2027',
    description: 'Tarifs, pièces à fournir et calendrier des inscriptions.',
    file: '/files/Courrier modalités inscription 2026_2027.pdf',
    fileName: 'Modalites inscription 2026-2027.pdf',
    icon: FileDown,
    accent: 'text-fuchsia-600 dark:text-fuchsia-400',
  },
]
</script>

<template>
  <div class="min-h-screen bg-page dark:bg-page-dark text-mainText dark:text-mainText-dark">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Hero -->
      <header class="mb-14">
        <div class="flex items-center gap-3 mb-4">
          <div class="rounded-xl bg-purple-600 p-2.5">
            <FolderOpen class="w-7 h-7 text-white" />
          </div>
          <span
            class="text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400"
          >
            Ressources
          </span>
        </div>
        <h1 class="text-4xl md:text-5xl font-extrabold mb-4">Documents &amp; tutoriels</h1>
        <p class="text-lg text-mutedText dark:text-mutedText-dark max-w-3xl">
          Tous les documents du club réunis au même endroit : les manuels pour tenir la table de
          marque, le règlement intérieur et les pièces d'inscription.
        </p>
      </header>

      <!-- Featured: e-Marque -->
      <RouterLink
        :to="featured.to"
        class="group block mb-16 rounded-2xl overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-600 transition-transform md:hover:scale-[1.01]"
      >
        <div class="relative p-8 md:p-10">
          <ClipboardList
            class="absolute top-0 right-0 w-56 h-56 text-white opacity-10 pointer-events-none"
          />
          <div class="relative max-w-2xl">
            <p class="text-sm font-semibold uppercase tracking-widest text-purple-200 mb-2">
              {{ featured.subtitle }}
            </p>
            <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">{{ featured.title }}</h2>
            <p class="text-white/90 mb-6">{{ featured.description }}</p>
            <span
              class="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-purple-700 font-semibold group-hover:bg-purple-50 transition-colors"
            >
              Consulter les manuels
              <ChevronRight class="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </RouterLink>

      <!-- Downloadable documents -->
      <section>
        <h2 class="text-2xl font-bold mb-2">Documents à télécharger</h2>
        <p class="text-mutedText dark:text-mutedText-dark mb-8">
          Tous les fichiers sont au format PDF.
        </p>

        <ul class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <li
            v-for="doc in documents"
            :key="doc.file"
            class="flex flex-col rounded-xl bg-card dark:bg-card-dark border border-borderColor dark:border-borderColor-dark p-6"
          >
            <component :is="doc.icon" :class="['w-8 h-8 mb-4', doc.accent]" />
            <h3 class="font-bold text-lg mb-2">{{ doc.title }}</h3>
            <p class="text-sm text-mutedText dark:text-mutedText-dark mb-6 flex-1">
              {{ doc.description }}
            </p>
            <a
              :href="doc.file"
              :download="doc.fileName"
              class="inline-flex items-center gap-2 font-semibold text-purple-600 dark:text-purple-400 hover:underline"
            >
              <FileDown class="w-4 h-4" />
              Télécharger
            </a>
          </li>
        </ul>
      </section>

      <!-- Registration cross-link -->
      <aside
        class="mt-16 rounded-2xl border border-borderColor dark:border-borderColor-dark bg-card dark:bg-card-dark p-6 flex flex-col sm:flex-row sm:items-center gap-5"
      >
        <UserPlus class="w-8 h-8 flex-shrink-0 text-purple-600 dark:text-purple-400" />
        <div class="flex-1">
          <h2 class="font-bold mb-1">Vous souhaitez nous rejoindre ?</h2>
          <p class="text-sm text-mutedText dark:text-mutedText-dark">
            Retrouvez la procédure complète, étape par étape, sur la page d'inscription.
          </p>
        </div>
        <RouterLink
          to="/inscription"
          class="flex-shrink-0 inline-flex items-center justify-center px-6 py-3 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors"
        >
          S'inscrire
        </RouterLink>
      </aside>
    </div>
  </div>
</template>
