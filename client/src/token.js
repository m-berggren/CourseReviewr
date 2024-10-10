import { jwtDecode } from 'jwt-decode'

class TokenHelper {
  constructor() {
    const token = localStorage.getItem('token')

    if (token) {
      this.token = token
      this.decodedToken = jwtDecode(token)
    } else {
      this.token = null
      this.decodedToken = null
    }
  }

  set(token) {
    localStorage.setItem('token', token)
    this.token = token
    this.decodedToken = jwtDecode(token)
  }

  unset() {
    localStorage.removeItem('token')
    this.token = null
    this.decodedToken = null
  }

  getUserId() {
    this.checkExpiry()
    return this.decodedToken ? this.decodedToken.id : null
  }

  getUsername() {
    this.checkExpiry()
    return this.decodedToken ? this.decodedToken.username : null
  }

  getRole() {
    this.checkExpiry()
    return this.decodedToken ? this.decodedToken.role : null
  }

  getToken() {
    this.checkExpiry()
    return this.token
  }

  getOrThrow() {
    this.checkExpiry()
    if (!this.token) {
      throw new Error('User is not logged in')
    }
    return this.token
  }

  isSignedIn() {
    this.checkExpiry()
    return !!this.token
  }

  checkExpiry() {
    if (!this.decodedToken) return

    const isExpired = this.decodedToken.exp < (Date.now() / 1000)
    if (isExpired) {
      this.unset()
    }
  }
}

export const token = new TokenHelper()
