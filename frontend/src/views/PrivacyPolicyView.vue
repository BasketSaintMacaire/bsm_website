<script setup lang="ts">
import { ref } from 'vue'
import { ChevronDown, ChevronUp } from 'lucide-vue-next'

const sections = ref([
  {
    title: 'Introduction',
    content: `
      <p>La présente politique de confidentialité décrit comment <strong>BSM : Basket Saint Macaire</strong> collecte, utilise et protège vos informations personnelles lorsque vous utilisez notre site web et nos services.</p>
      <p class="mt-2">Nous nous engageons à assurer la protection de votre vie privée et de vos données personnelles conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés.</p>
    `,
    isOpen: true,
  },
  {
    title: 'Collecte des données personnelles',
    content: `
      <p>Nous collectons les données personnelles suivantes :</p>
      <ul class="list-disc pl-5 mt-2">
        <li>Nom et prénom</li>
        <li>Adresse e-mail</li>
        <li>Numéro de téléphone</li>
      </ul>
      <p class="mt-2">Ces informations sont collectées lorsque vous :</p>
      <ul class="list-disc pl-5 mt-2">
        <li>Effectuez un achat dans notre boutique en ligne</li>
        <li>Contactez notre service client</li>
      </ul>
    `,
    isOpen: false,
  },
  {
    title: 'Utilisation des données',
    content: `
      <p>Nous utilisons vos données personnelles pour :</p>
      <ul class="list-disc pl-5 mt-2">
        <li>Traiter vos commandes</li>
        <li>Améliorer nos services et votre expérience utilisateur</li>
        <li>Répondre à vos demandes et questions</li>
      </ul>
    `,
    isOpen: false,
  },
  {
    title: 'Protection des données',
    content: `
      <p>Nous mettons en place des mesures de sécurité appropriées pour protéger vos données personnelles contre tout accès non autorisé, modification, divulgation ou destruction.</p>
      <p class="mt-2">Ces mesures incluent :</p>
      <ul class="list-disc pl-5 mt-2">
        <li>Le chiffrement des données sensibles</li>
        <li>Des contrôles d'accès stricts pour nos employés</li>
        <li>Des mises à jour régulières de nos systèmes de sécurité</li>
      </ul>
    `,
    isOpen: false,
  },
  {
    title: 'Partage des données',
    content: `
      <p>Nous ne vendons ni ne louons vos données personnelles à des tiers. Nous pouvons partager vos informations avec :</p>
      <ul class="list-disc pl-5 mt-2">
        <li>Nos prestataires de services (hébergement, paiement, etc.)</li>
        <li>Les autorités compétentes si la loi l'exige</li>
      </ul>
      <p class="mt-2">Tout partage de données est effectué dans le respect des lois sur la protection des données.</p>
    `,
    isOpen: false,
  },
  {
    title: 'Vos droits',
    content: `
      <p>Conformément au RGPD, vous disposez des droits suivants concernant vos données personnelles :</p>
      <ul class="list-disc pl-5 mt-2">
        <li>Droit d'accès</li>
        <li>Droit de rectification</li>
        <li>Droit à l'effacement (droit à l'oubli)</li>
        <li>Droit à la limitation du traitement</li>
        <li>Droit à la portabilité des données</li>
        <li>Droit d'opposition</li>
      </ul>
      <p class="mt-2">Pour exercer ces droits, veuillez nous contacter à l'adresse : <strong>website@bsmbasket.fr</strong></p>
    `,
    isOpen: false,
  },
  {
    title: 'Cookies',
    content: `
      <p>Notre site utilise des cookies pour améliorer votre expérience de navigation. Vous pouvez gérer vos préférences en matière de cookies via les paramètres de votre navigateur.</p>
    `,
    isOpen: false,
  },
  {
    title: 'Modifications de la politique de confidentialité',
    content: `
      <p>Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. Toute modification sera publiée sur cette page avec une date de mise à jour.</p>
      <p class="mt-2">Nous vous encourageons à consulter régulièrement cette page pour rester informé de nos pratiques en matière de protection des données.</p>
    `,
    isOpen: false,
  },
  {
    title: 'Nous contacter',
    content: `
      <p>Si vous avez des questions concernant cette politique de confidentialité ou nos pratiques en matière de protection des données, veuillez nous contacter :</p>
      <div class="bg-gray-800 p-4 rounded-lg mt-2 text-[#FFFFFF]">
        <p><strong>BSM : Basket Saint Macaire</strong><br>
        Stade Georges Raymond<br>
        49450 Saint-Macaire (France)<br>
        Email : contact@bsmbasket.fr</p>
      </div>
    `,
    isOpen: false,
  },
])

const toggleSection = (index: number) => {
  sections.value[index].isOpen = !sections.value[index].isOpen
}
</script>

<template>
  <div
    class="min-h-screen bg-page dark:bg-page-dark text-mainText dark:text-mainText-dark py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-4xl mx-auto">
      <h1
        class="text-4xl font-extrabold text-center mb-12 bg-clip-text text-transparent bg-purple-600"
      >
        Politique de Confidentialité
      </h1>

      <div class="space-y-6">
        <div
          v-for="(section, index) in sections"
          :key="index"
          class="bg-card dark:bg-card-dark rounded-lg overflow-hidden shadow-lg transition-all duration-300 ease-in-out"
          :class="{ 'shadow-xl': section.isOpen }"
        >
          <button
            @click="toggleSection(index)"
            class="w-full px-6 py-4 flex justify-between items-center focus:outline-none"
          >
            <h2 class="text-xl font-semibold">{{ section.title }}</h2>
            <component
              :is="section.isOpen ? ChevronUp : ChevronDown"
              class="w-6 h-6 text-mutedText dark:text-mutedText-dark"
            />
          </button>
          <div v-show="section.isOpen" class="px-6 pb-4 transition-all duration-300 ease-in-out">
            <div class="prose dark:prose-invert max-w-none" v-html="section.content"></div>
          </div>
        </div>
      </div>

      <div class="mt-12 text-center text-sm text-mutedText dark:text-mutedText-dark">
        <p>Dernière mise à jour : <strong>05/02/2025</strong></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.prose :deep(a) {
  @apply text-blue-600 dark:text-blue-400 hover:underline;
}

.prose :deep(strong) {
  @apply font-semibold;
  @apply text-purple-600;
}

.prose :deep(ul) {
  @apply my-4;
}
</style>
