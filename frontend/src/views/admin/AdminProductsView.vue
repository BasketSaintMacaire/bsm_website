<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from '@/lib/api'

interface Variant {
  id?: number
  size: string | null
  color: string | null
  price: number
}

interface Flocking {
  id?: number
  price: number
  maxSize: number
}

interface Product {
  id: number
  name: string
  category: string
  imageFolder: string
  description: string
  variants: Variant[]
  flocking: Flocking | null
}

const items = ref<Product[]>([])
const loading = ref(true)
const showModal = ref(false)
const editingId = ref<number | null>(null)
const saving = ref(false)
const importStatus = ref('')

function emptyVariant(): Variant {
  return { size: '', color: '', price: 0 }
}

function emptyForm() {
  return {
    name: '',
    category: '',
    imageFolder: '',
    description: '',
    variants: [emptyVariant()] as Variant[],
    hasFlocking: false,
    flocking: { price: 0, maxSize: 0 } as Flocking,
  }
}

const form = ref(emptyForm())

async function load() {
  loading.value = true
  try {
    items.value = await api.get<Product[]>('/products')
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

function openEdit(item: Product) {
  form.value = {
    name: item.name,
    category: item.category,
    imageFolder: item.imageFolder,
    description: item.description,
    variants: item.variants.map((v) => ({ size: v.size ?? '', color: v.color ?? '', price: Number(v.price) })),
    hasFlocking: !!item.flocking,
    flocking: item.flocking
      ? { price: Number(item.flocking.price), maxSize: item.flocking.maxSize }
      : { price: 0, maxSize: 0 },
  }
  editingId.value = item.id
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

function addVariant() {
  form.value.variants.push(emptyVariant())
}

function removeVariant(i: number) {
  form.value.variants.splice(i, 1)
}

async function save() {
  saving.value = true
  try {
    const payload = {
      name: form.value.name,
      category: form.value.category,
      imageFolder: form.value.imageFolder,
      description: form.value.description,
      variants: form.value.variants.map((v) => ({
        size: v.size || null,
        color: v.color || null,
        price: Number(v.price),
      })),
      flocking: form.value.hasFlocking
        ? { price: Number(form.value.flocking.price), maxSize: Number(form.value.flocking.maxSize) }
        : null,
    }
    if (editingId.value !== null) {
      await api.put(`/products/${editingId.value}`, payload)
    } else {
      await api.post('/products', payload)
    }
    closeModal()
    await load()
  } finally {
    saving.value = false
  }
}

async function remove(id: number) {
  if (!confirm('Supprimer ce produit ?')) return
  await api.delete(`/products/${id}`)
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
      const rows: Product[] = Array.isArray(data) ? data : [data]
      importStatus.value = `Import de ${rows.length} produit(s)…`
      let ok = 0
      for (const row of rows) {
        try {
          await api.post('/products', {
            name: row.name,
            category: row.category,
            imageFolder: row.imageFolder,
            description: row.description,
            variants: (row.variants ?? []).map((v: Variant) => ({
              size: v.size ?? null,
              color: v.color ?? null,
              price: Number(v.price),
            })),
            flocking: row.flocking
              ? { price: Number(row.flocking.price), maxSize: Number(row.flocking.maxSize) }
              : null,
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
        name: 'Maillot BSM',
        category: 'Vêtements',
        imageFolder: 'maillot',
        description: 'Maillot officiel du club',
        variants: [
          { size: 'S', color: 'Blanc', price: 29.99 },
          { size: 'M', color: 'Blanc', price: 29.99 },
        ],
        flocking: { price: 5.0, maxSize: 10 },
      },
    ],
    null,
    2,
  )
  const blob = new Blob([template], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'products_template.json'
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="p-8">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Produits</h1>
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
            <th class="px-4 py-3 text-left">Catégorie</th>
            <th class="px-4 py-3 text-left">Variantes</th>
            <th class="px-4 py-3 text-left">Flocage</th>
            <th class="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="item in items" :key="item.id" class="hover:bg-gray-50">
            <td class="px-4 py-3 text-gray-400">{{ item.id }}</td>
            <td class="px-4 py-3 font-medium text-gray-800">{{ item.name }}</td>
            <td class="px-4 py-3 text-gray-600">{{ item.category }}</td>
            <td class="px-4 py-3 text-gray-500">{{ item.variants.length }}</td>
            <td class="px-4 py-3">
              <span :class="item.flocking ? 'text-green-600' : 'text-gray-400'">
                {{ item.flocking ? 'Oui' : 'Non' }}
              </span>
            </td>
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
            {{ editingId !== null ? 'Modifier le produit' : 'Nouveau produit' }}
          </h2>
          <form @submit.prevent="save" class="space-y-4">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Nom</label>
                <input v-model="form.name" required class="w-full border rounded px-3 py-1.5 text-sm" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Catégorie</label>
                <input v-model="form.category" required class="w-full border rounded px-3 py-1.5 text-sm" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Dossier images</label>
                <input v-model="form.imageFolder" required class="w-full border rounded px-3 py-1.5 text-sm" />
              </div>
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">Description</label>
              <textarea v-model="form.description" rows="2" required class="w-full border rounded px-3 py-1.5 text-sm" />
            </div>

            <!-- Variants -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <label class="text-xs font-medium text-gray-600">Variantes</label>
                <button type="button" @click="addVariant" class="text-xs text-purple-600 hover:underline">+ Ajouter</button>
              </div>
              <div v-for="(v, i) in form.variants" :key="i" class="flex gap-2 mb-2 items-center">
                <input v-model="v.size" placeholder="Taille" class="w-1/4 border rounded px-2 py-1 text-xs" />
                <input v-model="v.color" placeholder="Couleur" class="w-1/4 border rounded px-2 py-1 text-xs" />
                <input v-model.number="v.price" type="number" step="0.01" placeholder="Prix" required class="w-1/4 border rounded px-2 py-1 text-xs" />
                <button
                  type="button"
                  @click="removeVariant(i)"
                  class="text-red-500 hover:text-red-700 text-xs"
                  :disabled="form.variants.length === 1"
                >✕</button>
              </div>
            </div>

            <!-- Flocking -->
            <div>
              <div class="flex items-center gap-2 mb-2">
                <input v-model="form.hasFlocking" id="hasFlocking" type="checkbox" class="w-4 h-4" />
                <label for="hasFlocking" class="text-xs font-medium text-gray-600">Flocage disponible</label>
              </div>
              <div v-if="form.hasFlocking" class="flex gap-3">
                <div class="flex-1">
                  <label class="block text-xs text-gray-500 mb-1">Prix flocage</label>
                  <input v-model.number="form.flocking.price" type="number" step="0.01" class="w-full border rounded px-3 py-1.5 text-sm" />
                </div>
                <div class="flex-1">
                  <label class="block text-xs text-gray-500 mb-1">Taille max</label>
                  <input v-model.number="form.flocking.maxSize" type="number" class="w-full border rounded px-3 py-1.5 text-sm" />
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
