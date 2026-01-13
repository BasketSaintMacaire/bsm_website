<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Trophy,
  Home,
  Plane,
  Megaphone,
  User,
  Coffee,
  Target,
} from 'lucide-vue-next'
import planningDataJson from '@/assets/storage_json/matchs.json'
import type { Match } from '@/models/Match'

/* --------------------------------------------------
   1. HELPER FUNCTIONS
-------------------------------------------------- */

// Convert "dd/mm/yyyy" to a real JavaScript Date
function parseDate(dateStr: string): Date {
  const [day, month, year] = dateStr.split('/').map(Number)
  return new Date(year, month - 1, day)
}

// Check if a given JS Date is Saturday or Sunday
function isWeekend(date: Date): boolean {
  const day = date.getDay()
  return day === 6 || day === 0
}

// Format a JS Date back to "dd/mm/yyyy"
function formatDDMMYYYY(date: Date): string {
  const d = String(date.getDate()).padStart(2, '0')
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const y = date.getFullYear()
  return `${d}/${m}/${y}`
}

/* --------------------------------------------------
   2. REACTIVE STATE
-------------------------------------------------- */

const planningData = ref<Match[]>(planningDataJson as Match[])
const filterWeekendRange = ref('')
const filterTeam = ref('')
const isVisible = ref(false)

/* --------------------------------------------------
   3. GROUP SATURDAY & SUNDAY INTO SINGLE "WEEKEND" ENTRY
-------------------------------------------------- */

const weekendRanges = computed(() => {
  const allWeekendDates = planningData.value
    .map((e) => parseDate(e.date))
    .filter((dateObj) => isWeekend(dateObj))

  const weekendMap = new Map<number, { sat?: Date; sun?: Date }>()

  allWeekendDates.forEach((dateObj) => {
    const day = dateObj.getDay()
    let saturdayDate: Date

    if (day === 6) {
      saturdayDate = dateObj
    } else {
      saturdayDate = new Date(dateObj)
      saturdayDate.setDate(saturdayDate.getDate() - 1)
    }

    const satKey = saturdayDate.getTime()
    const existing = weekendMap.get(satKey) || {}
    if (day === 6) {
      existing.sat = dateObj
    } else {
      existing.sun = dateObj
    }
    weekendMap.set(satKey, existing)
  })

  const weekendEntries = Array.from(weekendMap.values()).map((obj) => {
    const { sat, sun } = obj
    if (sat && sun) {
      const label = `${formatDDMMYYYY(sat)} - ${formatDDMMYYYY(sun)}`
      return {
        label,
        saturdaysDateStr: formatDDMMYYYY(sat),
        sundaysDateStr: formatDDMMYYYY(sun),
      }
    } else if (sat) {
      const label = formatDDMMYYYY(sat)
      return {
        label,
        saturdaysDateStr: formatDDMMYYYY(sat),
        sundaysDateStr: '',
      }
    } else if (sun) {
      const label = formatDDMMYYYY(sun)
      return {
        label,
        saturdaysDateStr: '',
        sundaysDateStr: formatDDMMYYYY(sun),
      }
    } else {
      return {
        label: '',
        saturdaysDateStr: '',
        sundaysDateStr: '',
      }
    }
  })

  weekendEntries.sort((a, b) => {
    const aDateStr = a.saturdaysDateStr || a.sundaysDateStr
    const bDateStr = b.saturdaysDateStr || b.sundaysDateStr
    const aDate = parseDate(aDateStr)
    const bDate = parseDate(bDateStr)
    return aDate.getTime() - bDate.getTime()
  })

  return weekendEntries
})

/* --------------------------------------------------
   4. AUTO-SELECT NEXT UPCOMING WEEKEND
-------------------------------------------------- */
onMounted(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const nextWeekendEntry = weekendRanges.value.find((entry) => {
    const firstDayStr = entry.saturdaysDateStr || entry.sundaysDateStr
    const firstDayDate = parseDate(firstDayStr)
    return firstDayDate >= today
  })

  if (nextWeekendEntry) {
    filterWeekendRange.value = nextWeekendEntry.label
  } else {
    filterWeekendRange.value = ''
  }

  setTimeout(() => {
    isVisible.value = true
  }, 100)
})

/* --------------------------------------------------
   5. COMPUTED FILTERED EVENTS
-------------------------------------------------- */
const filteredEvents = computed(() => {
  const events = planningData.value.filter((event) => {
    if (filterTeam.value && event.team !== filterTeam.value) {
      return false
    }

    if (!filterWeekendRange.value) {
      return true
    }

    const selectedWeekend = weekendRanges.value.find((w) => w.label === filterWeekendRange.value)
    if (!selectedWeekend) {
      return false
    }

    const evtDate = event.date
    const matchSat =
      selectedWeekend.saturdaysDateStr && evtDate === selectedWeekend.saturdaysDateStr
    const matchSun = selectedWeekend.sundaysDateStr && evtDate === selectedWeekend.sundaysDateStr

    return matchSat || matchSun
  })

  events.sort((a, b) => {
    const dateA = a.date
    const dateB = b.date

    if (dateA < dateB) return -1
    if (dateA > dateB) return 1

    const timeA = parseTimeToMinutes(a.time_start)
    const timeB = parseTimeToMinutes(b.time_start)
    return timeA - timeB
  })

  return events
})

const uniqueTeams = computed(() =>
  Array.from(new Set(planningData.value.map((event) => event.team))),
)

function parseTimeToMinutes(timeStr: string): number {
  const [hh, mm] = timeStr.split(':').map(Number)
  return hh * 60 + mm
}

const badgesByEvent = computed(() => {
  const badgeMap = new WeakMap<Match, string>()
  const homeEvents = filteredEvents.value.filter(
    (e) => e.isDomicile && e.location && !e.location.includes('Saint André'),
  )

  const groups: Record<string, Match[]> = {}
  homeEvents.forEach((event) => {
    const key = `${event.date}__${event.location}`
    groups[key] = groups[key] || []
    groups[key].push(event)
  })

  Object.values(groups).forEach((eventsInGroup) => {
    eventsInGroup.sort((a, b) => {
      return parseTimeToMinutes(a.time_start) - parseTimeToMinutes(b.time_start)
    })

    if (eventsInGroup.length === 1) {
      badgeMap.set(eventsInGroup[0], 'OUVERTURE')
    } else {
      badgeMap.set(eventsInGroup[0], 'OUVERTURE')
      badgeMap.set(eventsInGroup[eventsInGroup.length - 1], 'FERMETURE')
    }
  })

  return badgeMap
})
</script>

<template>
  <div class="min-h-screen bg-page dark:bg-page-dark relative overflow-hidden">
    <!-- Background Elements -->
    <div class="absolute inset-0 overflow-hidden">
      <div
        class="absolute -top-40 -right-40 w-80 h-80 bg-purple-100 dark:bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 dark:opacity-20 animate-pulse"
      ></div>
      <div
        class="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-100 dark:bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 dark:opacity-20 animate-pulse animation-delay-2000"
      ></div>
    </div>

    <div class="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <!-- Hero Section -->
        <div class="text-center mb-12" :class="{ 'animate-fade-in-up': isVisible }">
          <h1
            class="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-purple-600 mb-6 tracking-tight"
          >
            Planning BSM
          </h1>

          <!-- Important Notice -->
          <div class="max-w-4xl mx-auto mb-8">
            <div class="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 shadow-lg">
              <div class="flex items-start space-x-3">
                <Target class="w-6 h-6 text-white flex-shrink-0 mt-1" />
                <p class="text-white font-medium leading-relaxed">
                  Merci de bien vouloir consulter l'ensemble des rencontres du week-end afin de
                  vérifier que ni vous, ni votre enfant, ni votre équipe ne soient désignés pour
                  l'arbitrage, la table ou le bar.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Filters Section -->
        <div class="mb-12" :class="{ 'animate-fade-in-up animation-delay-300': isVisible }">
          <div
            class="bg-card dark:bg-card-dark rounded-2xl shadow-xl border border-borderColor dark:border-borderColor-dark p-8"
          >
            <h2 class="text-2xl font-bold text-mainText dark:text-mainText-dark mb-6 text-center">
              Filtres de recherche
            </h2>
            <div class="grid md:grid-cols-2 gap-6">
              <!-- Weekend Filter -->
              <div class="space-y-2">
                <label
                  class="flex items-center text-sm font-semibold text-mutedText dark:text-mutedText-dark mb-3"
                >
                  <Calendar class="w-5 h-5 mr-2" />
                  Filtrer par week-end
                </label>
                <div class="relative">
                  <select
                    v-model="filterWeekendRange"
                    class="w-full bg-page dark:bg-page-dark border-2 border-borderColor dark:border-borderColor-dark rounded-xl py-4 px-4 text-mainText dark:text-mainText-dark focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer"
                  >
                    <option value="">Toutes les semaines</option>
                    <option
                      v-for="(weekend, idx) in weekendRanges"
                      :key="idx"
                      :value="weekend.label"
                    >
                      {{ weekend.label }}
                    </option>
                  </select>
                  <div
                    class="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none"
                  >
                    <svg
                      class="w-5 h-5 text-mutedText dark:text-mutedText-dark"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Team Filter -->
              <div class="space-y-2">
                <label
                  class="flex items-center text-sm font-semibold text-mutedText dark:text-mutedText-dark mb-3"
                >
                  <Users class="w-5 h-5 mr-2" />
                  Filtrer par équipe
                </label>
                <div class="relative">
                  <select
                    v-model="filterTeam"
                    class="w-full bg-page dark:bg-page-dark border-2 border-borderColor dark:border-borderColor-dark rounded-xl py-4 px-4 text-mainText dark:text-mainText-dark focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer"
                  >
                    <option value="">Toutes les équipes</option>
                    <option v-for="team in uniqueTeams" :key="team" :value="team">
                      {{ team }}
                    </option>
                  </select>
                  <div
                    class="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none"
                  >
                    <svg
                      class="w-5 h-5 text-mutedText dark:text-mutedText-dark"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Events Grid -->
        <div
          class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
          :class="{ 'animate-fade-in-up animation-delay-600': isVisible }"
        >
          <div
            v-for="(event, index) in filteredEvents"
            :key="`${event.date}-${event.time_start}-${event.team}`"
            class="group relative"
            :style="{ animationDelay: `${index * 50}ms` }"
          >
            <!-- Glow Effect -->
            <div
              class="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"
            ></div>

            <!-- Card -->
            <div
              class="relative bg-card dark:bg-card-dark rounded-2xl shadow-xl border border-borderColor dark:border-borderColor-dark overflow-hidden transform transition-all duration-300 hover:scale-105"
            >
              <!-- Header -->
              <div
                class="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white relative overflow-hidden"
              >
                <div class="absolute top-0 right-0 w-32 h-32 opacity-10">
                  <Trophy class="w-full h-full" />
                </div>
                <div class="relative z-10">
                  <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center space-x-2">
                      <Calendar class="w-5 h-5" />
                      <span class="font-semibold">{{ event.date }}</span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <Clock class="w-5 h-5" />
                      <span class="font-semibold">{{ event.time_start }}</span>
                    </div>
                  </div>

                  <!-- Badge -->
                  <div v-if="badgesByEvent.get(event)" class="absolute top-4 right-4">
                    <span
                      class="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg"
                    >
                      {{ badgesByEvent.get(event) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Content -->
              <div class="p-6 space-y-4">
                <!-- Team Info - Compact Row -->
                <div class="flex items-center justify-between mb-4">
                  <div class="flex-1">
                    <h3 class="text-xl font-bold text-mainText dark:text-mainText-dark">
                      {{ event.team }}
                    </h3>
                    <p class="text-sm text-mutedText dark:text-mutedText-dark font-medium">
                      {{ event.group }}
                    </p>
                  </div>
                  <div
                    class="flex items-center space-x-2 bg-page dark:bg-page-dark px-3 py-2 rounded-lg"
                  >
                    <component
                      :is="event.isDomicile ? Home : Plane"
                      class="w-4 h-4"
                      :class="event.isDomicile ? 'text-green-500' : 'text-blue-500'"
                    />
                    <span
                      class="text-sm font-semibold"
                      :class="
                        event.isDomicile
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-blue-600 dark:text-blue-400'
                      "
                    >
                      {{ event.isDomicile ? 'Domicile' : 'Extérieur' }}
                    </span>
                  </div>
                </div>

                <!-- Details -->
                <div class="space-y-3">
                  <div v-if="event.opponent" class="flex items-start space-x-3">
                    <Users class="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span class="text-sm font-medium text-mutedText dark:text-mutedText-dark"
                        >Adversaire</span
                      >
                      <p class="text-mainText dark:text-mainText-dark font-semibold">
                        {{ event.opponent }}
                      </p>
                    </div>
                  </div>

                  <div v-if="event.location" class="flex items-start space-x-3">
                    <MapPin class="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span class="text-sm font-medium text-mutedText dark:text-mutedText-dark"
                        >Lieu</span
                      >
                      <p class="text-mainText dark:text-mainText-dark font-semibold">
                        {{ event.location }}
                      </p>
                    </div>
                  </div>

                  <div v-if="event.time_meetup" class="flex items-start space-x-3">
                    <Clock class="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span class="text-sm font-medium text-mutedText dark:text-mutedText-dark"
                        >RDV</span
                      >
                      <p class="text-mainText dark:text-mainText-dark font-semibold">
                        {{ event.time_meetup }}
                      </p>
                    </div>
                  </div>

                  <div v-if="event.referees.length" class="flex items-start space-x-3">
                    <Megaphone class="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span class="text-sm font-medium text-mutedText dark:text-mutedText-dark"
                        >Arbitres</span
                      >
                      <p class="text-mainText dark:text-mainText-dark font-semibold">
                        {{ event.referees.join(', ') }}
                      </p>
                    </div>
                  </div>

                  <div v-if="event.board_official.length" class="flex items-start space-x-3">
                    <User class="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span class="text-sm font-medium text-mutedText dark:text-mutedText-dark"
                        >Tables</span
                      >
                      <p class="text-mainText dark:text-mainText-dark font-semibold">
                        {{ event.board_official.join(', ') }}
                      </p>
                    </div>
                  </div>

                  <div v-if="event.bar" class="flex items-start space-x-3">
                    <Coffee class="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span class="text-sm font-medium text-mutedText dark:text-mutedText-dark"
                        >Bar</span
                      >
                      <p class="text-mainText dark:text-mainText-dark font-semibold">
                        {{ event.bar }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Result -->
                <div
                  v-if="event.result.length === 2"
                  class="mt-6 p-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl text-center"
                >
                  <p class="text-white font-bold text-lg">
                    Résultat : {{ event.result[0] }} - {{ event.result[1] }}
                  </p>
                </div>
              </div>
            </div>
          </div>
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

.animation-delay-2000 {
  animation-delay: 2s;
}
</style>
