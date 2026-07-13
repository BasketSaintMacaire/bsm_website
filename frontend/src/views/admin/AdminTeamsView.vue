<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from '@/lib/api'

interface Player {
  id?: number
  name: string
  position: string
  number: number
}

interface Team {
  id: number
  name: string
  image: string
  season: string
  category: 'men' | 'women' | 'pleasure'
  players: Player[]
}

const items = ref<Team[]>([])
const loading = ref(true)
const showModal = ref(false)
const editingId = ref<number | null>(null)
const saving = ref(false)
const importStatus = ref('')

function emptyPlayer(): Player {
  return { name: '', position: '', number: 0 }
}

function emptyForm() {
  return {
    name: '',
    image: '',
    season: '',
    category: 'men' as Team['category'],
    players: [emptyPlayer()] as Player[],
  }
}

const form = ref(emptyForm())

async function load() {
  loading.value = true
  try {
    items.value = await api.get<Team[]>('/teams')
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

function openEdit(item: Team) {
  form.value = {
    name: item.name,
    image: item.image,
    season: item.season,
    category: item.category,
    players: item.players.map((p) => ({ name: p.name, position: p.position, number: p.number })),
  }
  editingId.value = item.id
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

function addPlayer() {
  form.value.players.push(emptyPlayer())
}

function removePlayer(i: number) {
  form.value.players.splice(i, 1)
}

async function save() {
  saving.value = true
  try {
    const payload = {
      name: form.value.name,
      image: form.value.image,
      season: form.value.season,
      category: form.value.category,
      players: form.value.players.map((p) => ({
        name: p.name,
        position: p.position,
        number: Number(p.number),
      })),
    }
    if (editingId.value !== null) {
      await api.put(`/teams/${editingId.value}`, payload)
    } else {
      await api.post('/teams', payload)
    }
    closeModal()
    await load()
  } finally {
    saving.value = false
  }
}

async function remove(id: number) {
  if (!confirm('Supprimer cette équipe ?')) return
  await api.delete(`/teams/${id}`)
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
      const rows: Team[] = Array.isArray(data) ? data : [data]
      importStatus.value = `Import de ${rows.length} équipe(s)…`
      let ok = 0
      for (const row of rows) {
        try {
          await api.post('/teams', {
            name: row.name,
            image: row.image,
            season: row.season,
            category: row.category,
            players: (row.players ?? []).map((p: Player) => ({
              name: p.name,
              position: p.position,
              number: Number(p.number),
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
        name: 'Séniors Masculins 1',
        image: 'seniors_m1.jpg',
        season: '2025-2026',
        category: 'men',
        players: [
          { name: 'Jean Dupont', position: 'Meneur', number: 5 },
          { name: 'Marie Martin', position: 'Ailier', number: 11 },
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
  a.download = 'teams_template.json'
  a.click()
  URL.revokeObjectURL(url)
}

const categoryLabel: Record<Team['category'], string> = {
  men: 'Masculin',
  women: 'Féminin',
  pleasure: 'Loisir',
}
</script>

<template>
  <div class="p-8">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Équipes</h1>
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
            <th class="px-4 py-3 text-left">Saison</th>
            <th class="px-4 py-3 text-left">Catégorie</th>
            <th class="px-4 py-3 text-left">Joueurs</th>
            <th class="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="item in items" :key="item.id" class="hover:bg-gray-50">
            <td class="px-4 py-3 text-gray-400">{{ item.id }}</td>
            <td class="px-4 py-3 font-medium text-gray-800">{{ item.name }}</td>
            <td class="px-4 py-3 text-gray-600">{{ item.season }}</td>
            <td class="px-4 py-3 text-gray-600">{{ categoryLabel[item.category] }}</td>
            <td class="px-4 py-3 text-gray-500">{{ item.players.length }}</td>
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
            {{ editingId !== null ? 'Modifier l\'équipe' : 'Nouvelle équipe' }}
          </h2>
          <form @submit.prevent="save" class="space-y-4">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Nom</label>
                <input v-model="form.name" required class="w-full border rounded px-3 py-1.5 text-sm" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Saison</label>
                <input v-model="form.season" required class="w-full border rounded px-3 py-1.5 text-sm" placeholder="2025-2026" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Image (chemin)</label>
                <input v-model="form.image" required class="w-full border rounded px-3 py-1.5 text-sm" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Catégorie</label>
                <select v-model="form.category" class="w-full border rounded px-3 py-1.5 text-sm">
                  <option value="men">Masculin</option>
                  <option value="women">Féminin</option>
                  <option value="pleasure">Loisir</option>
                </select>
              </div>
            </div>

            <!-- Players -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <label class="text-xs font-medium text-gray-600">Joueurs ({{ form.players.length }})</label>
                <button type="button" @click="addPlayer" class="text-xs text-purple-600 hover:underline">+ Ajouter</button>
              </div>
              <div class="max-h-48 overflow-y-auto space-y-2 pr-1">
                <div v-for="(p, i) in form.players" :key="i" class="flex gap-2 items-center">
                  <input v-model="p.name" placeholder="Nom" required class="flex-1 border rounded px-2 py-1 text-xs" />
                  <input v-model="p.position" placeholder="Poste" class="w-28 border rounded px-2 py-1 text-xs" />
                  <input v-model.number="p.number" type="number" placeholder="N°" class="w-16 border rounded px-2 py-1 text-xs" />
                  <button type="button" @click="removePlayer(i)" class="text-red-500 hover:text-red-700 text-xs shrink-0">✕</button>
                </div>
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
