// ========================================
// JWT 工具函数
// ========================================

const TOKEN_KEY = 'token'
let _tokenValidated = false

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
  _tokenValidated = false
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY)
  _tokenValidated = false
}

export function isTokenValidated() {
  return _tokenValidated
}

export function setTokenValidated(value) {
  _tokenValidated = value
}

export function isAuthenticated() {
  const token = getToken()
  if (!token) return false

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp * 1000 > Date.now()
  } catch {
    return false
  }
}
