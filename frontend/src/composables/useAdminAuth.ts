import { ref, computed } from 'vue'
import { api } from '@/lib/api'

const token = ref<string | null>(localStorage.getItem('bsm_admin_token'))

export function useAdminAuth() {
  const isAuthenticated = computed(() => !!token.value)

  async function login(username: string, password: string) {
    const data = await api.post<{ token: string }>('/auth/login', { username, password })
    token.value = data.token
    localStorage.setItem('bsm_admin_token', data.token)
  }

  function logout() {
    token.value = null
    localStorage.removeItem('bsm_admin_token')
  }

  return { isAuthenticated, login, logout }
}
