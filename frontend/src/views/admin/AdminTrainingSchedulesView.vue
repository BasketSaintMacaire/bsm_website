<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from '@/lib/api'

interface TrainingSession {
  id?: number
  time: string
  groups: string[]
  location: string
  trainer: string
  notes: string | null
}

interface DaySchedule {
  id?: number
  date: string
  sessions: TrainingSession[]
}

interface WeekSchedule {
  id: number
  name: string
  period: string | null
  days: DaySchedule[]
}

const items = ref<WeekSchedule[]>([])
const loading = ref(true)
const showModal = ref(false)
const editingId = ref<number | null>(null)
const saving = ref(false)
const importStatus = ref('')

function emptySession(): TrainingSession {
  return { time: '', groups: [], location: '', trainer: '', notes: null }
}

function emptyDay(): DaySchedule {
  return { date: '', sessions: [emptySession()] }
}

function emptyForm() {
  return {
    name: '',
    period: '',
    days: [emptyDay()] as DaySchedule[],
  }
}

const form = ref(emptyForm())

// Editable groups as strings per session (one per line)
const sessionGroupsText = ref<string[][]>([['']])

function syncGroupsText() {
  sessionGroupsText.value = form.value.days.map((day) =>
    day.sessions.map((s) => (Array.isArray(s.groups) ? s.groups.join('\n') : '')),
  )
}

async function load() {
  loading.value = true
  try {
    items.value = await api.get<WeekSchedule[]>('/training-schedules')
  } finally {
    loading.value = false
  }
}

onMounted(load)

function openCreate() {
  form.value = emptyForm()
  syncGroupsText()
  editingId.value = null
  showModal.value = true
}

function openEdit(item: WeekSchedule) {
  form.value = {
    name: item.name,
    period: item.period ?? '',
    days: item.days.map((d) => ({
      date: d.date,
      sessions: d.sessions.map((s) => ({
        time: s.time,
        groups: [...s.groups],
        location: s.location,
        trainer: s.trainer,
        notes: s.notes,
      })),
    })),
  }
  syncGroupsText()
  editingId.value = item.id
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

function addDay() {
  form.value.days.push(emptyDay())
  sessionGroupsText.value.push([''])
}

function removeDay(di: number) {
  form.value.days.splice(di, 1)
  sessionGroupsText.value.splice(di, 1)
}

function addSession(di: number) {
  form.value.days[di].sessions.push(emptySession())
  sessionGroupsText.value[di].push('')
}

function removeSession(di: number, si: number) {
  form.value.days[di].sessions.splice(si, 1)
  sessionGroupsText.value[di].splice(si, 1)
}

async function save() {
  saving.value = true
  try {
    const payload = {
      name: form.value.name,
      period: form.value.period || null,
      days: form.value.days.map((day, di) => ({
        date: day.date,
        sessions: day.sessions.map((s, si) => ({
          time: s.time,
          groups: (sessionGroupsText.value[di]?.[si] ?? '').split('\n').map((g) => g.trim()).filter(Boolean),
          location: s.location,
          trainer: s.trainer,
          notes: s.notes || null,
        })),
      })),
    }
    if (editingId.value !== null) {
      await api.put(`/training-schedules/${editingId.value}`, payload)
    } else {
      await api.post('/training-schedules', payload)
    }
    closeModal()
    await load()
  } finally {
    saving.value = false
  }
}

async function remove(id: number) {
  if (!confirm('Supprimer ce planning ?')) return
  await api.delete(`/training-schedules/${id}`)
  await load()
}

function triggerImport() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  input.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return
    try {
      const data = JSON.parse(await file.text())
      const rows: WeekSchedule[] = Array.isArray(data) ? data : [data]
      importStatus.value = `Import de ${rows.length} planning(s)…`
      let ok = 0
      for (const row of rows) {
        try {
          await api.post('/training-schedules', {
            name: row.name,
            period: row.period ?? null,
            days: (row.days ?? []).map((d: DaySchedule) => ({
              date: d.date,
              sessions: (d.sessions ?? []).map((s: TrainingSession) => ({
                time: s.time,
                groups: s.groups ?? [],
                location: s.location,
                trainer: s.trainer,
                notes: s.notes ?? null,
              })),
            })),
          })
          ok++
        } catch { /* skip */ }
      }
      importStatus.value = `${ok}/${rows.length} importé(s)`
      await load()
    } catch {
      importStatus.value = 'Erreur: JSON invalide'
    }
  }
  input.click()
}

function downloadTemplate() {
  const template = JSON.stringify(
    [
      {
        name: 'Semaine type',
        period: 'Octobre - Novembre',
        days: [
          {
            date: 'Lundi',
            sessions: [
              {
                time: '18:00 - 20:00',
                groups: ['Minimes', 'Cadets'],
                location: 'Salle Georges Raymond',
                trainer: 'Coach Martin',
                notes: null,
              },
            ],
          },
        ],
      },
    ],
    null,
    2,
  )
  const blob = new Blob([template], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'training_schedules_template.json'
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="p-8">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Planning entraînement</h1>
      <div class="flex gap-2">
        <button @click="downloadTemplate" class="text-sm px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600">Modèle JSON</button>
        <button @click="triggerImport" class="text-sm px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600">Import JSON</button>
        <button @click="openCreate" class="text-sm px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg">+ Ajouter</button>
      </div>
    </div>

    <p v-if="importStatus" class="text-sm text-blue-600 mb-3">{{ importStatus }}</p>

    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <table v-if="!loading" class="w-full text-sm">
        <thead class="bg-gray-50 text-gray-500 uppercase text-xs">
          <tr>
            <th class="px-4 py-3 text-left">ID</th>
            <th class="px-4 py-3 text-left">Nom</th>
            <th class="px-4 py-3 text-left">Période</th>
            <th class="px-4 py-3 text-left">Jours</th>
            <th class="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="item in items" :key="item.id" class="hover:bg-gray-50">
            <td class="px-4 py-3 text-gray-400">{{ item.id }}</td>
            <td class="px-4 py-3 font-medium text-gray-800">{{ item.name }}</td>
            <td class="px-4 py-3 text-gray-600">{{ item.period ?? '—' }}</td>
            <td class="px-4 py-3 text-gray-500">{{ item.days.length }}</td>
            <td class="px-4 py-3 text-right space-x-2">
              <button @click="openEdit(item)" class="text-blue-600 hover:underline text-xs font-medium">Modifier</button>
              <button @click="remove(item.id)" class="text-red-600 hover:underline text-xs font-medium">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else class="p-4 text-gray-500">Chargement…</p>
    </div>

    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click.self="closeModal">
        <div class="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">
            {{ editingId !== null ? 'Modifier le planning' : 'Nouveau planning' }}
          </h2>
          <form @submit.prevent="save" class="space-y-4">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Nom</label>
                <input v-model="form.name" required class="w-full border rounded px-3 py-1.5 text-sm" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Période (optionnel)</label>
                <input v-model="form.period" class="w-full border rounded px-3 py-1.5 text-sm" placeholder="Oct - Nov" />
              </div>
            </div>

            <!-- Days -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <label class="text-xs font-medium text-gray-600">Jours</label>
                <button type="button" @click="addDay" class="text-xs text-purple-600 hover:underline">+ Ajouter un jour</button>
              </div>

              <div v-for="(day, di) in form.days" :key="di" class="border rounded-lg p-3 mb-3">
                <div class="flex items-center gap-2 mb-3">
                  <input v-model="day.date" placeholder="Lundi" required class="flex-1 border rounded px-2 py-1 text-xs font-medium" />
                  <button type="button" @click="removeDay(di)" class="text-red-500 text-xs hover:text-red-700">Supprimer le jour</button>
                </div>

                <!-- Sessions -->
                <div v-for="(session, si) in day.sessions" :key="si" class="bg-gray-50 rounded p-2 mb-2">
                  <div class="grid grid-cols-2 gap-2 mb-1">
                    <div>
                      <label class="block text-xs text-gray-500 mb-0.5">Heure</label>
                      <input v-model="session.time" placeholder="18:00 - 20:00" required class="w-full border rounded px-2 py-1 text-xs" />
                    </div>
                    <div>
                      <label class="block text-xs text-gray-500 mb-0.5">Lieu</label>
                      <input v-model="session.location" required class="w-full border rounded px-2 py-1 text-xs" />
                    </div>
                    <div>
                      <label class="block text-xs text-gray-500 mb-0.5">Entraîneur</label>
                      <input v-model="session.trainer" required class="w-full border rounded px-2 py-1 text-xs" />
                    </div>
                    <div>
                      <label class="block text-xs text-gray-500 mb-0.5">Notes</label>
                      <input v-model="session.notes" class="w-full border rounded px-2 py-1 text-xs" />
                    </div>
                  </div>
                  <div>
                    <label class="block text-xs text-gray-500 mb-0.5">Groupes (un par ligne)</label>
                    <textarea
                      v-if="sessionGroupsText[di]"
                      v-model="sessionGroupsText[di][si]"
                      rows="2"
                      class="w-full border rounded px-2 py-1 text-xs font-mono"
                    />
                  </div>
                  <div class="flex justify-end mt-1">
                    <button
                      type="button"
                      @click="removeSession(di, si)"
                      class="text-red-500 text-xs hover:text-red-700"
                      :disabled="day.sessions.length === 1"
                    >Supprimer la séance</button>
                  </div>
                </div>
                <button type="button" @click="addSession(di)" class="text-xs text-purple-600 hover:underline">+ Ajouter une séance</button>
              </div>
            </div>

            <div class="flex justify-end gap-2 pt-2">
              <button type="button" @click="closeModal" class="px-4 py-1.5 text-sm border rounded hover:bg-gray-50">Annuler</button>
              <button type="submit" :disabled="saving" class="px-4 py-1.5 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded disabled:opacity-60">
                {{ saving ? 'Sauvegarde…' : 'Sauvegarder' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>
