<script setup lang="ts">
import { ref } from 'vue'

interface TrainingSession {
  time: string
  groups: string[]
  location: string
}

interface DaySchedule {
  date: string
  sessions: TrainingSession[]
}

const weekSchedule = ref<DaySchedule[]>([
  {
    date: 'LUNDI 17',
    sessions: [
      {
        time: '13H00 à 16H00',
        groups: ['U09 & U11'],
        location: 'S. GEORGES RAYMOND',
      },
      {
        time: '16H00 à 17H30',
        groups: ['U18G'],
        location: 'S. GEORGES RAYMOND',
      },
    ],
  },
  {
    date: 'MARDI 18',
    sessions: [
      {
        time: '13H00 à 16H00',
        groups: ['U13 G', 'U15G CTC', 'U15F CTC', 'U13F1', 'U13F CTC'],
        location: 'S. GEORGES RAYMOND',
      },
      {
        time: '16H00 à 17H30',
        groups: ['U18F', 'U18F CTC'],
        location: 'S. GEORGES RAYMOND',
      },
    ],
  },
  {
    date: 'MERCREDI 19',
    sessions: [
      {
        time: '10H00 à 12H00',
        groups: ['U7'],
        location: 'S. GEORGES RAYMOND',
      },
      {
        time: '10H00 à 16H00',
        groups: ['U09 & U11 (Sauf U11G1 et U11F1)'],
        location: 'S. GEORGES RAYMOND (Prévoir picnic)',
      },
      {
        time: '16H00 à 17H30',
        groups: ['U18G'],
        location: 'S. GEORGES RAYMOND',
      },
      {
        time: '17H-19H',
        groups: ['U13F CTC'],
        location: 'S. SAINT ANDRE DE LA MARCHE',
      },
    ],
  },
  {
    date: 'JEUDI 20',
    sessions: [
      {
        time: '17H-18H30',
        groups: ['U15G CTC'],
        location: 'S. SAINT ANDRE DE LA MARCHE',
      },
      {
        time: '18H45-20H15',
        groups: ['U18F2 CTC', 'U15F CTC'],
        location: 'S. SAINT ANDRE DE LA MARCHE',
      },
    ],
  },
  {
    date: 'VENDREDI 21',
    sessions: [
      {
        time: '10H00 à 16H00',
        groups: ['U13 G', 'U13F1', 'U11G1', 'U11F1'],
        location: 'S. GEORGES RAYMOND (Prévoir picnic)',
      },
    ],
  },
])
</script>

<template>
  <div
    class="min-h-screen bg-page dark:bg-page-dark text-mainText dark:text-mainText-dark py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-7xl mx-auto">
      <h1
        class="text-4xl font-extrabold text-center mb-8 bg-clip-text text-transparent bg-purple-600"
      >
        Planning d'entraînement
      </h1>
      <h2 class="text-xl font-bold text-center mb-8">VACANCES FEVRIER 2025</h2>

      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div
          v-for="day in weekSchedule"
          :key="day.date"
          class="bg-card dark:bg-card-dark rounded-lg shadow-md overflow-hidden"
        >
          <div class="bg-purple-600 dark:bg-purple-600 text-white p-2 text-center font-semibold">
            {{ day.date }}
          </div>
          <div class="p-4 space-y-4">
            <div
              v-if="day.sessions.length === 0"
              class="text-mutedText dark:text-mutedText-dark text-center italic"
            >
              Pas d'entraînement
            </div>
            <div
              v-for="(session, index) in day.sessions"
              :key="index"
              class="border-b border-borderColor dark:border-borderColor-dark pb-2 last:border-b-0 last:pb-0"
            >
              <p class="font-semibold">{{ session.time }}</p>
              <ul class="list-disc list-inside text-sm">
                <li v-for="group in session.groups" :key="group">{{ group }}</li>
              </ul>
              <p class="text-sm text-mutedText dark:text-mutedText-dark mt-1">
                {{ session.location }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-8 text-center text-sm text-mutedText dark:text-mutedText-dark">
        <p>Dernière mise à jour : <strong>13/02/2025</strong></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add any additional styles here if needed */
</style>
