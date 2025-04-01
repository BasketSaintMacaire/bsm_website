<script setup lang="ts">
import { ref } from 'vue'

interface TrainingSession {
  time: string
  groups: string[]
  location: string
  trainer: string
}

interface DaySchedule {
  date: string
  sessions: TrainingSession[]
}

const weekSchedule = ref<DaySchedule[]>([
  {
    date: 'MARDI 15',
    sessions: [
      {
        time: '10H00 à 16H00 (Prévoir picnic)',
        groups: ['U13 G', 'U15 G CTC', 'U15F CTC', 'U13 F1', 'U13F CTC'],
        location: 'S. GEORGES RAYMOND',
        trainer: '',
      },
      {
        time: '16H00 à 17H30',
        groups: ['U18 G1', 'U18 G2'],
        location: 'S. GEORGES RAYMOND',
        trainer: '',
      },
    ],
  },
  {
    date: 'MERCREDI 16',
    sessions: [
      {
        time: '10H00 à 12H00',
        groups: ['U7 G/F'],
        location: 'S. GEORGES RAYMOND',
        trainer: '',
      },
      {
        time: '10H00 à 16H00 (Prévoir picnic)',
        groups: ['U09 G/F', 'U11 G/F'],
        location: 'S. GEORGES RAYMOND',
        trainer: '',
      },
      {
        time: '16H00 à 17H30',
        groups: ['U18 F'],
        location: 'S. GEORGES RAYMOND',
        trainer: '',
      },
    ],
  },
  {
    date: 'JEUDI 17',
    sessions: [
      {
        time: '10H00 à 16H00 (Prévoir picnic)',
        groups: ['U13 G', 'U13 F1', 'U11 F1', 'U11 G1'],
        location: 'S. GEORGES RAYMOND',
        trainer: '',
      },
      {
        time: '16H00 à 17H30',
        groups: ['U18 G1', 'U18 G2'],
        location: 'S. GEORGES RAYMOND',
        trainer: '',
      },
      {
        time: '17H00 à 18H30',
        groups: ['U13F CTC'],
        location: 'S. SAINT ANDRE DE LA MARCHE',
        trainer: '',
      },
      {
        time: '18H45 à 20H15',
        groups: ['U18 F2 CTC', 'U15 F1 CTC'],
        location: 'S. SAINT ANDRE DE LA MARCHE',
        trainer: '',
      },
    ],
  },
  {
    date: 'VENDREDI 18',
    sessions: [
      {
        time: '10H00 à 12H00',
        groups: ['U7 G/F'],
        location: 'S. GEORGES RAYMOND',
        trainer: '',
      },
      {
        time: '10H00 à 16H00 (Prévoir picnic)',
        groups: ['U09 G/F', 'U11 G/F (Sauf U11 G1 et U11 F1)'],
        location: 'S. GEORGES RAYMOND',
        trainer: '',
      },
      {
        time: '17H30 à 19H00',
        groups: ['U15G CTC'],
        location: 'S. SAINT ANDRE DE LA MARCHE',
        trainer: '',
      },
    ],
  },
])

/*
const weekSchedule = ref<DaySchedule[]>([
  {
    date: 'LUNDI',
    sessions: [
      {
        time: '17H30 à 18H45',
        groups: ['U07 F/G'],
        location: 'S. GEORGES RAYMOND',
        trainer: 'Julien',
      },
      {
        time: '17H00 à 18H15',
        groups: ['U09 G1', 'U09 G2'],
        location: 'S. PIERRE DE COUBERTIN',
        trainer: 'Jeremy',
      },
      {
        time: '18H15 à 19H30',
        groups: ['U18 F1 CTC', 'U18 F2 CTC', 'U15 F1 CTC'],
        location: 'S. PIERRE DE COUBERTIN',
        trainer: 'Jeremy',
      },
      {
        time: '19H30 à 20H45',
        groups: ['U18 G1', 'U18 G2', 'U15 G1 CTC'],
        location: 'S. PIERRE DE COUBERTIN',
        trainer: 'Jeremy',
      },
      {
        time: '20H45 à 22H30',
        groups: ['DETENTE F'],
        location: 'S. PIERRE DE COUBERTIN',
        trainer: '',
      },
    ],
  },
  {
    date: 'MARDI',
    sessions: [
      {
        time: '17H00 à 18H15',
        groups: ['U09 F1', 'U09 G3'],
        location: 'S. PIERRE DE COUBERTIN',
        trainer: 'Jeremy',
      },
      {
        time: '18H15 à 19H30',
        groups: ['U11 F1', 'U11 F2', 'U11 F3'],
        location: 'S. PIERRE DE COUBERTIN',
        trainer: 'Jeremy',
      },
      {
        time: '17H45 à 19H15',
        groups: ['U13 F1', 'U13 F2 CTC'],
        location: 'S. SAINT ANDRE DE LA MARCHE',
        trainer: 'Jerome',
      },
      {
        time: '19H15 à 20H45',
        groups: ['U15 G2 CTC', 'U15 G3 CTC'],
        location: 'S. SAINT ANDRE DE LA MARCHE',
        trainer: 'Jerome',
      },
      {
        time: '20H15 à 21H45',
        groups: ['SG1', 'SG2', 'U21 G1'],
        location: 'S. GEORGES RAYMOND',
        trainer: 'Emmanuel',
      },
    ],
  },
  {
    date: 'MERCREDI',
    sessions: [
      {
        time: '10H45 à 12H00',
        groups: ['U7 G/F'],
        location: 'S. GEORGES RAYMOND',
        trainer: 'Jeremy & Axel',
      },
      {
        time: '14H30 à 16H00',
        groups: ['U11 G3', 'U11 G4', 'U11 F2', 'U11 F3'],
        location: 'S. GEORGES RAYMOND',
        trainer: 'Jeremy & Axel',
      },
      {
        time: '16H00 à 17H30',
        groups: ['U13 G3', 'U11 G1', 'U11 G2'],
        location: 'S. GEORGES RAYMOND',
        trainer: 'Jeremy & Axel',
      },
      {
        time: '18H00 à 19H30',
        groups: ['U13 G1', 'U13 G2'],
        location: 'S. PIERRE DE COUBERTIN',
        trainer: 'Jeremy & Axel',
      },
      {
        time: '19H30 à 21H00',
        groups: ['SF1', 'SF2'],
        location: 'S. PIERRE DE COUBERTIN',
        trainer: 'Antoine',
      },
    ],
  },
  {
    date: 'JEUDI',
    sessions: [
      {
        time: '17H15 à 18H30',
        groups: ['U13 F1', 'U13 F2 CTC', 'U11 F1'],
        location: 'S. PIERRE DE COUBERTIN',
        trainer: 'Jeremy & Axel',
      },
      {
        time: '18H30 à 19H45',
        groups: ['U13 G2', 'U13 G3'],
        location: 'S. PIERRE DE COUBERTIN',
        trainer: 'Jeremy & Axel',
      },
      {
        time: '18H45 à 20H15',
        groups: ['U18 F2 CTC', 'U15 F1 CTC'],
        location: 'S. SAINT ANDRE DE LA MARCHE',
        trainer: 'Enzo',
      },
      {
        time: '19H45 à 21H00',
        groups: ['U18 G1', 'U18 G2'],
        location: 'S. PIERRE DE COUBERTIN',
        trainer: 'Jeremy & Axel',
      },
      {
        time: '21H00 à 23H00',
        groups: ['DETENTE G'],
        location: 'S. GEORGES RAYMOND',
        trainer: '',
      },
    ],
  },
  {
    date: 'VENDREDI 21',
    sessions: [
      {
        time: '17H00 à 18H15',
        groups: ['U11 G1', 'U11 G2', 'U11 G3', 'U11 G4'],
        location: 'S. GEORGES RAYMOND',
        trainer: 'Jeremy & Axel',
      },
      {
        time: '18H15 à 19H30',
        groups: ['U15 G1 CTC', 'U15 G2 CTC', 'U15 G3 CTC', 'U13 G1'],
        location: 'S. GEORGES RAYMOND',
        trainer: 'Jeremy & Axel',
      },
      {
        time: '19H30 à 21H00',
        groups: ['SF1', 'SF2'],
        location: 'S. GEORGES RAYMOND',
        trainer: 'Antoine & Axel',
      },
      {
        time: '21H00 à 22H30',
        groups: ['SG1', 'SG2', 'U21 G1'],
        location: 'S. GEORGES RAYMOND',
        trainer: 'Emmanuel & Justin',
      },
    ],
  },
])
*/
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
      <h2 class="text-xl font-bold text-center mb-8">VACANCES AVRIL 2025</h2>

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
        <p>Dernière mise à jour : <strong>26/02/2025</strong></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add any additional styles here if needed */
</style>
