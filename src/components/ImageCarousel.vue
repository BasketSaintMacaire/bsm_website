<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

interface Props {
  galleryName: string
  itemWidth: number
  itemHeight: number
}

const props = defineProps<Props>()

const images = ref<string[]>([])
const isDragging = ref(false)
const startX = ref(0)
const scrollLeft = ref(0)
const velocity = ref(0)
const container = ref<HTMLDivElement | null>(null)
let animationFrameId: number | null = null

// Load images using a static path and filter by gallery name
function loadImages() {
  const allImages = import.meta.glob('/src/assets/gallery/*/*.{png,jpg,jpeg,gif,webp,bmp,svg}')
  images.value = Object.keys(allImages).filter((path) =>
    path.includes(`/gallery/${props.galleryName}/`),
  )
}

// Mouse events for drag scrolling
function onMouseDown(event: MouseEvent) {
  isDragging.value = true
  startX.value = event.pageX // Get the initial mouse position
  scrollLeft.value = container.value?.scrollLeft || 0 // Store the current scroll position of the container
  velocity.value = 0 // Reset velocity

  if (animationFrameId) cancelAnimationFrame(animationFrameId) // Stop any ongoing animation

  event.preventDefault() // Prevent default behavior
}

function onMouseMove(event: MouseEvent) {
  if (!isDragging.value || !container.value) return
  const x = event.pageX - startX.value // Calculate the distance moved by the mouse
  const newScrollLeft = scrollLeft.value - x // Calculate new scroll position
  velocity.value = newScrollLeft - (container.value?.scrollLeft || 0) // Calculate the speed
  container.value.scrollLeft = newScrollLeft // Update the scroll position
}

function onMouseUp() {
  isDragging.value = false
  startInertiaScroll() // Start the inertia effect after releasing the drag
}

// Inertia scroll function to create the "Wheel of Fortune" spinning effect
function startInertiaScroll() {
  if (!container.value) return // Ensure container is not null

  function inertia() {
    if (!container.value) return // Double-check container inside the animation loop
    if (Math.abs(velocity.value) < 0.1) return // Stop if speed is very low

    container.value.scrollLeft += velocity.value // Continue scrolling in the direction of the last movement
    velocity.value *= 0.95 // Decrease velocity gradually to simulate friction
    animationFrameId = requestAnimationFrame(inertia) // Keep the animation going
  }

  animationFrameId = requestAnimationFrame(inertia) // Start the animation
}
onMounted(() => {
  loadImages()
  // Clone images to achieve infinite effect
  images.value = [...images.value, ...images.value, ...images.value]

  if (container.value) {
    container.value.addEventListener('mousedown', onMouseDown)
    container.value.addEventListener('mousemove', onMouseMove)
    container.value.addEventListener('mouseup', onMouseUp)
    container.value.addEventListener('mouseleave', onMouseUp)
  }
})

onBeforeUnmount(() => {
  if (container.value) {
    container.value.removeEventListener('mousedown', onMouseDown)
    container.value.removeEventListener('mousemove', onMouseMove)
    container.value.removeEventListener('mouseup', onMouseUp)
    container.value.removeEventListener('mouseleave', onMouseUp)
  }
  if (animationFrameId) cancelAnimationFrame(animationFrameId) // Clean up any ongoing animation
})
</script>

<template>
  <div
    class="carousel-container overflow-x-scroll relative flex items-center cursor-grab hide-scrollbar"
    ref="container"
  >
    <div class="carousel flex gap-4 transition-transform ease-in-out duration-500">
      <div
        v-for="(image, index) in images"
        :key="index"
        class="carousel-item flex-shrink-0 flex items-center justify-center"
        :style="{ width: `${props.itemWidth}px`, height: `${props.itemHeight}px` }"
      >
        <img
          :src="image"
          :alt="`Image ${index + 1}`"
          class="w-full h-full rounded-lg object-cover"
          @mousedown.prevent
          draggable="false"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom class to hide the scrollbar */
.hide-scrollbar::-webkit-scrollbar {
  display: none; /* Hides scrollbar in Chrome, Safari, and Edge */
}
.hide-scrollbar {
  -ms-overflow-style: none; /* Hides scrollbar in IE and Edge */
  scrollbar-width: none; /* Hides scrollbar in Firefox */
}
</style>
