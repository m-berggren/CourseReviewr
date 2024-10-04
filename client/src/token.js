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
    return this.decodedToken ? this.decodedToken.id : null
  }

  getUsername() {
    return this.decodedToken ? this.decodedToken.username : null
  }

  getRole() {
    return this.decodedToken ? this.decodedToken.role : null
  }

  getToken() {
    return this.token
  }

  getOrThrow() {
    if (!this.token) {
      throw new Error('User is not logged in')
    }
    return this.token
  }

  isSignedIn() {
    return !!this.token
  }
}

export const token = new TokenHelper()
