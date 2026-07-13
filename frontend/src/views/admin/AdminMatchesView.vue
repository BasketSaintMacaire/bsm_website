<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from '@/lib/api'
import { parseCSV, downloadCSVTemplate } from '@/lib/parseCSV'

interface Match {
  id: number
  date: string
  team: string
  group: string
  isDomicile: boolean
  time_start: string
  time_meetup: string | null
  opponent: string | null
  location: string | null
  board_official: string[]
  referees: string[]
  bar: string | null
  result: number[]
}

const items = ref<Match[]>([])
const loading = ref(true)
const showModal = ref(false)
const editingId = ref<number | null>(null)
const saving = ref(false)
const importStatus = ref('')

const emptyForm = () => ({
  date: '',
  team: '',
  group: '',
  isDomicile: false,
  time_start: '',
  time_meetup: '',
  opponent: '',
  location: '',
  board_official: '',
  referees: '',
  bar: '',
  result: '',
})
const form = ref(emptyForm())

function toPayload() {
  return {
    date: form.value.date,
    team: form.value.team,
    group: form.value.group,
    isDomicile: form.value.isDomicile,
    time_start: form.value.time_start,
    time_meetup: form.value.time_meetup || null,
    opponent: form.value.opponent || null,
    location: form.value.location || null,
    board_official: form.value.board_official.split('\n').map((s) => s.trim()).filter(Boolean),
    referees: form.value.referees.split('\n').map((s) => s.trim()).filter(Boolean),
    bar: form.value.bar || null,
    result: form.value.result
      ? form.value.result.split(',').map((s) => parseInt(s.trim(), 10)).filter((n) => !isNaN(n))
      : [],
  }
}

async function load() {
  loading.value = true
  try {
    items.value = await api.get<Match[]>('/matches')
  } finally {
    loading.value = false
  }
}

onMounted(load)

function openCreate() {
  form.value = emptyForm()
  editingId.value = null
  showModal.value = true
}

function openEdit(item: Match) {
  form.value = {
    date: item.date.slice(0, 10),
    team: item.team,
    group: item.group,
    isDomicile: item.isDomicile,
    time_start: item.time_start,
    time_meetup: item.time_meetup ?? '',
    opponent: item.opponent ?? '',
    location: item.location ?? '',
    board_official: item.board_official.join('\n'),
    referees: item.referees.join('\n'),
    bar: item.bar ?? '',
    result: item.result.join(','),
  }
  editingId.value = item.id
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

async function save() {
  saving.value = true
  try {
    const payload = toPayload()
    if (editingId.value !== null) {
      await api.put(`/matches/${editingId.value}`, payload)
    } else {
      await api.post('/matches', payload)
    }
    closeModal()
    await load()
  } finally {
    saving.value = false
  }
}

async function remove(id: number) {
  if (!confirm('Supprimer ce match ?')) return
  await api.delete(`/matches/${id}`)
  await load()
}

function triggerImport() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.csv'
  input.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return
    const rows = parseCSV(await file.text())
    importStatus.value = `Import de ${rows.length} ligne(s)…`
    let ok = 0
    for (const row of rows) {
      try {
        await api.post('/matches', {
          date: row.date,
          team: row.team,
          group: row.group,
          isDomicile: row.isDomicile === 'true',
          time_start: row.time_start,
          time_meetup: row.time_meetup || null,
          opponent: row.opponent || null,
          location: row.location || null,
          board_official: (row.board_official ?? '').split(';').map((s) => s.trim()).filter(Boolean),
          referees: (row.referees ?? '').split(';').map((s) => s.trim()).filter(Boolean),
          bar: row.bar || null,
          result: row.result
            ? row.result.split(';').map((s) => parseInt(s.trim(), 10)).filter((n) => !isNaN(n))
            : [],
        })
        ok++
      } catch { /* skip */ }
    }
    importStatus.value = `${ok}/${rows.length} importé(s)`
    await load()
  }
  input.click()
}

function downloadTemplate() {
  downloadCSVTemplate(
    'matches_template.csv',
    ['date', 'team', 'group', 'isDomicile', 'time_start', 'time_meetup', 'opponent', 'location', 'board_official', 'referees', 'bar', 'result'],
    ['2025-09-13', 'Séniors M1', 'A', 'true', '20:30', '19:30', 'Adversaire', 'Salle XYZ', 'Alice;Bob', 'Ref1;Ref2', 'Charlie', '72;65'],
  )
}

function formatDate(d: string) {
  return d.slice(0, 10)
}
</script>

<template>
  <div class="p-8">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Matchs</h1>
      <div class="flex gap-2">
        <button @click="downloadTemplate" class="text-sm px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600">Modèle CSV</button>
        <button @click="triggerImport" class="text-sm px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600">Import CSV</button>
        <button @click="openCreate" class="text-sm px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg">+ Ajouter</button>
      </div>
    </div>

    <p v-if="importStatus" class="text-sm text-blue-600 mb-3">{{ importStatus }}</p>

    <div class="bg-white rounded-lg shadow-sm overflow-x-auto">
      <table v-if="!loading" class="w-full text-sm whitespace-nowrap">
        <thead class="bg-gray-50 text-gray-500 uppercase text-xs">
          <tr>
            <th class="px-4 py-3 text-left">ID</th>
            <th class="px-4 py-3 text-left">Date</th>
            <th class="px-4 py-3 text-left">Équipe</th>
            <th class="px-4 py-3 text-left">Groupe</th>
            <th class="px-4 py-3 text-left">D/E</th>
            <th class="px-4 py-3 text-left">Adversaire</th>
            <th class="px-4 py-3 text-left">Heure</th>
            <th class="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="item in items" :key="item.id" class="hover:bg-gray-50">
            <td class="px-4 py-3 text-gray-400">{{ item.id }}</td>
            <td class="px-4 py-3 text-gray-700">{{ formatDate(item.date) }}</td>
            <td class="px-4 py-3 font-medium text-gray-800">{{ item.team }}</td>
            <td class="px-4 py-3 text-gray-600">{{ item.group }}</td>
            <td class="px-4 py-3">
              <span :class="item.isDomicile ? 'text-green-600' : 'text-orange-500'" class="font-medium">
                {{ item.isDomicile ? 'Dom.' : 'Ext.' }}
              </span>
            </td>
            <td class="px-4 py-3 text-gray-600">{{ item.opponent ?? '—' }}</td>
            <td class="px-4 py-3 text-gray-600">{{ item.time_start }}</td>
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
        <div class="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">
            {{ editingId !== null ? 'Modifier le match' : 'Nouveau match' }}
          </h2>
          <form @submit.prevent="save" class="space-y-3">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Date</label>
                <input v-model="form.date" type="date" required class="w-full border rounded px-3 py-1.5 text-sm" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Équipe</label>
                <input v-model="form.team" required class="w-full border rounded px-3 py-1.5 text-sm" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Groupe</label>
                <input v-model="form.group" required class="w-full border rounded px-3 py-1.5 text-sm" />
              </div>
              <div class="flex items-center gap-2 pt-4">
                <input v-model="form.isDomicile" id="isDomicile" type="checkbox" class="w-4 h-4" />
                <label for="isDomicile" class="text-sm text-gray-700">Domicile</label>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Heure début</label>
                <input v-model="form.time_start" required class="w-full border rounded px-3 py-1.5 text-sm" placeholder="20:30" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Heure rendez-vous</label>
                <input v-model="form.time_meetup" class="w-full border rounded px-3 py-1.5 text-sm" placeholder="19:30" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Adversaire</label>
                <input v-model="form.opponent" class="w-full border rounded px-3 py-1.5 text-sm" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Lieu</label>
                <input v-model="form.location" class="w-full border rounded px-3 py-1.5 text-sm" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Bar</label>
                <input v-model="form.bar" class="w-full border rounded px-3 py-1.5 text-sm" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Résultat (ex: 72,65)</label>
                <input v-model="form.result" class="w-full border rounded px-3 py-1.5 text-sm" placeholder="72,65" />
              </div>
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">Officiels table (un par ligne)</label>
              <textarea v-model="form.board_official" rows="2" class="w-full border rounded px-3 py-1.5 text-sm font-mono" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">Arbitres (un par ligne)</label>
              <textarea v-model="form.referees" rows="2" class="w-full border rounded px-3 py-1.5 text-sm font-mono" />
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
