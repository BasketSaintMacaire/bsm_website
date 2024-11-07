<script setup lang="ts">
import { ref, computed } from 'vue'
import planningDataJson from '@/assets/planning/PlanningEventsData.json' // Import JSON directly

interface PlanningEvent {
  date: string
  team: string
  group: string
  isDomicile: boolean
  time_start: string
  time_meetup: string | null
  opponent: string | null
  location: string | null
  family_duety: string[]
  referees: string[]
  bar: string | null
  result: number[]
}

const planningData = ref<PlanningEvent[]>(planningDataJson) // Use the imported JSON data directly
const filterDate = ref('')
const filterTeam = ref('')

const filteredEvents = computed(() =>
  planningData.value.filter((event) => {
    const dateMatch = filterDate.value ? event.date.includes(filterDate.value) : true
    const teamMatch = filterTeam.value ? event.team === filterTeam.value : true
    return dateMatch && teamMatch
  }),
)

const uniqueDates = computed(() =>
  Array.from(new Set(planningData.value.map((event) => event.date))),
)
const uniqueTeams = computed(() =>
  Array.from(new Set(planningData.value.map((event) => event.team))),
)
</script>

<template>
  <div class="min-h-screen bg-black text-white py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-4xl font-bold text-center mb-8">Planning BSM St Macaire en Mauges</h1>

      <div class="mb-8 flex flex-col sm:flex-row justify-center items-center gap-4">
        <div class="w-full sm:w-64">
          <label for="date-filter" class="block text-sm font-medium text-gray-300 mb-1"
            >Filtrer par date</label
          >
          <select
            id="date-filter"
            v-model="filterDate"
            class="w-full bg-[#1A1A1A] border border-[#1A1A1A] rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Toutes les dates</option>
            <option v-for="date in uniqueDates" :key="date" :value="date">
              {{ date }}
            </option>
          </select>
        </div>
        <div class="w-full sm:w-64">
          <label for="team-filter" class="block text-sm font-medium text-gray-300 mb-1"
            >Filtrer par équipe</label
          >
          <select
            id="team-filter"
            v-model="filterTeam"
            class="w-full bg-[#1A1A1A] border border-[#1A1A1A] rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Toutes les équipes</option>
            <option v-for="team in uniqueTeams" :key="team" :value="team">
              {{ team }}
            </option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="event in filteredEvents"
          :key="`${event.date}-${event.time_start}-${event.team}`"
          class="bg-[#1A1A1A] rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105"
        >
          <div
            :class="[
              'px-4 py-3 text-lg font-semibold',
              event.isDomicile ? 'bg-green-700' : 'bg-blue-700',
            ]"
          >
            {{ event.date }} - {{ event.time_start }}
          </div>
          <div class="p-4 space-y-2">
            <h3 class="text-xl font-bold">{{ event.team }} - {{ event.group }}</h3>
            <p class="text-gray-300">
              <span class="font-semibold">Match:</span>
              {{ event.isDomicile ? 'Domicile' : 'Extérieur' }}
            </p>
            <p v-if="event.opponent" class="text-gray-300">
              <span class="font-semibold">Adversaire:</span> {{ event.opponent }}
            </p>
            <p v-if="event.location" class="text-gray-300">
              <span class="font-semibold">Lieu:</span> {{ event.location }}
            </p>
            <p v-if="event.time_meetup" class="text-gray-300">
              <span class="font-semibold">RDV:</span> {{ event.time_meetup }}
            </p>
            <p v-if="event.referees.length" class="text-gray-300">
              <span class="font-semibold">Arbitres:</span> {{ event.referees.join(', ') }}
            </p>
            <p v-if="event.bar" class="text-gray-300">
              <span class="font-semibold">Bar:</span> {{ event.bar }}
            </p>
            <p v-if="event.result.length === 2" class="text-lg font-bold text-purple-400">
              Résultat: {{ event.result[0] }} - {{ event.result[1] }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

div {
  font-family: 'Inter', sans-serif;
}
</style>
