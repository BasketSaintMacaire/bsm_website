<script setup lang="ts">
import { ref } from 'vue'
import { Download, Calendar, Mail, Info, Users } from 'lucide-vue-next'

// URLs for downloadable files - replace with actual file paths
const modalitiesFileUrl = ref('/files/modalites-inscription-2025-2026.pdf')
const registrationFormUrl = ref('/files/fiche-inscription-2025-2026.pdf')

// Function to handle file downloads
const downloadFile = (url: string, fileName: string) => {
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', fileName)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<template>
  <div
    class="min-h-screen bg-page dark:bg-page-dark text-mainText dark:text-mainText-dark py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-4xl mx-auto">
      <!-- Header Section -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-extrabold mb-4">Renouvellement des Licences</h1>
        <h2 class="text-2xl font-semibold text-mutedText dark:text-mutedText-dark">
          Saison 2025/2026
        </h2>
      </div>

      <!-- Main Content Card -->
      <div class="bg-card dark:bg-card-dark rounded-xl shadow-lg overflow-hidden">
        <!-- Top Banner -->
        <div class="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
          <div class="flex items-center justify-center">
            <Users class="w-8 h-8 mr-3" />
            <h3 class="text-xl font-bold">Inscription au BSM</h3>
          </div>
        </div>

        <!-- Content Section -->
        <div class="p-6 md:p-8">
          <div class="prose dark:prose-invert max-w-none">
            <p class="text-lg">Bonjour à toutes et à tous,</p>

            <p class="font-medium text-xl my-4">
              La saison touche à sa fin, il est temps de renouveler votre licence !
            </p>

            <p>Vous trouverez ci-dessous les modalités ainsi que la fiche d'inscription.</p>
          </div>

          <!-- Download Files Section -->
          <div class="my-8 space-y-4">
            <div
              class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex items-center justify-between"
            >
              <div class="flex items-center">
                <Info class="w-6 h-6 text-purple-600 dark:text-purple-400 mr-3" />
                <span class="font-medium">Les modalités</span>
              </div>
              <button
                @click="downloadFile(modalitiesFileUrl, 'modalites-inscription-2025-2026.pdf')"
                class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center transition-colors"
              >
                <Download class="w-4 h-4 mr-2" />
                Télécharger
              </button>
            </div>

            <div
              class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex items-center justify-between"
            >
              <div class="flex items-center">
                <Info class="w-6 h-6 text-purple-600 dark:text-purple-400 mr-3" />
                <span class="font-medium">Fiche d'inscription - Saison 2025/2026</span>
              </div>
              <button
                @click="downloadFile(registrationFormUrl, 'fiche-inscription-2025-2026.pdf')"
                class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center transition-colors"
              >
                <Download class="w-4 h-4 mr-2" />
                Télécharger
              </button>
            </div>
          </div>

          <!-- Important Information -->
          <div class="prose dark:prose-invert max-w-none">
            <p>La fiche d'inscription est à nous retourner lors des permanences prévues :</p>
          </div>

          <!-- Important Date Alert -->
          <div
            class="my-6 bg-amber-100 dark:bg-amber-900 border-l-4 border-amber-500 p-4 rounded-r-md"
          >
            <div class="flex">
              <Calendar class="w-6 h-6 text-amber-600 dark:text-amber-400 mr-3 flex-shrink-0" />
              <div>
                <p class="font-bold text-amber-800 dark:text-amber-300">
                  Attention dernière permanence :
                </p>
                <p class="text-amber-700 dark:text-amber-200">
                  Vendredi 13 Juin de 18h30 à 20h30 à la Salle Georges Raymond
                </p>
              </div>
            </div>
          </div>

          <!-- Additional Information -->
          <div class="prose dark:prose-invert max-w-none">
            <p>
              À la suite de cela, vous recevrez un mail de la FFBB (pdl0049016@ffbb.com) contenant
              le lien d'inscription, vers la fin juin / début juillet.
            </p>

            <div class="flex items-start mt-6 mb-6">
              <Mail class="w-6 h-6 text-purple-600 dark:text-purple-400 mr-3 flex-shrink-0 mt-1" />
              <p class="italic">
                N'hésitez pas à revenir vers le secrétariat si vous ne le recevez pas !
              </p>
            </div>

            <p class="font-medium">Sportivement</p>
            <p>Le BSM</p>
          </div>
        </div>
      </div>

      <!-- Contact Information -->
      <div class="mt-8 text-center text-sm text-mutedText dark:text-mutedText-dark">
        <p>
          Pour toute question, contactez le secrétariat :
          <strong>secretariat@basket-saint-macaire.fr</strong>
        </p>
      </div>
    </div>
  </div>
</template>
