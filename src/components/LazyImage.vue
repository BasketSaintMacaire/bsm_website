<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

interface Props {
  src: string
  alt: string
  width?: string | number
  height?: string | number
  class?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  error: [event: Event]
}>()

const isLoaded = ref(false)
const hasError = ref(false)
const imageSrc = ref('')
const sentinelElement = ref<HTMLDivElement | null>(null)
let observer: IntersectionObserver | null = null

onMounted(() => {
  if (!sentinelElement.value) return

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          imageSrc.value = props.src
          observer?.unobserve(entry.target)
        }
      })
    },
    {
      rootMargin: '50px',
    },
  )

  observer.observe(sentinelElement.value)
})

onBeforeUnmount(() => {
  if (observer && sentinelElement.value) {
    observer.unobserve(sentinelElement.value)
  }
  observer?.disconnect()
})

const handleImageLoad = () => {
  isLoaded.value = true
}

const handleImageError = (event: Event) => {
  hasError.value = true
  emit('error', event)
}
</script>

<template>
  <div ref="sentinelElement" class="relative overflow-hidden" :style="{ width, height }">
    <!-- Loading skeleton/placeholder -->
    <div
      v-if="!isLoaded && !hasError && imageSrc"
      class="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse"
    ></div>

    <!-- Actual image (only render when src is set) -->
    <img
      v-if="imageSrc && !hasError"
      :src="imageSrc"
      :alt="alt"
      :class="[
        props.class,
        'transition-opacity duration-300',
        isLoaded ? 'opacity-100' : 'opacity-0',
      ]"
      @load="handleImageLoad"
      @error="handleImageError"
    />

    <!-- Error state -->
    <div
      v-if="hasError"
      class="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800"
    >
      <span class="text-gray-400 dark:text-gray-600 text-sm">Image unavailable</span>
    </div>
  </div>
</template>
