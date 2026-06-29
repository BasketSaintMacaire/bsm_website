<script setup lang="ts">
import { ref } from 'vue'
import { ChevronDown, ChevronUp } from 'lucide-vue-next'

const sections = ref([
  {
    title: 'Éditeur du Site',
    content: `
      <p class="mb-4">Le présent site est édité par l'association <strong>BSM : Basket Saint Macaire</strong>, association loi 1901, dont le siège social est situé à :</p>
      <div class="bg-gray-800 p-4 rounded-lg mb-4 text-[#FFFFFF]">
        <p><strong>BSM : Basket Saint Macaire</strong><br>
        Stade Georges Raymond<br>
        49450 Saint-Macaire (France)<br>
        Tél : 06 84 41 53 02<br>
        Email : contact@bsmbasket.fr</p>
      </div>
      <p>N° SIRET : <strong>425 000 700 00038</strong></p>
    `,
    isOpen: true,
  },
  {
    title: 'Responsable de la publication',
    content: `
      <p>Le responsable de la publication est <strong>Madame C. Grasset</strong>, en qualité de Président(e) de l'association.</p>
    `,
    isOpen: false,
  },
  {
    title: 'Hébergement du site',
    content: `
      <p>Le site <strong>bsmbasket.fr</strong> est hébergé par :</p>
      <div class="bg-gray-800 p-4 rounded-lg mt-2 text-[#FFFFFF]">
        <p><strong>o2switch</strong><br>
        Chem. des Pardiaux, 63000 Clermont-Ferrand<br>
        Tél : 04 44 44 60 40</p>
      </div>
    `,
    isOpen: false,
  },
  {
    title: 'Propriété Intellectuelle',
    content: `
      <p>L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.</p>
      <p class="mt-2">Sauf mention contraire, tous les éléments (textes, images, logos, etc.) présents sur ce site sont la propriété exclusive de <strong>BSM : Basket Saint Macaire</strong>.</p>
    `,
    isOpen: false,
  },
  {
    title: 'Responsabilité',
    content: `
      <p>L'association <strong>BSM : Basket Saint Macaire</strong> s'efforce d'assurer au mieux de ses possibilités l'exactitude et la mise à jour des informations diffusées sur ce site. Toutefois, elle ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition sur ce site et se réserve le droit de modifier ou de corriger le contenu à tout moment et sans préavis.</p>
      <p class="mt-2">L'association décline toute responsabilité pour toute interruption du site, survenance de bogues, pour toute inexactitude ou omission portant sur des informations disponibles sur le site, et pour tout dommage résultant d'une intrusion frauduleuse d'un tiers ayant entraîné une modification des informations mises à disposition sur le site.</p>
    `,
    isOpen: false,
  },
  {
    title: 'Protection des données personnelles',
    content: `
      <p>Les informations collectées via les formulaires ou tout autre moyen sur ce site sont destinées exclusivement à <strong>BSM : Basket Saint Macaire</strong> et ne sont utilisées que dans le cadre de la finalité indiquée lors de la collecte (inscription, contact, etc.). Conformément à la loi n°78-17 du 6 janvier 1978 relative à l'informatique, aux fichiers et aux libertés, modifiée, ainsi qu'au Règlement général sur la protection des données (RGPD), vous disposez d'un droit d'accès, de rectification, d'effacement et de portabilité de vos données personnelles, ainsi qu'un droit à la limitation et à l'opposition au traitement de vos données.</p>
      <p class="mt-2">Vous pouvez exercer ces droits en nous contactant par email à l'adresse suivante : <strong>contact@bsmbasket.fr</strong>.</p>
    `,
    isOpen: false,
  },
  {
    title: 'Cookies',
    content: `
      <p>Le site <strong>bsmbasket.fr</strong> est susceptible d'utiliser des cookies afin d'améliorer l'expérience de navigation, d'analyser le trafic ou de faciliter certaines fonctionnalités. Vous avez la possibilité de désactiver les cookies en paramétrant les options de votre navigateur.</p>
    `,
    isOpen: false,
  },
  {
    title: 'Liens Externes',
    content: `
      <p>Des liens vers d'autres sites, privés ou officiels, français ou étrangers, sont proposés. Ils n'engagent en aucun cas <strong>BSM : Basket Saint Macaire</strong> quant à leur contenu et ne visent qu'à permettre à l'internaute d'accéder plus facilement à d'autres ressources documentaires sur le sujet consulté.</p>
    `,
    isOpen: false,
  },
  {
    title: 'Droit Applicable',
    content: `
      <p>Le présent site est soumis au droit français. En cas de litige, et à défaut de résolution amiable, les tribunaux français seront seuls compétents pour statuer sur ce litige.</p>
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
        Mentions Légales
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
</style>
