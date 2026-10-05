<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { ClipboardList, FileDown, CirclePlay, Info, ChevronRight, Baby, Users } from 'lucide-vue-next'

const VIDEO_ID = 'kzDXqszo7T0'

const isVideoLoaded = ref(false)

const categories = [
  {
    id: 'mini',
    label: 'Mini-Basket',
    ages: 'U7 · U9 · U11',
    icon: Baby,
    gradient: 'from-yellow-500 to-amber-600',
    chip: 'bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-200',
    description:
      "La version Mini-Basket d'e-Marque, simplifiée pour les rencontres des plus jeunes. Pas de chronomètre de tirs, une saisie allégée : c'est la feuille à utiliser pour toutes les catégories jusqu'aux U11.",
    file: '/files/manuel-e-marque-mini-basket.pdf',
    fileName: 'Manuel e-Marque Mini-Basket.pdf',
  },
  {
    id: 'u13',
    label: 'U13 à Seniors',
    ages: 'U13 · U15 · U17 · U18 · Seniors',
    icon: Users,
    gradient: 'from-purple-600 to-indigo-600',
    chip: 'bg-purple-50 text-purple-800 dark:bg-purple-950 dark:text-purple-200',
    description:
      "Le manuel complet d'e-Marque v2, utilisé de la catégorie U13 jusqu'aux équipes seniors. Il couvre la préparation de la rencontre, la saisie en direct, les fautes et temps-morts, puis la clôture et l'envoi de la feuille.",
    file: '/files/manuel-e-marque-v2-u13-seniors.pdf',
    fileName: 'Manuel e-Marque v2 - U13 à Seniors.pdf',
    hasVideo: true,
  },
]

const steps = [
  'Récupérer la tablette ou le PC de marque à la table.',
  'Importer la rencontre, puis vérifier les licences des deux équipes.',
  'Saisir les cinq de départ avant le coup d\'envoi.',
  'Marquer les points, fautes et temps-morts au fil du match.',
  'Clôturer la feuille, faire signer les capitaines et les arbitres, puis transmettre.',
]
</script>

<template>
  <div class="min-h-screen bg-page dark:bg-page-dark text-mainText dark:text-mainText-dark">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Breadcrumb -->
      <nav aria-label="Fil d'ariane" class="mb-8 flex items-center gap-1.5 text-sm">
        <RouterLink
          to="/ressources"
          class="text-mutedText dark:text-mutedText-dark hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
        >
          Ressources
        </RouterLink>
        <ChevronRight class="w-4 h-4 text-mutedText dark:text-mutedText-dark" />
        <span class="font-medium">e-Marque</span>
      </nav>

      <!-- Hero -->
      <header class="mb-14">
        <div class="flex items-center gap-3 mb-4">
          <div class="rounded-xl bg-purple-600 p-2.5">
            <ClipboardList class="w-7 h-7 text-white" />
          </div>
          <span
            class="text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400"
          >
            Espace bénévoles
          </span>
        </div>
        <h1 class="text-4xl md:text-5xl font-extrabold mb-4">e-Marque</h1>
        <p class="text-lg text-mutedText dark:text-mutedText-dark max-w-3xl">
          e-Marque est le logiciel de la Fédération Française de BasketBall qui remplace la feuille
          de match papier. Choisissez ci-dessous la catégorie que vous allez marquer : le manuel
          n'est pas le même pour le Mini-Basket et pour les U13 et plus.
        </p>
      </header>

      <!-- Two age tracks -->
      <div class="grid gap-8 lg:grid-cols-2 mb-16">
        <section
          v-for="cat in categories"
          :key="cat.id"
          class="flex flex-col rounded-2xl bg-card dark:bg-card-dark border border-borderColor dark:border-borderColor-dark overflow-hidden"
        >
          <div :class="['bg-gradient-to-r p-6', cat.gradient]">
            <component :is="cat.icon" class="w-9 h-9 text-white mb-3" />
            <h2 class="text-2xl font-bold text-white">{{ cat.label }}</h2>
            <p class="text-white/80 text-sm mt-1">{{ cat.ages }}</p>
          </div>

          <div class="flex flex-col flex-1 p-6 gap-6">
            <p class="text-mutedText dark:text-mutedText-dark">{{ cat.description }}</p>

            <a
              :href="cat.file"
              :download="cat.fileName"
              class="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 active:bg-purple-800 transition-colors"
            >
              <FileDown class="w-5 h-5" />
              Télécharger le manuel (PDF)
            </a>

            <!-- Video, U13+ only -->
            <div v-if="cat.hasVideo" class="mt-auto">
              <h3 class="flex items-center gap-2 font-bold mb-3">
                <CirclePlay class="w-5 h-5 text-purple-600 dark:text-purple-400" />
                Tutoriel vidéo
              </h3>
              <div
                class="relative aspect-video rounded-lg overflow-hidden bg-black border border-borderColor dark:border-borderColor-dark"
              >
                <iframe
                  v-if="isVideoLoaded"
                  class="absolute inset-0 w-full h-full"
                  :src="`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0`"
                  title="Tutoriel vidéo e-Marque U13 et plus"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                />
                <button
                  v-else
                  type="button"
                  class="group absolute inset-0 w-full h-full"
                  aria-label="Lancer le tutoriel vidéo e-Marque"
                  @click="isVideoLoaded = true"
                >
                  <img
                    :src="`https://i.ytimg.com/vi/${VIDEO_ID}/hqdefault.jpg`"
                    alt=""
                    class="w-full h-full object-cover opacity-70 transition-opacity group-hover:opacity-50"
                  />
                  <span
                    class="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white"
                  >
                    <CirclePlay class="w-16 h-16 drop-shadow-lg transition-transform group-hover:scale-110" />
                    <span class="text-sm font-semibold">Voir le tutoriel</span>
                  </span>
                </button>
              </div>
              <p class="mt-2 text-xs text-mutedText dark:text-mutedText-dark">
                La vidéo n'est chargée qu'après un clic — aucune donnée n'est envoyée à YouTube
                avant.
              </p>
            </div>
          </div>
        </section>
      </div>

      <!-- Match-day steps -->
      <section
        class="rounded-2xl bg-card dark:bg-card-dark border border-borderColor dark:border-borderColor-dark p-8 mb-16"
      >
        <h2 class="text-2xl font-bold mb-2">Le déroulé d'une rencontre</h2>
        <p class="text-mutedText dark:text-mutedText-dark mb-8">
          Les grandes étapes, identiques pour toutes les catégories. Le manuel détaille chacune
          d'elles.
        </p>
        <ol class="space-y-4">
          <li v-for="(step, i) in steps" :key="step" class="flex gap-4">
            <span
              class="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white font-bold text-sm flex items-center justify-center"
            >
              {{ i + 1 }}
            </span>
            <span class="pt-1.5">{{ step }}</span>
          </li>
        </ol>
      </section>

      <!-- Help -->
      <aside
        class="rounded-2xl border border-purple-200 dark:border-purple-900 bg-purple-50 dark:bg-purple-950/40 p-6 flex flex-col sm:flex-row sm:items-center gap-5"
      >
        <Info class="w-8 h-8 flex-shrink-0 text-purple-600 dark:text-purple-400" />
        <div class="flex-1">
          <h2 class="font-bold mb-1">Une question sur la table de marque ?</h2>
          <p class="text-sm text-mutedText dark:text-mutedText-dark">
            Un doute sur une saisie, un oubli de clôture, besoin d'une formation ? Contactez la
            commission technique du club, on vous accompagne.
          </p>
        </div>
        <RouterLink
          to="/contact"
          class="flex-shrink-0 inline-flex items-center justify-center px-6 py-3 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors"
        >
          Nous contacter
        </RouterLink>
      </aside>
    </div>
  </div>
</template>
