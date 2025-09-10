<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

type Session = {
  weekday: 'Lundi' | 'Mardi' | 'Mercredi' | 'Jeudi' | 'Vendredi' | 'Samedi' | 'Dimanche'
  start: string
  end: string
}

const activityName = 'Basket’Fit'

// Saison issue de l’affiche (01/09/2025 → 30/06/2026)
const seasonStart = '2025-09-01'
const seasonEnd = '2026-06-30'

// Données lieu issues de l’affiche + comité 49
const venue = {
  name: 'Salle G. Raymond - St Macaire',
  street: 'Rue Georges Raymond',
  postalCode: '49450',
  city: 'Saint-Macaire-en-Mauges',
  commune: 'Sèvremoine',
  region: 'Pays de la Loire',
  country: 'FR',
  gmapsQuery: encodeURIComponent(
    'Salle Georges Raymond, Rue Georges Raymond, 49450 Saint-Macaire-en-Mauges',
  ),
}

const clubLinks = {
  contacts: 'https://www.bsmbasket.fr/contacts/',
  site: 'https://www.bsmbasket.fr/',
}

// Créneaux (affiche)
const sessions = ref<Session[]>([
  { weekday: 'Mercredi', start: '20:00', end: '21:15' },
  { weekday: 'Samedi', start: '20:00', end: '21:15' },
])

// Âge: le site BSM annonce “section basket fit ouverte à partir de 14 ans”
const minAge = ref<number>(14)
const ageText = computed(() => `À partir de ${minAge.value} ans`)

const benefits = [
  'Activité dynamique, ludique et non compétitive',
  'Circuit training inspiré des fondamentaux du basket',
  'Cardio + renforcement musculaire + mobilité + respiration',
  'Dépense énergétique individualisée, accessible à tous',
  'Bien-être, gestion du stress, plaisir et partage',
  'Élan individuel renforcé par la pratique collective',
]

const requirements = [
  'Licence FFBB Basket’Fit ou licence loisir en règle',
  'Certificat médical selon la réglementation en vigueur',
  'Tenue de sport, bouteille d’eau, baskets propres',
]

const jsonLd = computed(() => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: `BSM ${activityName}`,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    startDate: seasonStart,
    endDate: seasonEnd,
    eventSchedule: sessions.value.map((s) => ({
      '@type': 'Schedule',
      byDay: s.weekday,
      startTime: s.start,
      endTime: s.end,
    })),
    location: {
      '@type': 'SportsActivityLocation',
      name: venue.name,
      address: {
        '@type': 'PostalAddress',
        streetAddress: venue.street,
        postalCode: venue.postalCode,
        addressLocality: venue.city,
        addressRegion: venue.region,
        addressCountry: venue.country,
      },
    },
  }
})

onMounted(() => {
  const el = document.getElementById('basketfit-jsonld')
  if (el) el.textContent = JSON.stringify(jsonLd.value)
})
</script>

<template>
  <main class="bg-page text-mainText dark:bg-page-dark dark:text-mainText-dark">
    <!-- HERO -->
    <section
      class="border-b border-borderColor dark:border-borderColor-dark bg-gradient-to-b from-card/80 to-transparent"
    >
      <div class="mx-auto max-w-5xl px-4 py-14 flex flex-col md:flex-row md:items-center gap-10">
        <div class="flex-1">
          <p class="uppercase tracking-widest text-xs text-mutedText dark:text-mutedText-dark mb-2">
            BSM Basket • Bien-être & Performance
          </p>
          <h1
            class="text-4xl md:text-5xl font-extrabold text-accent dark:text-accent-dark drop-shadow-sm"
          >
            Basket’Fit
          </h1>
          <p class="mt-4 text-lg text-mutedText dark:text-mutedText-dark max-w-xl">
            Se dépenser, sculpter son corps, prendre du plaisir… ensemble.
          </p>
          <div class="mt-8 flex flex-wrap gap-3">
            <a
              :href="`https://www.google.com/maps/search/?q=${venue.gmapsQuery}`"
              target="_blank"
              rel="noopener"
              class="inline-flex items-center justify-center rounded-xl px-5 py-2.5 font-semibold border border-borderColor dark:border-borderColor-dark bg-card text-mainText dark:bg-card-dark dark:text-mainText-dark hover:bg-accent/10 dark:hover:bg-accent-dark/10 transition"
            >
              Voir l’accès salle
            </a>
          </div>
          <ul
            class="mt-8 flex flex-wrap gap-x-8 gap-y-2 text-sm text-mutedText dark:text-mutedText-dark"
          >
            <li>
              <span class="font-semibold text-mainText dark:text-mainText-dark">Période</span>
              01/09/2025 → 30/06/2026
            </li>
            <li>
              <span class="font-semibold text-mainText dark:text-mainText-dark">Âge</span>
              {{ ageText }}
            </li>
            <li>
              <span class="font-semibold text-mainText dark:text-mainText-dark">Lieu</span>
              {{ venue.name }}
            </li>
          </ul>
        </div>
        <div class="flex-1 flex justify-center md:justify-end">
          <img
            src="https://placehold.co/400x500/png?text=Basket%27Fit%20BSM&font=roboto"
            alt="Basket’Fit BSM"
            class="rounded-2xl shadow-lg w-full max-w-xs object-cover border border-borderColor dark:border-borderColor-dark bg-card dark:bg-card-dark"
            loading="lazy"
          />
        </div>
      </div>
    </section>

    <!-- SÉANCES -->
    <section>
      <div class="mx-auto max-w-5xl px-4 py-12">
        <h2 class="text-2xl font-bold mb-6 text-accent dark:text-accent-dark">
          Séances hebdomadaires
        </h2>
        <div class="grid gap-6 sm:grid-cols-2">
          <article
            v-for="s in sessions"
            :key="s.weekday"
            class="rounded-2xl border border-borderColor dark:border-borderColor-dark bg-card dark:bg-card-dark p-6 shadow-sm hover:shadow-lg transition"
          >
            <h3 class="text-lg font-semibold text-mainText dark:text-mainText-dark">
              {{ s.weekday }}
            </h3>
            <p class="text-mutedText dark:text-mutedText-dark">{{ s.start }} – {{ s.end }}</p>
            <p class="text-mutedText dark:text-mutedText-dark">{{ venue.name }}</p>
          </article>
        </div>
        <p class="mt-4 text-sm text-mutedText dark:text-mutedText-dark italic">
          Planning susceptible d’évoluer en fonction des vacances et événements du club.
        </p>
      </div>
    </section>

    <!-- CONCEPT -->
    <section
      class="border-y border-borderColor dark:border-borderColor-dark bg-card dark:bg-card-dark"
    >
      <div class="mx-auto max-w-5xl px-4 py-12">
        <h2 class="text-2xl font-bold mb-6 text-accent dark:text-accent-dark">Le concept</h2>
        <ul class="space-y-3">
          <li v-for="b in benefits" :key="b" class="pl-6 relative">
            <span
              class="absolute left-0 top-2 h-2.5 w-2.5 rounded-full bg-accent dark:bg-accent-dark"
            ></span>
            {{ b }}
          </li>
        </ul>
      </div>
    </section>

    <!-- PRÉPARER SA VENUE -->
    <section>
      <div class="mx-auto max-w-5xl px-4 py-12">
        <h2 class="text-2xl font-bold mb-6 text-accent dark:text-accent-dark">Préparer sa venue</h2>
        <ul class="space-y-3">
          <li v-for="r in requirements" :key="r" class="pl-6 relative">
            <span
              class="absolute left-0 top-2 h-2.5 w-2.5 rounded-full bg-accent dark:bg-accent-dark"
            ></span>
            {{ r }}
          </li>
        </ul>
        <p class="mt-4 text-sm text-mutedText dark:text-mutedText-dark">
          Pour les questions licences/assurances, consulte notre page
          <a
            :href="clubLinks.contacts"
            class="underline hover:text-accent dark:hover:text-accent-dark"
            >Contacts</a
          >.
        </p>
      </div>
    </section>

    <!-- LIEU -->
    <section
      class="border-y border-borderColor dark:border-borderColor-dark bg-gradient-to-t from-card/80 to-transparent"
    >
      <div class="mx-auto max-w-5xl px-4 py-12">
        <h2 class="text-2xl font-bold mb-6 text-accent dark:text-accent-dark">Lieu & accès</h2>
        <address class="not-italic mb-4">
          <div class="font-semibold text-mainText dark:text-mainText-dark">{{ venue.name }}</div>
          <div>{{ venue.street }}</div>
          <div>{{ venue.postalCode }} – {{ venue.city }}</div>
        </address>
        <div
          class="overflow-hidden rounded-2xl border border-borderColor dark:border-borderColor-dark shadow-lg"
        >
          <iframe
            class="w-full h-[340px] block"
            :src="`https://www.google.com/maps?q=${venue.gmapsQuery}&output=embed`"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            title="Plan d’accès Basket’Fit - BSM"
          ></iframe>
        </div>
      </div>
    </section>
  </main>
</template>
