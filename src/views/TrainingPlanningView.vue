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
    date: 'LUNDI',
    sessions: [
      {
        time: '17H15 à 18H45',
        groups: ['U11 G', '2015', '2016'],
        location: 'GEORGES RAYMOND (Pas de séance le 12/05, 16/06, 23/06)',
        trainer: 'Jérémy',
      },
      {
        time: '17H00 à 18H15',
        groups: ['U7 G', 'U7 F', '2019', '2020'],
        location: 'GEORGES RAYMOND',
        trainer: 'Julien',
      },
      {
        time: '18H15 à 19H30',
        groups: ['U9 G', '2017', '2018'],
        location: 'GEORGES RAYMOND',
        trainer: 'Julien / Jérémy',
      },
      {
        time: '19H30 à 20H45',
        groups: ['U18 G', 'U18 F', '2008', '2009', '2010'],
        location: 'GEORGES RAYMOND',
        trainer: 'Jérémy',
      },
      {
        time: '18H30 à 20H00',
        groups: ['U13 G', '2013', '2014'],
        location: 'ST ANDRÉ (SAM)',
        trainer: 'Timothée / Jérôme',
      },
      {
        time: '20H45 à 22H30',
        groups: ['Détente F'],
        location: 'GEORGES RAYMOND',
        trainer: '',
      },
    ],
  },
  {
    date: 'MARDI',
    sessions: [
      {
        time: '17H00 à 18H15',
        groups: ['U9 F', '2017', '2018'],
        location: 'COUBERTIN',
        trainer: 'Jérémy',
      },
      {
        time: '18H15 à 19H30',
        groups: ['U11 F', '2015', '2016'],
        location: 'COUBERTIN',
        trainer: 'Jérémy',
      },
      {
        time: '18H30 à 20H00',
        groups: ['U18 F', '2008', '2009', '2010'],
        location: 'ST ANDRÉ (SAM)',
        trainer: 'Enzo / Noa',
      },
      {
        time: '20H30 à 22H00',
        groups: ['SG1', 'SG2', '2007 G'],
        location: 'GEORGES RAYMOND',
        trainer: 'Antoine',
      },
    ],
  },
  {
    date: 'MERCREDI',
    sessions: [
      {
        time: '10H45 à 12H00',
        groups: ['U7 G', 'U7 F', '2019', '2020'],
        location: 'GEORGES RAYMOND',
        trainer: 'Julien',
      },
      {
        time: '13H00 à 14H30',
        groups: ['U9 G', 'U9 F', '2017', '2018'],
        location: 'GEORGES RAYMOND',
        trainer: 'Jérémy / Axel',
      },
      {
        time: '14H30 à 16H00',
        groups: ['U13 F', 'U15 F', '2013', '2014', '2011', '2012'],
        location: 'GEORGES RAYMOND',
        trainer: 'Jérémy / Axel',
      },
      {
        time: '16H00 à 17H30',
        groups: ['U13 G', '2013', '2014'],
        location: 'GEORGES RAYMOND',
        trainer: 'Jérémy / Axel',
      },
      {
        time: '20H00 à 21H30',
        groups: ['SF1', 'SF2'],
        location: 'COUBERTIN',
        trainer: 'Antoine',
      },
    ],
  },
  {
    date: 'JEUDI',
    sessions: [
      {
        time: '17H15 à 18H30',
        groups: ['U11 F', '2015', '2016'],
        location: 'COUBERTIN',
        trainer: 'Jérémy / Axel',
      },
      {
        time: '18H30 à 19H45',
        groups: ['U18 F', '2008', '2009', '2010'],
        location: 'COUBERTIN',
        trainer: 'Jérémy / Axel',
      },
      {
        time: '19H45 à 21H00',
        groups: ['U18 G', '2008', '2009', '2010'],
        location: 'COUBERTIN',
        trainer: 'Jérémy / Axel',
      },
      {
        time: '17H45 à 19H00',
        groups: ['U13 F', 'U15 F', '2013', '2014', '2011', '2012'],
        location: 'ST ANDRÉ (SAM)',
        trainer: 'Timothée / Jérôme',
      },
      {
        time: '19H00 à 20H30',
        groups: ['U15 G', '2011', '2012'],
        location: 'ST ANDRÉ (SAM)',
        trainer: 'Timothée / Jérôme',
      },
      {
        time: '21H00 à 23H00',
        groups: ['Détente G'],
        location: 'GEORGES RAYMOND',
        trainer: '',
      },
    ],
  },
  {
    date: 'VENDREDI',
    sessions: [
      {
        time: '17H00 à 18H15',
        groups: ['U11 G', '2015', '2016'],
        location: 'GEORGES RAYMOND',
        trainer: 'Jérémy / Axel',
      },
      {
        time: '18H15 à 19H30',
        groups: ['U15 G', '2011', '2012'],
        location: 'GEORGES RAYMOND (Pas de séance les 13/06, 20/06)',
        trainer: 'Jérémy / Axel',
      },
      {
        time: '19H30 à 21H00',
        groups: ['SF1', 'SF2', '2007 F'],
        location: 'GEORGES RAYMOND',
        trainer: 'Antoine / Axel',
      },
      {
        time: '21H00 à 22H30',
        groups: ['SG1', 'SG2', '2007 G'],
        location: 'GEORGES RAYMOND',
        trainer: 'Antoine / Justin',
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
      <h2 class="text-xl font-bold text-center mb-8">DU 12 MAI AU 20 JUIN 2025</h2>

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
