// ========================================
// 管理员用户状态
// ========================================
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getToken, setToken, removeToken } from '@/utils/auth'

export const useUserStore = defineStore('user', () => {
  const token = ref(getToken() || '')
  const userInfo = ref(null)

  function setUserInfo(info) {
    userInfo.value = info
  }

  function login(tokenValue, info) {
    token.value = tokenValue
    setToken(tokenValue)
    userInfo.value = info
  }

  function logout() {
    token.value = ''
    userInfo.value = null
    removeToken()
  }

  const isLoggedIn = computed(() => !!token.value)

  return {
    token,
    userInfo,
    isLoggedIn,
    setUserInfo,
    login,
    logout
  }
})
