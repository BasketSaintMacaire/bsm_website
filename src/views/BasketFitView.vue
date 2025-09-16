<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Calendar, Clock, MapPin, Zap, Heart, Users, Target, Sparkles } from 'lucide-vue-next'

const sessions = [
  { day: 'Mercredi', time: '20h00 – 21h15', icon: Calendar },
  { day: 'Samedi', time: '11h30 – 12h45', icon: Clock },
]

const venue = 'Saint Macaire, Salle George Raymond'

const features = [
  {
    text: 'Activité dynamique, ludique et non compétitive',
    icon: Zap,
    color: 'from-purple-500 to-pink-500',
  },
  {
    text: 'Circuit training inspiré des fondamentaux du basket',
    icon: Target,
    color: 'from-blue-500 to-purple-500',
  },
  {
    text: 'Cardio + renforcement musculaire + mobilité + respiration',
    icon: Heart,
    color: 'from-red-500 to-orange-500',
  },
  {
    text: 'Dépense énergétique individualisée, accessible à tous',
    icon: Users,
    color: 'from-green-500 to-blue-500',
  },
  {
    text: 'Bien-être, gestion du stress, plaisir et partage',
    icon: Sparkles,
    color: 'from-yellow-500 to-pink-500',
  },
  {
    text: 'Élan individuel renforcé par la pratique collective',
    icon: Users,
    color: 'from-indigo-500 to-purple-500',
  },
]

const isVisible = ref(false)

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true
  }, 100)
})
</script>

<template>
  <div class="min-h-screen bg-page dark:bg-page-dark relative overflow-hidden">
    <!-- Light Mode Background Elements -->
    <div class="absolute inset-0 overflow-hidden dark:hidden">
      <div
        class="absolute -top-40 -right-40 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-pulse"
      ></div>
      <div
        class="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-pulse animation-delay-2000"
      ></div>
      <div
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse animation-delay-4000"
      ></div>
    </div>

    <!-- Dark Mode Background Elements -->
    <div class="absolute inset-0 overflow-hidden hidden dark:block">
      <div
        class="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
      ></div>
      <div
        class="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"
      ></div>
      <div
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"
      ></div>
    </div>

    <div class="relative z-10 min-h-screen flex items-center justify-center py-12 px-4">
      <div class="w-full max-w-6xl mx-auto">
        <!-- Hero Section -->
        <div class="text-center mb-16" :class="{ 'animate-fade-in-up': isVisible }">
          <div class="relative inline-block">
            <h1
              class="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 mb-4 tracking-tight"
            >
              Basket'Fit
            </h1>
            <div
              class="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-25 dark:opacity-50"
            ></div>
          </div>
          <div
            class="flex items-center justify-center text-mutedText dark:text-mutedText-dark text-xl mb-8"
          >
            <MapPin class="w-6 h-6 mr-2" />
            <span>{{ venue }}</span>
          </div>
          <p
            class="text-2xl text-mainText dark:text-mainText-dark font-light max-w-2xl mx-auto leading-relaxed"
          >
            Découvrez une nouvelle façon de faire du sport : dynamique, inclusive et passionnante !
          </p>
        </div>

        <!-- Sessions Cards -->
        <div
          class="grid md:grid-cols-2 gap-8 mb-16"
          :class="{ 'animate-fade-in-up animation-delay-300': isVisible }"
        >
          <div v-for="(session, index) in sessions" :key="session.day" class="group relative">
            <div
              class="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-50 dark:group-hover:opacity-75 transition duration-1000 group-hover:duration-200"
            ></div>
            <div
              class="relative bg-card dark:bg-card-dark backdrop-blur-lg rounded-2xl p-8 border border-borderColor dark:border-borderColor-dark hover:border-purple-300 dark:hover:border-white/40 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <div class="flex items-center justify-between mb-6">
                <component
                  :is="session.icon"
                  class="w-12 h-12 text-purple-600 dark:text-purple-400"
                />
                <div class="text-right">
                  <div class="text-3xl font-bold text-mainText dark:text-mainText-dark">
                    {{ session.day }}
                  </div>
                  <div class="text-purple-600 dark:text-purple-300 text-lg">{{ session.time }}</div>
                </div>
              </div>
              <div class="h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
            </div>
          </div>
        </div>

        <!-- Features Grid -->
        <div class="mb-16" :class="{ 'animate-fade-in-up animation-delay-600': isVisible }">
          <h2 class="text-4xl font-bold text-center text-mainText dark:text-mainText-dark mb-12">
            L'expérience Basket'Fit
          </h2>
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="(feature, index) in features"
              :key="index"
              class="group relative overflow-hidden"
              :style="{ animationDelay: `${index * 100}ms` }"
            >
              <div
                class="absolute -inset-0.5 bg-gradient-to-r opacity-20 group-hover:opacity-40 dark:opacity-25 dark:group-hover:opacity-75 transition duration-1000 group-hover:duration-200 rounded-xl blur"
                :class="feature.color"
              ></div>
              <div
                class="relative bg-card dark:bg-card-dark backdrop-blur-sm rounded-xl p-6 border border-borderColor dark:border-borderColor-dark hover:border-purple-300 dark:hover:border-white/30 transition-all duration-300 transform hover:scale-105 hover:rotate-1 shadow-md"
              >
                <div class="flex items-start space-x-4">
                  <div class="flex-shrink-0">
                    <div
                      class="w-12 h-12 rounded-full bg-gradient-to-r flex items-center justify-center shadow-lg"
                      :class="feature.color"
                    >
                      <component :is="feature.icon" class="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <p class="text-mainText dark:text-mainText-dark leading-relaxed">
                    {{ feature.text }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Call to Action -->
        <div class="text-center" :class="{ 'animate-fade-in-up animation-delay-900': isVisible }">
          <div class="relative inline-block">
            <div
              class="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-50"
            ></div>
            <button
              class="relative bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-12 rounded-full text-xl hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-2xl"
              @click="$router.push('/contact')"
            >
              Rejoignez l'aventure !
            </button>
          </div>
          <p class="text-mutedText dark:text-mutedText-dark mt-4 text-lg">
            Venez découvrir le Basket'Fit lors de nos séances d'essai gratuites tous les mercredis
            et samedis de septembre !
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out forwards;
}

.animation-delay-300 {
  animation-delay: 300ms;
}

.animation-delay-600 {
  animation-delay: 600ms;
}

.animation-delay-900 {
  animation-delay: 900ms;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

/* Custom backdrop blur for better browser support */
.backdrop-blur-lg {
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

.backdrop-blur-sm {
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}
</style>
