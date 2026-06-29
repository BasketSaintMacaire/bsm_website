import { ref, onMounted, type Ref } from 'vue'
import { api } from '@/lib/api'

export function useApiList<T>(path: string) {
  const data = ref<T[]>([]) as Ref<T[]>
  const loading = ref(true)
  const error = ref<string | null>(null)

  onMounted(async () => {
    try {
      data.value = await api.get<T[]>(path)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
    } finally {
      loading.value = false
    }
  })

  return { data, loading, error }
}
