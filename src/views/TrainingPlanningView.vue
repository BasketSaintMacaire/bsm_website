<script setup lang="ts">
import type { WeekSchedule } from '@/models/WeekSchedule'
import { ref, computed } from 'vue'
import trainingDataJson from '@/assets/storage_json/training.json'

const weekSchedule = ref<WeekSchedule[]>(trainingDataJson as WeekSchedule[])

const weekKeys = computed(() => weekSchedule.value.map((week) => week.name))
const selectedWeekIndex = ref(0)
const selectedWeek = computed(() => weekSchedule.value[selectedWeekIndex.value]?.days ?? [])
</script>

<template>
  <div
    class="min-h-screen bg-page dark:bg-page-dark text-mainText dark:text-mainText-dark py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-7xl mx-auto">
      <h1
        class="text-4xl font-extrabold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-fuchsia-500"
      >
        Planning d'entraînement
      </h1>

      <!-- Tabs for each week -->
      <div class="flex justify-center mb-8 gap-2 flex-wrap">
        <button
          v-for="(week, i) in weekKeys"
          :key="week"
          @click="selectedWeekIndex = i"
          class="px-4 py-2 rounded-t font-semibold transition-colors duration-150"
          :class="
            selectedWeekIndex === i
              ? 'bg-purple-600 text-white shadow'
              : 'bg-card dark:bg-card-dark text-mainText dark:text-mainText-dark border border-borderColor dark:border-borderColor-dark'
          "
        >
          {{ week }}
        </button>
      </div>

      <!-- Days grid for selected week -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <div
          v-for="day in selectedWeek"
          :key="day.date"
          class="bg-card dark:bg-card-dark rounded-xl shadow-lg overflow-hidden flex flex-col"
        >
          <div
            class="bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white p-3 text-center font-semibold text-lg tracking-wide"
          >
            {{ day.date }}
          </div>
          <div class="p-4 flex-1 flex flex-col gap-4">
            <div
              v-if="day.sessions.length === 0"
              class="text-mutedText dark:text-mutedText-dark text-center italic"
            >
              Pas d'entraînement
            </div>
            <div
              v-for="(session, index) in day.sessions"
              :key="index"
              class="border-b border-borderColor dark:border-borderColor-dark pb-3 last:border-b-0 last:pb-0"
            >
              <div class="flex items-center gap-2 mb-1">
                <span
                  class="inline-block bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200 px-2 py-0.5 rounded text-xs font-semibold"
                >
                  {{ session.time }}
                </span>
              </div>
              <div class="flex flex-wrap gap-1 mb-1">
                <span
                  v-for="group in session.groups"
                  :key="group"
                  class="inline-block bg-fuchsia-100 dark:bg-fuchsia-900 text-fuchsia-700 dark:text-fuchsia-200 px-2 py-0.5 rounded text-xs"
                >
                  {{ group }}
                </span>
              </div>
              <div class="flex items-center gap-2 text-sm text-mutedText dark:text-mutedText-dark">
                <svg
                  class="w-4 h-4 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="10" r="3" />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                  />
                </svg>
                <span>{{ session.location }}</span>
              </div>
              <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                <svg
                  class="w-4 h-4 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span v-if="session.trainer && session.trainer !== '-'">{{ session.trainer }}</span>
                <span v-else class="italic text-xs">Non renseigné</span>
              </div>
              <div
                v-if="session.notes"
                class="flex items-center gap-2 mt-2 text-xs text-yellow-800 dark:text-yellow-200 bg-yellow-100 dark:bg-yellow-900 rounded px-2 py-1"
              >
                <svg
                  class="w-4 h-4 text-yellow-500"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 9v2m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z"
                  />
                </svg>
                <span>{{ session.notes }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
