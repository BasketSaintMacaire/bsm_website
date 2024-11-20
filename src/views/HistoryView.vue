<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface HistoryEvent {
  year: number
  title: string
  description: string
}

const historyEvents = ref<HistoryEvent[]>([
  {
    year: 1981,
    title: 'Fondation du BSM',
    description:
      "Fondé par un groupe de passionnés de basket de Saint Macaire, le BSM devient l'emblème sportif de Sevremoine.",
  },
  {
    year: 1998,
    title: "Victoire en Coupe de l'Anjou",
    description:
      "L'équipe phare remporte la Coupe de l'Anjou, marquant le début d'une ascension fulgurante.",
  },
  {
    year: 1998,
    title: 'Accession au championnat régional',
    description: 'Le club progresse rapidement et accède au championnat régional.',
  },
  {
    year: 2004,
    title: 'Niveau national atteint',
    description: 'Le BSM atteint le niveau national, démontrant sa progression constante.',
  },
  {
    year: 2007,
    title: 'Victoire en Coupe des Pays de la Loire',
    description: 'Le club remporte la Coupe des Pays de la Loire, confirmant son statut régional.',
  },
  {
    year: 2009,
    title: 'Rétrogradation administrative',
    description:
      "Une décision administrative entraîne la rétrogradation de l'équipe phare en RM2, marquant le début d'une période difficile.",
  },
  {
    year: 2023,
    title: 'Retour en RM2',
    description:
      "Après quatre montées successives en quatre ans, l'équipe phare regagne la RM2, réaffirmant sa place dans le basket régional.",
  },
])

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
  <div class="min-h-screen bg-black text-white py-16 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="history-title text-4xl font-bold text-center mb-12">L'Histoire du BSM</h1>

      <div class="relative">
        <div class="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-purple-600"></div>

        <div v-for="(event, index) in historyEvents" :key="event.year" class="timeline-item mb-12">
          <div :class="index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'" class="relative">
            <div
              :class="index % 2 === 0 ? 'right-0 mr-[-1.5rem]' : 'left-0 ml-[-1.5rem]'"
              class="absolute top-0 w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center"
            >
              <span class="text-lg font-bold">{{ event.year }}</span>
            </div>
            <div
              :class="[index % 2 === 0 ? 'mr-16' : 'ml-16', 'timeline-card']"
              class="bg-[#1A1A1A] p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <h3 class="text-xl font-semibold mb-2">{{ event.title }}</h3>
              <p class="text-gray-300">{{ event.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-16 bg-[#1A1A1A] p-8 rounded-lg shadow-lg">
        <h2 class="text-2xl font-bold mb-4">L'Esprit du BSM</h2>
        <p class="text-gray-300 mb-4">
          Depuis sa fondation en 1981, le BSM incarne l'esprit sportif et la détermination sur une
          terre traditionnellement dévolue au football. Au cœur de Sevremoine, le club s'est érigé
          en véritable emblème, rassemblant une famille de plusieurs centaines de licenciés et
          devenant ainsi le pilier du sport local.
        </p>
        <p class="text-gray-300 mb-4">
          Malgré les épreuves, le BSM reste fidèle à ses valeurs fondamentales : la solidarité, la
          combativité et l'esprit collectif. Ces principes guident le club à travers chaque période,
          symbolisant la force de caractère et la résilience de cette institution sportive.
        </p>
        <p class="text-gray-300">
          Au fil des années, le BSM a démontré sa capacité à surmonter les obstacles, à renforcer
          ses liens familiaux et à incarner l'excellence sportive. L'histoire du club est un
          témoignage de persévérance et de passion pour le basket-ball.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

* {
  font-family: 'Poppins', sans-serif;
}

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

.timeline-item:hover .timeline-card {
  transform: perspective(1000px) rotateY(0deg);
}
</style>
