<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import planningDataJson from '@/assets/storage_json/matchs.json'
import type { Match } from '@/models/Match'

/* --------------------------------------------------
   1. HELPER FUNCTIONS
-------------------------------------------------- */

// Convert "dd/mm/yyyy" to a real JavaScript Date
function parseDate(dateStr: string): Date {
  const [day, month, year] = dateStr.split('/').map(Number)
  // Note: month is 0-based in JS Date
  return new Date(year, month - 1, day)
}

// Check if a given JS Date is Saturday or Sunday
function isWeekend(date: Date): boolean {
  const day = date.getDay() // 0 = Sunday, 6 = Saturday
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

// The user’s selected weekend-range or "" (All weeks)
const filterWeekendRange = ref('')

// The user’s selected team or "" (All teams)
const filterTeam = ref('')

/* --------------------------------------------------
   3. GROUP SATURDAY & SUNDAY INTO SINGLE "WEEKEND" ENTRY
-------------------------------------------------- */

/**
 * We want to find all weekends for which we have events.
 * - A “weekend” is either Saturday, Sunday, or both.
 * - If both days exist in the data for the same weekend, group them as "Sat - Sun".
 * - If only Saturday or only Sunday exists, it's still a single "weekend" entry.
 *
 * We'll return an array of objects like:
 *   {
 *     label: "06/05/2025 - 07/05/2025",  // For the dropdown
 *     saturdaysDateStr: "06/05/2025",
 *     sundaysDateStr: "07/05/2025"
 *   }
 */
const weekendRanges = computed(() => {
  // Step A: Find all unique weekend dates from the planning data
  const allWeekendDates = planningData.value
    .map((e) => parseDate(e.date))
    .filter((dateObj) => isWeekend(dateObj))

  // Step B: Group them by the "weekend" (Saturday + Sunday).
  // One approach: For each found weekend date, figure out its "Saturday date".
  //   - If it's Sunday, the "Saturday date" is day - 1
  //   - If it's Saturday, the "Saturday date" is itself
  // Then store them in a Map keyed by that "Saturday" date (in ms).
  const weekendMap = new Map<number, { sat?: Date; sun?: Date }>()

  allWeekendDates.forEach((dateObj) => {
    const day = dateObj.getDay() // 0=Sun, 6=Sat
    let saturdayDate: Date

    if (day === 6) {
      // It's a Saturday
      saturdayDate = dateObj
    } else {
      // It's Sunday, so the "Saturday" is one day before
      saturdayDate = new Date(dateObj)
      saturdayDate.setDate(saturdayDate.getDate() - 1)
    }

    const satKey = saturdayDate.getTime()

    const existing = weekendMap.get(satKey) || {}
    if (day === 6) {
      // This date is Saturday
      existing.sat = dateObj
    } else {
      // This date is Sunday
      existing.sun = dateObj
    }
    weekendMap.set(satKey, existing)
  })

  // Step C: Build an array of "weekend" objects with a label
  const weekendEntries = Array.from(weekendMap.values()).map((obj) => {
    const { sat, sun } = obj
    if (sat && sun) {
      // We have both days
      const label = `${formatDDMMYYYY(sat)} - ${formatDDMMYYYY(sun)}`
      return {
        label,
        saturdaysDateStr: formatDDMMYYYY(sat),
        sundaysDateStr: formatDDMMYYYY(sun),
      }
    } else if (sat) {
      // Only Saturday
      const label = formatDDMMYYYY(sat)
      return {
        label,
        saturdaysDateStr: formatDDMMYYYY(sat),
        sundaysDateStr: '', // no Sunday
      }
    } else if (sun) {
      // Only Sunday
      const label = formatDDMMYYYY(sun)
      return {
        label,
        saturdaysDateStr: '', // no Saturday
        sundaysDateStr: formatDDMMYYYY(sun),
      }
    } else {
      // Shouldn't happen logically, but just in case
      return {
        label: '',
        saturdaysDateStr: '',
        sundaysDateStr: '',
      }
    }
  })

  // Step D: Sort by the first day (the Saturday if we have it, otherwise the Sunday).
  weekendEntries.sort((a, b) => {
    // Convert the first day in each weekend range to a comparable date
    // if the saturday is empty, we use the sunday
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

  // Find the first weekend whose Saturday or Sunday is >= today
  // We'll check whichever date is earliest (Saturday if present, else Sunday).
  const nextWeekendEntry = weekendRanges.value.find((entry) => {
    const firstDayStr = entry.saturdaysDateStr || entry.sundaysDateStr
    const firstDayDate = parseDate(firstDayStr)
    // If the first day is "before" today but there's a Sunday after today,
    // you might want extra logic. But typically we only use the first day
    // to decide if the entire weekend is upcoming or not.
    return firstDayDate >= today
  })

  if (nextWeekendEntry) {
    filterWeekendRange.value = nextWeekendEntry.label
  } else {
    // If none found, default to "All weeks"
    filterWeekendRange.value = ''
  }
})

/* --------------------------------------------------
   5. COMPUTED FILTERED EVENTS
-------------------------------------------------- */
const filteredEvents = computed(() => {
  // 1) First apply the existing filters
  const events = planningData.value.filter((event) => {
    // -- Team filter --
    if (filterTeam.value && event.team !== filterTeam.value) {
      return false
    }

    // -- Weekend filter ("" means "All weeks") --
    if (!filterWeekendRange.value) {
      return true
    }

    // If user selected a specific weekend, check if event matches the weekend’s days
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

  // 2) Sort the filtered events by date, then time
  events.sort((a, b) => {
    // Compare dates first
    const dateA = a.date
    const dateB = b.date

    if (dateA < dateB) return -1
    if (dateA > dateB) return 1

    // If same date, compare time_start
    const timeA = parseTimeToMinutes(a.time_start)
    const timeB = parseTimeToMinutes(b.time_start)
    return timeA - timeB
  })

  // Return the sorted list
  return events
})

/* --------------------------------------------------
   6. EXTRACT UNIQUE TEAMS (unchanged from your original)
-------------------------------------------------- */
const uniqueTeams = computed(() =>
  Array.from(new Set(planningData.value.map((event) => event.team))),
)

// Convert "HH:MM" to a comparable number of minutes, or just compare strings if zero-padded
function parseTimeToMinutes(timeStr: string): number {
  const [hh, mm] = timeStr.split(':').map(Number)
  return hh * 60 + mm
}

const badgesByEvent = computed(() => {
  // We'll store the badge text in a WeakMap for each event object
  // (WeakMap is convenient for object keys, but a regular Map also works.)
  const badgeMap = new WeakMap<Match, string>()

  // 1) Filter the events again to only home matches (but we use your final filtered list).
  const homeEvents = filteredEvents.value.filter(
    (e) => e.isDomicile && e.location && !e.location.includes('Saint André'),
  )

  // 2) Group them by (date, location)
  //    We'll use an object-of-arrays structure: { [date_location_key]: Match[] }
  const groups: Record<string, Match[]> = {}
  homeEvents.forEach((event) => {
    const key = `${event.date}__${event.location}`
    groups[key] = groups[key] || []
    groups[key].push(event)
  })

  // 3) For each group, sort by time_start and mark first/last
  Object.values(groups).forEach((eventsInGroup) => {
    // Sort by time_start (earliest -> latest)
    eventsInGroup.sort((a, b) => {
      // If your times are zero-padded, you can do a simple a.time_start < b.time_start
      // but let's be safe and parse as minutes:
      return parseTimeToMinutes(a.time_start) - parseTimeToMinutes(b.time_start)
    })

    // Mark the first as "OUVERTURE" and the last as "FERMETURE".
    // If there's only one event, let's give it "OUVERTURE".
    if (eventsInGroup.length === 1) {
      badgeMap.set(eventsInGroup[0], 'OUVERTURE')
    } else {
      // More than one match
      badgeMap.set(eventsInGroup[0], 'OUVERTURE')
      badgeMap.set(eventsInGroup[eventsInGroup.length - 1], 'FERMETURE')
    }
  })

  return badgeMap
})
</script>

<template>
  <div
    class="min-h-screen bg-page dark:bg-page-dark text-mainText dark:text-mainText-dark py-8 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-7xl mx-auto">
      <h1 class="text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-purple-600">
        Planning BSM St Macaire en Mauges
      </h1>

      <div class="flex justify-center items-center mb-6">
        <p class="text-xs font-medium px-2 py-1 rounded-md bg-orange-500 text-white">
          Merci de bien vouloir consulter l’ensemble des rencontres du week-end afin de vérifier que
          ni vous, ni votre enfant, ni votre équipe ne soient désignés pour l’arbitrage, la table ou
          le bar.
        </p>
      </div>

      <!-- FILTERS WRAPPER -->
      <div class="mb-8 flex flex-col sm:flex-row justify-center items-center gap-4">
        <!-- WEEKEND FILTER -->
        <div class="w-full sm:w-64">
          <label
            for="weekend-filter"
            class="block text-sm font-medium text-mutedText dark:text-mutedText-dark mb-1"
          >
            Filtrer par week-end
          </label>
          <select
            id="weekend-filter"
            v-model="filterWeekendRange"
            class="w-full bg-card dark:bg-card-dark border border-card dark:border-card-dark rounded-md py-2 px-3 text-mainText dark:text-mainText-dark focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
          >
            <!-- "All weeks" option -->
            <option value="">Toutes les semaines</option>

            <!-- Each weekend combined -->
            <option v-for="(weekend, idx) in weekendRanges" :key="idx" :value="weekend.label">
              {{ weekend.label }}
            </option>
          </select>
        </div>

        <!-- TEAM FILTER -->
        <div class="w-full sm:w-64">
          <label
            for="team-filter"
            class="block text-sm font-medium text-mutedText dark:text-mutedText-dark mb-1"
          >
            Filtrer par équipe
          </label>
          <select
            id="team-filter"
            v-model="filterTeam"
            class="w-full bg-card dark:bg-card-dark border border-card dark:border-card-dark rounded-md py-2 px-3 text-mainText dark:text-mainText-dark focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
          >
            <option value="">Toutes les équipes</option>
            <option v-for="team in uniqueTeams" :key="team" :value="team">
              {{ team }}
            </option>
          </select>
        </div>
      </div>

      <!-- EVENTS DISPLAY -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="event in filteredEvents"
          :key="`${event.date}-${event.time_start}-${event.team}`"
          class="bg-card dark:bg-card-dark rounded-lg shadow-lg overflow-hidden transition-transform duration-300 md:hover:scale-105"
        >
          <div
            class="bg-mutedText dark:bg-mutedText-dark px-4 py-3 text-lg font-semibold text-mainText dark:text-mainText-dark flex items-center justify-between"
          >
            <span>{{ event.date }} - {{ event.time_start }}</span>

            <span
              v-if="badgesByEvent.get(event)"
              class="text-xs font-medium px-2 py-1 rounded-md bg-red-500 text-white"
            >
              {{ badgesByEvent.get(event) }}
            </span>
          </div>
          <div class="p-4 space-y-2">
            <h3 class="text-xl font-bold text-mainText dark:text-mainText-dark">
              {{ event.team }} - {{ event.group }}
            </h3>
            <p class="text-mutedText dark:text-mutedText-dark">
              <span class="font-semibold">Match :</span>
              {{ event.isDomicile ? 'Domicile' : 'Extérieur' }}
            </p>
            <p v-if="event.opponent" class="text-mutedText dark:text-mutedText-dark">
              <span class="font-semibold">Adversaire :</span> {{ event.opponent }}
            </p>
            <p v-if="event.location" class="text-mutedText dark:text-mutedText-dark">
              <span class="font-semibold">Lieu :</span> {{ event.location }}
            </p>
            <p v-if="event.time_meetup" class="text-mutedText dark:text-mutedText-dark">
              <span class="font-semibold">RDV :</span> {{ event.time_meetup }}
            </p>
            <p v-if="event.referees.length" class="text-mutedText dark:text-mutedText-dark">
              <span class="font-semibold">Arbitres :</span>
              {{ event.referees.join(', ') }}
            </p>
            <p v-if="event.family_duety.length" class="text-mutedText dark:text-mutedText-dark">
              <span class="font-semibold">Tables :</span>
              {{ event.family_duety.join(', ') }}
            </p>
            <p v-if="event.bar" class="text-mutedText dark:text-mutedText-dark">
              <span class="font-semibold">Bar :</span> {{ event.bar }}
            </p>
            <p v-if="event.result.length === 2" class="text-lg font-bold text-purple-400">
              Résultat : {{ event.result[0] }} - {{ event.result[1] }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Your custom styles if needed */
</style>
