<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import HistoryEventsDataJson from '@/assets/storage_json/history_events.json'
import type { HistoryEvent } from '@/models/HistoryEvent'

gsap.registerPlugin(ScrollTrigger)

const historyEvents = ref<HistoryEvent[]>(HistoryEventsDataJson as HistoryEvent[])

onMounted(() => {
  gsap.from('.history-title', {
    opacity: 0,
    y: 50,
    duration: 1,
    scrollTrigger: {
      trigger: '.history-title',
      start: 'top 80%',
    },
  })

  gsap.utils.toArray('.timeline-item').forEach((item: any, i) => {
    gsap.from(item, {
      opacity: 0,
      x: i % 2 === 0 ? -50 : 50,
      duration: 1,
      scrollTrigger: {
        trigger: item,
        start: 'top 80%',
      },
    })
  })
})
</script>

<template>
  <!-- Outer wrapper uses page background + text tokens -->
  <div
    class="min-h-screen bg-page dark:bg-page-dark text-mainText dark:text-mainText-dark py-16 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-4xl mx-auto">
      <!-- Title -->
      <h1 class="history-title text-4xl font-bold text-center mb-12">L'Histoire du BSM</h1>

      <!-- Timeline Container -->
      <div class="relative">
        <!-- Vertical line (accent color) -->
        <div class="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-purple-600"></div>

        <!-- Timeline items -->
        <div v-for="(event, index) in historyEvents" :key="event.year" class="timeline-item mb-12">
          <div :class="index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'" class="relative">
            <!-- Circle with Year -->
            <div
              :class="index % 2 === 0 ? 'right-0 mr-[-1.5rem]' : 'left-0 ml-[-1.5rem]'"
              class="absolute top-0 w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center"
            >
              <span class="text-lg font-bold text-white">
                {{ event.year }}
              </span>
            </div>

            <!-- Timeline card (use "bg-card" + "dark:bg-card-dark") -->
            <div
              :class="[index % 2 === 0 ? 'mr-16' : 'ml-16', 'timeline-card']"
              class="bg-card dark:bg-card-dark p-6 rounded-lg shadow-lg md:hover:shadow-xl transition-shadow duration-300"
            >
              <h3 class="text-xl font-semibold mb-2">
                {{ event.title }}
              </h3>
              <!-- For secondary text, use text-mutedText -->
              <p class="text-mutedText dark:text-mutedText-dark">
                {{ event.description }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- "L'Esprit du BSM" section -->
      <div class="mt-16 bg-card dark:bg-card-dark p-8 rounded-lg shadow-lg">
        <h2 class="text-2xl font-bold mb-4">L'Esprit du BSM</h2>
        <p class="text-mutedText dark:text-mutedText-dark mb-4">
          Depuis sa fondation en 1981, le BSM incarne l'esprit sportif et la détermination sur une
          terre traditionnellement dévolue au football. Au cœur de Sevremoine, le club s'est érigé
          en véritable emblème, rassemblant une famille de plusieurs centaines de licenciés et
          devenant ainsi le pilier du sport local.
        </p>
        <p class="text-mutedText dark:text-mutedText-dark mb-4">
          Malgré les épreuves, le BSM reste fidèle à ses valeurs fondamentales : la solidarité, la
          combativité et l'esprit collectif. Ces principes guident le club à travers chaque période,
          symbolisant la force de caractère et la résilience de cette institution sportive.
        </p>
        <p class="text-mutedText dark:text-mutedText-dark">
          Au fil des années, le BSM a démontré sa capacité à surmonter les obstacles, à renforcer
          ses liens familiaux et à incarner l'excellence sportive. L'histoire du club est un
          témoignage de persévérance et de passion pour le basket-ball.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Keep your 3D rotate style logic here */
.timeline-card {
  transform: perspective(1000px) rotateY(0deg);
  transition: transform 0.3s ease-in-out;
}

.timeline-item:nth-child(even) .timeline-card {
  transform: perspective(1000px) rotateY(-15deg);
}

.timeline-item:nth-child(odd) .timeline-card {
  transform: perspective(1000px) rotateY(15deg);
}

@media (min-width: 768px) {
  .timeline-item:hover .timeline-card {
    transform: perspective(1000px) rotateY(0deg);
  }
}
</style>
