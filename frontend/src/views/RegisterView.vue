<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 flex items-center justify-center p-4">
    <div class="max-w-6xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
      <div class="grid md:grid-cols-2 min-h-[600px]">
        <!-- Left Side - Benefits -->
        <div class="bg-gradient-to-br from-blue-50 to-purple-50 p-8 md:p-12 flex flex-col justify-center">
          <div class="mb-6">
            <h1 class="text-2xl font-bold text-gray-800 mb-2">Dual-Track Life</h1>
          </div>
          
          <div class="mb-8">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">
              Benefits of Our<br>
              Application
            </h2>
            
            <!-- Timeline Visualization -->
            <div class="flex justify-center items-center mb-8">
              <div class="flex flex-col items-center space-y-6">
                <!-- Icons Row -->
                <div class="flex items-center justify-between w-full max-w-md space-x-8">
                  <!-- Past -->
                  <div class="flex flex-col items-center">
                    <div class="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                      <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                      </svg>
                    </div>
                    <span class="text-sm font-semibold text-gray-700">PAST</span>
                  </div>
                  
                  <!-- Present -->
                  <div class="flex flex-col items-center">
                    <div class="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
                      <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                      </svg>
                    </div>
                    <span class="text-sm font-semibold text-gray-700">PRESENT</span>
                  </div>
                  
                  <!-- Future -->
                  <div class="flex flex-col items-center">
                    <div class="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                      <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                      </svg>
                    </div>
                    <span class="text-sm font-semibold text-gray-700">FUTURE</span>
                  </div>
                </div>
                
                <!-- Connecting Line -->
                <div class="w-full max-w-md h-1 bg-gradient-to-r from-blue-200 via-blue-600 to-blue-200 rounded-full"></div>
              </div>
            </div>
          </div>
          
          <!-- Features List -->
          <div class="space-y-4">
            <div class="flex items-center space-x-3">
              <div class="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span class="text-gray-700">Track your real life journey</span>
            </div>
            <div class="flex items-center space-x-3">
              <div class="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span class="text-gray-700">Simulate future scenarios</span>
            </div>
            <div class="flex items-center space-x-3">
              <div class="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span class="text-gray-700">Make better decisions</span>
            </div>
            <div class="flex items-center space-x-3">
              <div class="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span class="text-gray-700">AI-powered insights</span>
            </div>
          </div>
        </div>

        <!-- Right Side - Registration Form -->
        <div class="p-8 md:p-12 flex flex-col justify-center">
          <div class="mb-8">
            <h2 class="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
            <p class="text-gray-600">Join us and start tracking your dual life journey</p>
          </div>

          <form @submit.prevent="handleRegister" class="space-y-6">
            <!-- Full Name -->
            <div>
              <input
                v-model="form.fullName"
                type="text"
                placeholder="Full Name"
                class="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
              />
            </div>

            <!-- Username -->
            <div>
              <input
                v-model="form.username"
                type="text"
                required
                placeholder="Username"
                class="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
              />
            </div>

            <!-- Email -->
            <div>
              <input
                v-model="form.email"
                type="email"
                required
                placeholder="Email Address"
                class="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
              />
            </div>

            <!-- Password -->
            <div>
              <input
                v-model="form.password"
                type="password"
                required
                placeholder="Password"
                class="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
              />
            </div>

            <!-- Confirm Password -->
            <div>
              <input
                v-model="form.confirmPassword"
                type="password"
                required
                placeholder="Confirm Password"
                class="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
              />
            </div>

            <!-- Terms and Conditions -->
            <div class="flex items-center">
              <input
                v-model="form.agreeToTerms"
                type="checkbox"
                id="terms"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label for="terms" class="ml-2 text-sm text-gray-600">
                I agree to the
                <a href="#" class="text-blue-600 hover:text-blue-700">Terms of Service</a>
                and
                <a href="#" class="text-blue-600 hover:text-blue-700">Privacy Policy</a>
              </label>
            </div>

            <!-- Error Message -->
            <div v-if="error" class="bg-red-50 border border-red-200 rounded-xl p-4">
              <p class="text-red-700 text-sm">{{ error }}</p>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full bg-blue-600 text-white py-4 px-4 rounded-xl font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span v-if="isLoading">Creating Account...</span>
              <span v-else>Create Account</span>
            </button>

            <!-- Sign In Link -->
            <div class="text-center">
              <p class="text-gray-600">
                Already have an account?
                <router-link to="/login" class="text-blue-600 hover:text-blue-700 font-medium">
                  Sign in
                </router-link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const isLoading = ref(false)
const error = ref('')

const form = reactive({
  fullName: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeToTerms: false
})

const validateForm = () => {
  if (!form.username.trim()) {
    error.value = 'Username is required'
    return false
  }
  
  if (form.username.length < 3) {
    error.value = 'Username must be at least 3 characters long'
    return false
  }
  
  if (!form.email.trim()) {
    error.value = 'Email is required'
    return false
  }
  
  if (form.password.length < 6) {
    error.value = 'Password must be at least 6 characters long'
    return false
  }
  
  if (form.password !== form.confirmPassword) {
    error.value = 'Passwords do not match'
    return false
  }
  
  if (!form.agreeToTerms) {
    error.value = 'Please agree to the terms and conditions'
    return false
  }
  
  return true
}

const handleRegister = async () => {
  error.value = ''
  
  if (!validateForm()) {
    return
  }
  
  isLoading.value = true
  
  try {
    const result = await authStore.register({
      username: form.username,
      email: form.email,
      password: form.password,
      fullName: form.fullName || undefined
    })
    
    if (result.success) {
      router.push('/dashboard')
    } else {
      error.value = 'Registration failed'
    }
  } catch (err: any) {
    error.value = err.message || 'Registration failed'
  } finally {
    isLoading.value = false
  }
}
</script>

