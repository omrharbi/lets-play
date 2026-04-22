export function getToken() {
  return localStorage.getItem('token')
}

export function decodeToken(token) {
  if (!token) return null
  try {
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload))
  } catch {
    return null
  }
}

export function getRole() {
  const token = getToken()
  const decoded = decodeToken(token)
  return decoded?.role || null
}
export function isTokenExpired() {
  const token = getToken()
  const decoded = decodeToken(token)
  return decoded?.exp *1000|| null
}
export function isAdmin() {
  return getRole() === 'ROLE_ADMIN'
}

export function isLoggedIn() {
  const token = getToken()
  if (!token) return false
  const decoded = decodeToken(token)
  if (!decoded) return false
  // check expiration
  return decoded.exp * 1000 > Date.now()
}

export function getUserEmail() {
  const decoded = decodeToken(getToken())
  return decoded?.sub || null
}

export function getUserId() {
  const decoded = decodeToken(getToken())
  return decoded?.userId || null
}