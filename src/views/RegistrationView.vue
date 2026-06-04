<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Download, Mail, FileText, Users, ChevronRight, Calendar, MapPin } from 'lucide-vue-next'

const modalitiesFileUrl = '/files/Courrier modalités inscription 2026_2027.pdf'
const registrationFormUrl = '/files/Bulletin inscription 2026-2027.pdf'

const downloadFile = (url: string, fileName: string) => {
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', fileName)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const visible = ref(false)
onMounted(() => {
  setTimeout(() => {
    visible.value = true
  }, 80)
})
</script>

<template>
  <div
    class="min-h-screen bg-page dark:bg-page-dark text-mainText dark:text-mainText-dark overflow-x-hidden"
  >
    <!-- Hero Banner -->
    <div
      class="relative bg-gradient-to-br from-purple-700 via-indigo-600 to-violet-800 py-20 px-4 overflow-hidden"
    >
      <!-- Blob animations -->
      <div
        class="absolute -top-16 -left-16 w-56 h-56 bg-white/10 rounded-full animate-blob"
      />
      <div
        class="absolute top-10 right-10 w-72 h-72 bg-white/5 rounded-full animate-blob animation-delay-2000"
      />
      <div
        class="absolute -bottom-10 left-1/2 w-64 h-64 bg-purple-500/20 rounded-full animate-blob animation-delay-4000"
      />

      <div
        class="relative text-center text-white transition-all duration-700"
        :class="visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'"
      >
        <!-- Badge -->
        <div
          class="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-5 py-2 rounded-full text-sm font-semibold mb-6 animate-bounce-soft"
        >
          <span class="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          Inscriptions ouvertes — Saison 2026/2027
        </div>

        <h1 class="text-5xl md:text-7xl font-extrabold mb-4 drop-shadow-lg">
          Rejoins le BSM !
        </h1>
        <p class="text-xl text-purple-200 max-w-xl mx-auto">
          Renouvellements et nouvelles licences pour la saison 2026&nbsp;/&nbsp;2027
        </p>

        <div class="flex items-center justify-center gap-2 mt-6 text-purple-100">
          <Users class="w-5 h-5" />
          <span>Tous niveaux · Tous âges</span>
        </div>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-4 py-14">
      <!-- Steps -->
      <h2 class="text-2xl font-bold text-center mb-10">Comment s'inscrire&nbsp;?</h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
        <div
          class="bg-card dark:bg-card-dark rounded-xl p-6 shadow-lg border-t-4 border-purple-500 hover:-translate-y-2 transition-transform duration-300"
        >
          <div
            class="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4"
          >
            1
          </div>
          <h3 class="font-bold text-lg mb-2">Téléchargez les documents</h3>
          <p class="text-sm text-mutedText dark:text-mutedText-dark">
            Récupérez les modalités et le bulletin d'inscription ci-dessous.
          </p>
        </div>

        <div
          class="bg-card dark:bg-card-dark rounded-xl p-6 shadow-lg border-t-4 border-indigo-500 hover:-translate-y-2 transition-transform duration-300 md:mt-6"
        >
          <div
            class="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4"
          >
            2
          </div>
          <h3 class="font-bold text-lg mb-2">Remplissez le bulletin</h3>
          <p class="text-sm text-mutedText dark:text-mutedText-dark">
            Complétez le formulaire et préparez vos pièces justificatives.
          </p>
        </div>

        <div
          class="bg-card dark:bg-card-dark rounded-xl p-6 shadow-lg border-t-4 border-violet-500 hover:-translate-y-2 transition-transform duration-300"
        >
          <div
            class="w-10 h-10 bg-violet-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4"
          >
            3
          </div>
          <h3 class="font-bold text-lg mb-2">Déposez lors d'une permanence</h3>
          <p class="text-sm text-mutedText dark:text-mutedText-dark">
            Rendez-vous à la Salle Georges Raymond aux permanences prévues.
          </p>
        </div>
      </div>

      <!-- Downloads -->
      <h2 class="text-2xl font-bold text-center mb-8">Documents à télécharger</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
        <!-- Modalités -->
        <div
          class="group bg-card dark:bg-card-dark rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
        >
          <div class="bg-gradient-to-r from-purple-600 to-indigo-600 h-1.5" />
          <div class="p-6">
            <div class="flex items-center gap-4 mb-4">
              <div
                class="w-14 h-14 bg-purple-100 dark:bg-purple-900/50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
              >
                <FileText class="w-7 h-7 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 class="font-bold text-lg">Modalités d'inscription</h3>
                <p class="text-xs text-mutedText dark:text-mutedText-dark">Saison 2026 / 2027</p>
              </div>
            </div>
            <p class="text-sm text-mutedText dark:text-mutedText-dark mb-5">
              Tarifs, conditions et toute la procédure d'inscription détaillée.
            </p>
            <button
              @click="
                downloadFile(
                  modalitiesFileUrl,
                  'Courrier modalités inscription 2026_2027.pdf',
                )
              "
              class="w-full bg-purple-600 hover:bg-purple-700 active:scale-95 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 font-medium transition-all duration-150"
            >
              <Download class="w-4 h-4" />
              Télécharger
            </button>
          </div>
        </div>

        <!-- Bulletin -->
        <div
          class="group bg-card dark:bg-card-dark rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
        >
          <div class="bg-gradient-to-r from-indigo-600 to-violet-600 h-1.5" />
          <div class="p-6">
            <div class="flex items-center gap-4 mb-4">
              <div
                class="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
              >
                <FileText class="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h3 class="font-bold text-lg">Bulletin d'inscription</h3>
                <p class="text-xs text-mutedText dark:text-mutedText-dark">Saison 2026 / 2027</p>
              </div>
            </div>
            <p class="text-sm text-mutedText dark:text-mutedText-dark mb-5">
              Le formulaire à compléter et à remettre lors d'une permanence au club.
            </p>
            <button
              @click="
                downloadFile(registrationFormUrl, 'Bulletin inscription 2026-2027.pdf')
              "
              class="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 font-medium transition-all duration-150"
            >
              <Download class="w-4 h-4" />
              Télécharger
            </button>
          </div>
        </div>
      </div>

      <!-- Permanences -->
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-center mb-6">Permanences</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            class="bg-card dark:bg-card-dark rounded-xl p-5 shadow-md border-l-4 border-purple-500 hover:-translate-y-1 transition-transform duration-300"
          >
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                <Calendar class="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p class="font-bold text-base">Samedi 6 juin</p>
                <p class="text-sm text-purple-600 dark:text-purple-400 font-semibold">10h – 12h</p>
              </div>
            </div>
            <div class="flex items-center gap-2 text-sm text-mutedText dark:text-mutedText-dark">
              <MapPin class="w-4 h-4 flex-shrink-0" />
              <span>Salle Georges Raymond</span>
            </div>
          </div>

          <div
            class="bg-card dark:bg-card-dark rounded-xl p-5 shadow-md border-l-4 border-indigo-500 hover:-translate-y-1 transition-transform duration-300"
          >
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                <Calendar class="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p class="font-bold text-base">Mercredi 10 juin</p>
                <p class="text-sm text-indigo-600 dark:text-indigo-400 font-semibold">18h – 19h30</p>
              </div>
            </div>
            <div class="flex items-center gap-2 text-sm text-mutedText dark:text-mutedText-dark">
              <MapPin class="w-4 h-4 flex-shrink-0" />
              <span>Salle Pierre de Coubertin</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Info FFBB -->
      <div
        class="bg-card dark:bg-card-dark rounded-xl p-6 shadow-md flex gap-4 mb-6 border-l-4 border-blue-500"
      >
        <div class="flex-shrink-0">
          <div
            class="w-11 h-11 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center"
          >
            <Mail class="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <div>
          <h4 class="font-bold mb-1">Mail de la FFBB</h4>
          <p class="text-sm text-mutedText dark:text-mutedText-dark">
            Après dépôt de votre dossier, vous recevrez un email de la FFBB
            <strong class="text-mainText dark:text-mainText-dark">(pdl0049016@ffbb.com)</strong>
            avec le lien de finalisation, vers fin juin / début juillet.
          </p>
          <p class="text-sm text-amber-600 dark:text-amber-400 mt-2 font-medium flex items-center gap-1">
            <ChevronRight class="w-4 h-4" />
            N'hésitez pas à contacter le secrétariat si vous ne le recevez pas !
          </p>
        </div>
      </div>

      <!-- Contact CTA -->
      <div
        class="text-center bg-gradient-to-r from-purple-600/10 to-indigo-600/10 border border-purple-200 dark:border-purple-800 rounded-2xl p-10 mt-8"
      >
        <h3 class="font-bold text-2xl mb-2">Une question ?</h3>
        <p class="text-mutedText dark:text-mutedText-dark mb-6">
          Notre secrétariat est disponible pour vous accompagner.
        </p>
        <a
          href="mailto:secretaire@bsmbasket.fr"
          class="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 active:scale-95 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-150 shadow-md hover:shadow-lg"
        >
          <Mail class="w-5 h-5" />
          secretaire@bsmbasket.fr
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes blob {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -20px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

.animate-blob {
  animation: blob 9s infinite ease-in-out;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

@keyframes bounce-soft {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.animate-bounce-soft {
  animation: bounce-soft 2.5s ease-in-out infinite;
}
</style>
