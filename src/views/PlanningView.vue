<script setup lang="ts">
import { ref, computed } from 'vue'
import { parseISO, format } from 'date-fns'
import { fr } from 'date-fns/locale'
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

const formatDate = (dateString: string) => {
  const [day, date] = dateString.split('\n')
  return `${day.trim()} ${format(parseISO(date.trim().replace('/', '-')), 'd MMMM', { locale: fr })}`
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6 text-center">Planning BSM St Macaire en Mauges</h1>

    <div class="mb-6 flex flex-wrap gap-4">
      <div class="w-full md:w-auto">
        <label for="date-filter" class="block text-sm font-medium text-gray-700 mb-1"
          >Filtrer par date</label
        >
        <select
          id="date-filter"
          v-model="filterDate"
          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="">Toutes les dates</option>
          <option v-for="date in uniqueDates" :key="date" :value="date">
            {{ date }}
          </option>
        </select>
      </div>

      <div class="w-full md:w-auto">
        <label for="team-filter" class="block text-sm font-medium text-gray-700 mb-1"
          >Filtrer par équipe</label
        >
        <select
          id="team-filter"
          v-model="filterTeam"
          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="">Toutes les équipes</option>
          <option v-for="team in uniqueTeams" :key="team" :value="team">{{ team }}</option>
        </select>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div
        v-for="(event, index) in filteredEvents"
        :key="index"
        class="bg-white rounded-lg shadow-md overflow-hidden"
      >
        <div :class="event.isDomicile ? 'bg-green-600' : 'bg-blue-600' + ' text-white px-4 py-2'">
          <h2 class="text-xl font-semibold">{{ event.date }}</h2>
          <p class="text-sm">{{ event.time_start }} (RDV: {{ event.time_meetup }})</p>
        </div>
        <div class="p-4">
          <p class="font-bold text-lg mb-2">{{ event.team }} - {{ event.group }}</p>
          <p class="mb-1">
            <span class="font-semibold">Match:</span>
            {{ event.isDomicile ? 'Domicile' : 'Extérieur' }}
          </p>
          <p v-if="event.opponent" class="mb-1">
            <span class="font-semibold">Adversaire:</span> {{ event.opponent }}
          </p>
          <p v-if="event.location" class="mb-1">
            <span class="font-semibold">Lieu:</span> {{ event.location }}
          </p>
          <p v-if="event.referees.length > 0" class="mb-1">
            <span class="font-semibold">Arbitres:</span> {{ event.referees.join(', ') }}
          </p>
          <p v-if="event.bar" class="mb-1">
            <span class="font-semibold">Bar:</span> {{ event.bar }}
          </p>
          <p v-if="event.result.length === 2" class="mt-2 text-indigo-600 font-bold">
            Résultat: {{ event.result[0] }} - {{ event.result[1] }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add any additional styling here */
</style>
