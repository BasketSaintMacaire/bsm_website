<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from '@/lib/api'
import { parseCSV, downloadCSVTemplate } from '@/lib/parseCSV'

interface NewsArticle {
  id: number
  title: string
  excerpt: string
  content: string
  date: string
  image: string
  category: string
}

const items = ref<NewsArticle[]>([])
const loading = ref(true)
const showModal = ref(false)
const editingId = ref<number | null>(null)
const saving = ref(false)
const importStatus = ref('')

const emptyForm = () => ({ title: '', excerpt: '', content: '', date: '', image: '', category: '' })
const form = ref(emptyForm())

async function load() {
  loading.value = true
  try {
    items.value = await api.get<NewsArticle[]>('/news')
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

function openEdit(item: NewsArticle) {
  form.value = {
    title: item.title,
    excerpt: item.excerpt,
    content: item.content,
    date: item.date.slice(0, 10),
    image: item.image,
    category: item.category,
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
    if (editingId.value !== null) {
      await api.put(`/news/${editingId.value}`, form.value)
    } else {
      await api.post('/news', form.value)
    }
    closeModal()
    await load()
  } finally {
    saving.value = false
  }
}

async function remove(id: number) {
  if (!confirm('Supprimer cet article ?')) return
  await api.delete(`/news/${id}`)
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
        await api.post('/news', {
          title: row.title,
          excerpt: row.excerpt,
          content: row.content,
          date: row.date,
          image: row.image,
          category: row.category,
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
    'news_template.csv',
    ['title', 'excerpt', 'content', 'date', 'image', 'category'],
    ['Titre article', 'Résumé court', 'Contenu complet de l\'article', '2025-10-01', 'image.jpg', 'Actualité'],
  )
}
</script>

<template>
  <div class="p-8">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Actualités</h1>
      <div class="flex gap-2">
        <button @click="downloadTemplate" class="text-sm px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600">Modèle CSV</button>
        <button @click="triggerImport" class="text-sm px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600">Import CSV</button>
        <button @click="openCreate" class="text-sm px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg">+ Ajouter</button>
      </div>
    </div>

    <p v-if="importStatus" class="text-sm text-blue-600 mb-3">{{ importStatus }}</p>

    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <table v-if="!loading" class="w-full text-sm">
        <thead class="bg-gray-50 text-gray-500 uppercase text-xs">
          <tr>
            <th class="px-4 py-3 text-left">ID</th>
            <th class="px-4 py-3 text-left">Titre</th>
            <th class="px-4 py-3 text-left">Catégorie</th>
            <th class="px-4 py-3 text-left">Date</th>
            <th class="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="item in items" :key="item.id" class="hover:bg-gray-50">
            <td class="px-4 py-3 text-gray-400">{{ item.id }}</td>
            <td class="px-4 py-3 font-medium text-gray-800 max-w-xs truncate">{{ item.title }}</td>
            <td class="px-4 py-3 text-gray-600">{{ item.category }}</td>
            <td class="px-4 py-3 text-gray-600">{{ item.date.slice(0, 10) }}</td>
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
            {{ editingId !== null ? 'Modifier l\'article' : 'Nouvel article' }}
          </h2>
          <form @submit.prevent="save" class="space-y-3">
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">Titre</label>
              <input v-model="form.title" required class="w-full border rounded px-3 py-1.5 text-sm" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">Résumé</label>
              <textarea v-model="form.excerpt" rows="2" required class="w-full border rounded px-3 py-1.5 text-sm" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">Contenu</label>
              <textarea v-model="form.content" rows="6" required class="w-full border rounded px-3 py-1.5 text-sm" />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Date</label>
                <input v-model="form.date" type="date" required class="w-full border rounded px-3 py-1.5 text-sm" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Catégorie</label>
                <input v-model="form.category" required class="w-full border rounded px-3 py-1.5 text-sm" />
              </div>
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">Image (chemin/URL)</label>
              <input v-model="form.image" required class="w-full border rounded px-3 py-1.5 text-sm" />
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
