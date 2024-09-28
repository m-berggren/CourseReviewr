class TokenHelper {
  constructor() {
    this.token = localStorage.getItem('token')
  }

  set(token) {
    localStorage.setItem('token', token)
    this.token = token
  }

  unset() {
    localStorage.removeItem('token')
    this.token = null
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

export const Token = new TokenHelper()
