import { defineStore } from 'pinia'
import { authAPI } from '@/services/api'

export interface User {
  id: number
  username: string
  email: string
  fullName?: string
  createdAt: string
  updatedAt: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: localStorage.getItem('token') || null,
    isLoading: false,
    error: null as string | null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user
  },

  actions: {
    // 用户注册
    async register(userData: {
      username: string
      email: string
      password: string
      fullName?: string
    }) {
      this.isLoading = true
      this.error = null

      try {
        const response = await authAPI.register(userData)
        
        if (response.success) {
          this.token = response.token
          this.user = response.user
          
          // 保存到localStorage
          localStorage.setItem('token', response.token)
          localStorage.setItem('user', JSON.stringify(response.user))
          
          return { success: true }
        } else {
          throw new Error('Registration failed')
        }
      } catch (error: any) {
        this.error = error.message || 'Registration failed'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // 用户登录
    async login(credentials: { username: string; password: string }) {
      this.isLoading = true
      this.error = null

      try {
        const response = await authAPI.login(credentials)
        
        if (response.success) {
          this.token = response.token
          this.user = response.user
          
          // 保存到localStorage
          localStorage.setItem('token', response.token)
          localStorage.setItem('user', JSON.stringify(response.user))
          
          return { success: true }
        } else {
          throw new Error('Login failed')
        }
      } catch (error: any) {
        this.error = error.message || 'Login failed'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // Demo登录
    async demoLogin() {
      this.isLoading = true
      this.error = null

      try {
        const response = await authAPI.demoLogin()
        
        if (response.success) {
          this.token = response.token
          this.user = response.user
          
          // 保存到localStorage
          localStorage.setItem('token', response.token)
          localStorage.setItem('user', JSON.stringify(response.user))
          
          return { success: true }
        } else {
          throw new Error('Demo login failed')
        }
      } catch (error: any) {
        this.error = error.message || 'Demo login failed'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // 获取用户信息
    async fetchProfile() {
      if (!this.token) {
        throw new Error('No authentication token')
      }

      this.isLoading = true
      this.error = null

      try {
        const response = await authAPI.getProfile()
        
        if (response.success) {
          this.user = response.user
          localStorage.setItem('user', JSON.stringify(response.user))
          return { success: true }
        } else {
          throw new Error('Failed to fetch profile')
        }
      } catch (error: any) {
        this.error = error.message || 'Failed to fetch profile'
        // 如果获取用户信息失败，可能是token过期，清除认证状态
        this.logout()
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // Demo登录
    async loginWithDemo() {
      this.isLoading = true
      this.error = null
      
      try {
        const result = await authAPI.login({
          username: 'demo_user',
          password: 'demo123'
        })
        
        if (result.success && result.data) {
          this.user = result.data.user
          this.token = result.data.token
          return { success: true }
        } else {
          this.error = 'Demo login failed'
          return { success: false }
        }
      } catch (error: any) {
        this.error = error.message || 'Demo login failed'
        return { success: false }
      } finally {
        this.isLoading = false
      }
    },

    // 登出
    async logout() {
      this.user = null
      this.token = null
      this.error = null
      
      // 清除localStorage
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },

    // 初始化认证状态
    initializeAuth() {
      const token = localStorage.getItem('token')
      const userStr = localStorage.getItem('user')
      
      if (token && userStr) {
        try {
          this.token = token
          this.user = JSON.parse(userStr)
        } catch (error) {
          // 如果解析失败，清除无效数据
          this.logout()
        }
      }
    },

    // 清除错误
    clearError() {
      this.error = null
    }
  }
})

