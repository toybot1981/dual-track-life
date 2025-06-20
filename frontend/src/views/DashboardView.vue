<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
    <!-- Header -->
    <header class="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-sm">DT</span>
            </div>
            <h1 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Dual Track Life
            </h1>
          </div>
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <span class="text-white text-sm font-bold">{{ user?.username?.charAt(0).toUpperCase() }}</span>
              </div>
              <span class="text-gray-700 font-medium">{{ user?.username }}</span>
            </div>
            <div class="relative">
              <button
                @click="showLanguageMenu = !showLanguageMenu"
                class="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors px-3 py-2 rounded-lg border border-gray-200"
              >
                <span class="text-lg">{{ currentLocale === 'zh' ? '🇨🇳' : '🇺🇸' }}</span>
                <span class="font-medium">{{ $t('language.' + (currentLocale === 'zh' ? 'chinese' : 'english')) }}</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              <div v-if="showLanguageMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                <button
                  @click="switchLanguage('en')"
                  class="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3"
                  :class="{ 'bg-blue-50 text-blue-600': currentLocale === 'en' }"
                >
                  <span>🇺🇸</span>
                  <span>English</span>
                </button>
                <button
                  @click="switchLanguage('zh')"
                  class="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3"
                  :class="{ 'bg-blue-50 text-blue-600': currentLocale === 'zh' }"
                >
                  <span>🇨🇳</span>
                  <span>中文</span>
                </button>
              </div>
            </div>
            <button
              v-if="user?.username !== 'demo_user'"
              @click="logout"
              class="text-gray-600 hover:text-red-600 font-medium transition-colors"
            >
              {{ $t('nav.logout') }}
            </button>
            <div v-else class="flex items-center space-x-2">
              <span class="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 text-xs font-medium rounded-full">
                🎭 {{ $t('dashboard.demoMode') }}
              </span>
              <button
                @click="logout"
                class="text-gray-600 hover:text-red-600 font-medium transition-colors"
              >
                {{ $t('dashboard.resetDemo') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Welcome Section -->
      <div class="mb-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-2">
          {{ $t('dashboard.welcome') }}, {{ user?.username }}! 👋
        </h2>
        <p v-if="user?.username === 'demo_user'" class="text-gray-600">
          🎭 {{ $t('dashboard.demoDescription') }}
        </p>
        <p v-else class="text-gray-600">
          {{ $t('dashboard.demoMode') }}
        </p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Calendar class="w-6 h-6 text-white" />
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900">{{ events.length }}</p>
              <p class="text-sm text-gray-600">{{ $t('dashboard.stats.totalEvents') }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <TrendingUp class="w-6 h-6 text-white" />
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900">{{ thisMonthEvents }}</p>
              <p class="text-sm text-gray-600">{{ $t('dashboard.stats.thisMonth') }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Zap class="w-6 h-6 text-white" />
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900">{{ virtualLifeStore.currentLevel }}</p>
              <p class="text-sm text-gray-600">{{ $t('dashboard.stats.virtualLevel') }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <Brain class="w-6 h-6 text-white" />
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900">{{ aiInsights }}</p>
              <p class="text-sm text-gray-600">{{ $t('dashboard.stats.aiInsights') }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-wrap gap-4 mb-8">
        <button
          @click="showEventModal = true"
          class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg flex items-center space-x-2"
        >
          <Plus class="w-5 h-5" />
          <span>{{ $t('dashboard.quickActions.addEvent') }}</span>
        </button>
        
        <button
          @click="showSimulationModal = true"
          class="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg flex items-center space-x-2"
        >
          <Zap class="w-5 h-5" />
          <span>{{ $t('dashboard.quickActions.virtualSimulation') }}</span>
        </button>
        
        <button
          @click="openParallelUniverseGrid"
          class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg flex items-center space-x-2"
        >
          <Layers class="w-5 h-5" />
          <span>{{ $t('dashboard.quickActions.parallelUniverses') }}</span>
        </button>
        
        <button
          @click="openMemoryRecorder"
          class="bg-gradient-to-r from-pink-600 to-rose-600 text-white px-6 py-3 rounded-xl hover:from-pink-700 hover:to-rose-700 transition-all duration-200 shadow-lg flex items-center space-x-2"
        >
          <Camera class="w-5 h-5" />
          <span>{{ $t('dashboard.quickActions.memoryRecorder') }}</span>
        </button>
        
        <button
          @click="showLifeAgentModal = true"
          class="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg flex items-center space-x-2"
        >
          <Brain class="w-5 h-5" />
          <span>{{ $t('dashboard.quickActions.lifeAgent') }}</span>
        </button>
        
        <button
          v-if="user?.username === 'demo_user'"
          @click="resetDemoData"
          class="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-lg flex items-center space-x-2"
        >
          <RotateCcw class="w-5 h-5" />
          <span>{{ $t('dashboard.resetDemo') }}</span>
        </button>
      </div>

      <!-- Search and Filter -->
      <div class="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 mb-8">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1">
            <div class="relative">
              <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                v-model="searchQuery"
                type="text"
                :placeholder="$t('dashboard.timeline.searchPlaceholder')"
                class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all"
              />
            </div>
          </div>
          <div class="md:w-48">
            <select
              v-model="selectedCategory"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all"
            >
              <option value="">{{ $t('dashboard.timeline.filterAll') }}</option>
              <option value="Work">{{ $t('events.categories.work') }}</option>
              <option value="Personal">{{ $t('events.categories.personal') }}</option>
              <option value="Health">{{ $t('events.categories.health') }}</option>
              <option value="Learning">{{ $t('events.categories.learning') }}</option>
              <option value="Relationships">{{ $t('events.categories.relationships') }}</option>
              <option value="Entertainment">{{ $t('events.categories.entertainment') }}</option>
              <option value="Travel">{{ $t('events.categories.travel') }}</option>
              <option value="Finance">{{ $t('events.categories.finance') }}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Events Timeline -->
        <div class="lg:col-span-2">
          <div class="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
            <div class="p-6 border-b border-gray-200/50">
              <div class="flex items-center justify-between">
                <h2 class="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">
                  {{ $t('dashboard.timeline.title') }}
                </h2>
                <div class="flex items-center space-x-2 text-sm text-gray-500">
                  <Clock class="w-4 h-4" />
                  <span>{{ filteredEvents.length }} {{ $t('dashboard.timeline.noEvents') }}</span>
                </div>
              </div>
            </div>
            
            <div v-if="isLoading" class="p-12 text-center">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p class="mt-4 text-gray-600 font-medium">{{ $t('dashboard.timeline.loading') }}</p>
            </div>
            
            <div v-else-if="error" class="p-12 text-center">
              <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle class="w-8 h-8 text-red-600" />
              </div>
              <p class="text-red-600 font-medium mb-4">{{ error }}</p>
              <button
                @click="refreshEvents"
                class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try again
              </button>
            </div>
            
            <div v-else-if="filteredEvents.length === 0" class="p-12 text-center">
              <div class="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar class="w-10 h-10 text-blue-600" />
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ $t('dashboard.timeline.addFirstEvent') }}</h3>
              <p class="text-gray-600 mb-6">{{ $t('dashboard.timeline.noEvents') }}</p>
              <button
                @click="showEventModal = true"
                class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
              >
                {{ $t('dashboard.timeline.addFirstEvent') }}
              </button>
            </div>
            
            <div v-else class="divide-y divide-gray-200/50">
              <div
                v-for="(event, index) in filteredEvents"
                :key="event.id"
                class="p-6 hover:bg-white/50 transition-all duration-200 group"
              >
                <div class="flex items-start space-x-4">
                  <!-- Timeline dot -->
                  <div class="flex flex-col items-center">
                    <div class="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg"></div>
                    <div v-if="index < filteredEvents.length - 1" class="w-0.5 h-16 bg-gradient-to-b from-blue-200 to-purple-200 mt-2"></div>
                  </div>
                  
                  <!-- Event content -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between">
                      <div class="flex-1">
                        <div class="flex items-center space-x-3 mb-3">
                          <h3 class="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {{ event.title }}
                          </h3>
                          <span class="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-xs font-medium rounded-full">
                            {{ getCategoryIcon(event.category) }} {{ $t('events.categories.' + event.category.toLowerCase()) }}
                          </span>
                          <span v-if="event.emotion" class="text-xl" :title="event.emotion">
                            {{ getEmotionEmoji(event.emotion) }}
                          </span>
                        </div>
                        
                        <p v-if="event.description" class="text-gray-600 mb-3 leading-relaxed">
                          {{ event.description }}
                        </p>
                        
                        <div class="flex items-center space-x-6 text-sm text-gray-500">
                          <span class="flex items-center space-x-2">
                            <Calendar class="w-4 h-4" />
                            <span class="font-medium">{{ formatDate(event.eventDate) }}</span>
                          </span>
                          
                          <span v-if="event.location" class="flex items-center space-x-2">
                            <MapPin class="w-4 h-4" />
                            <span>{{ event.location }}</span>
                          </span>
                          
                          <span class="flex items-center space-x-2">
                            <Star class="w-4 h-4" :class="(event.importance || 0) >= 8 ? 'text-yellow-500' : ''" />
                            <span>{{ event.importance }}/10</span>
                          </span>
                        </div>
                      </div>
                      
                      <div class="flex items-center space-x-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          v-if="event.importance && event.importance >= 7"
                          @click="triggerParallelUniverse(event)"
                          class="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                          title="Enter Parallel Universe"
                        >
                          <Zap class="w-4 h-4" />
                        </button>
                        <button
                          @click="editEvent(event)"
                          class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Edit event"
                        >
                          <Edit class="w-4 h-4" />
                        </button>
                        <button
                          @click="deleteEvent(event.id!)"
                          class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete event"
                        >
                          <Trash2 class="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- AI Sidebar -->
        <div class="lg:col-span-1">
          <AILifeCoach 
            :events="events" 
            :virtual-stats="virtualLifeStore.currentStats"
            @open-simulation="showSimulationModal = true"
          />
        </div>
      </div>
    </main>

    <!-- Event Modal -->
    <EventModal
      :show="showEventModal"
      :event="editingEvent"
      @close="closeEventModal"
      @save="handleEventSaved"
    />

    <!-- Simulation Modal -->
    <SimulationModal
      :show="showSimulationModal"
      @close="showSimulationModal = false"
    />

    <!-- Parallel Universe Modal -->
    <ParallelUniverseModal
      :is-visible="showParallelUniverseModal"
      :real-life-event="triggeringEvent"
      @close="closeParallelUniverseModal"
      @universe-started="handleUniverseStarted"
    />

    <!-- Life Agent Modal -->
    <div v-if="showLifeAgentModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] m-4 overflow-hidden">
        <div class="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 class="text-2xl font-bold text-gray-900">{{ $t('lifeAgent.title') }}</h2>
          <button @click="showLifeAgentModal = false" class="text-gray-500 hover:text-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div class="h-full">
          <LifeAgentChat />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useEventStore, type Event } from '@/stores/events'
import { useVirtualLifeStore } from '@/stores/virtualLife'
import { useParallelUniverseStore } from '@/stores/parallelUniverse'
import EventModal from '@/components/EventModal.vue'
import SimulationModal from '@/components/SimulationModal.vue'
import ParallelUniverseModal from '@/components/ParallelUniverseModal.vue'
import AILifeCoach from '@/components/AILifeCoach.vue'
import LifeAgentChat from '@/components/LifeAgentChat.vue'
import {
  Calendar,
  Plus,
  Zap,
  Search,
  Edit,
  Trash2,
  MapPin,
  Star,
  TrendingUp,
  Brain,
  Clock,
  AlertCircle,
  RotateCcw,
  Layers,
  Camera
} from 'lucide-vue-next'
import { getCurrentLocale, setLocale } from '../locales'

const router = useRouter()
const authStore = useAuthStore()
const eventStore = useEventStore()
const virtualLifeStore = useVirtualLifeStore()
const parallelUniverseStore = useParallelUniverseStore()

const showEventModal = ref(false)
const showSimulationModal = ref(false)
const showParallelUniverseModal = ref(false)
const showLifeAgentModal = ref(false)
const editingEvent = ref<Event | null>(null)
const triggeringEvent = ref<Event | null>(null)
const searchQuery = ref('')
const selectedCategory = ref('')
const showLanguageMenu = ref(false)
const currentLocale = ref(getCurrentLocale())

// Computed properties
const user = computed(() => authStore.user)
const events = computed(() => eventStore.events)
const isLoading = computed(() => eventStore.isLoading)
const error = computed(() => eventStore.error)

const thisMonthEvents = computed(() => {
  const now = new Date()
  const thisMonth = now.getMonth()
  const thisYear = now.getFullYear()
  
  return events.value.filter(event => {
    const eventDate = new Date(event.eventDate)
    return eventDate.getMonth() === thisMonth && eventDate.getFullYear() === thisYear
  }).length
})

const aiInsights = computed(() => {
  return Math.floor(events.value.length / 5) + 3
})

const filteredEvents = computed(() => {
  let filtered = events.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(event =>
      event.title.toLowerCase().includes(query) ||
      event.description?.toLowerCase().includes(query) ||
      event.category.toLowerCase().includes(query)
    )
  }

  if (selectedCategory.value) {
    filtered = filtered.filter(event => event.category === selectedCategory.value)
  }

  return filtered.sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime())
})

// Methods
const logout = async () => {
  await authStore.logout()
  router.push('/login')
}

const refreshEvents = async () => {
  await eventStore.fetchEvents()
}

const editEvent = (event: Event) => {
  editingEvent.value = event
  showEventModal.value = true
}

const deleteEvent = async (eventId: number) => {
  if (confirm('Are you sure you want to delete this event?')) {
    await eventStore.deleteEvent(eventId)
  }
}

const closeEventModal = () => {
  showEventModal.value = false
  editingEvent.value = null
}

const handleEventSaved = () => {
  closeEventModal()
  refreshEvents()
}

const resetDemoData = async () => {
  if (confirm('Are you sure you want to reset all demo data? This will restore the original demo events and virtual life statistics.')) {
    // 重置虚拟人生数据
    virtualLifeStore.resetToDemoData()
    
    // 重置平行宇宙数据
    parallelUniverseStore.resetParallelUniverseData()
    
    // 重置事件数据到demo状态
    await eventStore.resetToDemoData()
    
    // 刷新页面数据
    await refreshEvents()
    
    alert('Demo data has been reset successfully!')
  }
}

// Parallel Universe methods
const openParallelUniverseGrid = () => {
  router.push('/timeline')
}

// Memory Recorder methods
const openMemoryRecorder = () => {
  const locale = getCurrentLocale()
  router.push(locale === 'zh' ? '/cn/memories' : '/memories')
}

const triggerParallelUniverse = (event: Event) => {
  triggeringEvent.value = event
  showParallelUniverseModal.value = true
}

const closeParallelUniverseModal = () => {
  showParallelUniverseModal.value = false
  triggeringEvent.value = null
}

const handleUniverseStarted = (universe: any) => {
  console.log('New parallel universe started:', universe)
  // Navigate to timeline view to show the new parallel universe
  router.push('/timeline')
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getCategoryIcon = (category: string) => {
  const icons: Record<string, string> = {
    Work: '💼',
    Personal: '👤',
    Health: '🏥',
    Learning: '📚',
    Relationships: '❤️',
    Entertainment: '🎬',
    Travel: '✈️',
    Finance: '💰'
  }
  return icons[category] || '📝'
}

const getEmotionEmoji = (emotion: string) => {
  const emojis: Record<string, string> = {
    happy: '😊',
    excited: '🎉',
    neutral: '😐',
    stressed: '😰',
    sad: '😢',
    angry: '😠',
    surprised: '😲',
    grateful: '🙏'
  }
  return emojis[emotion] || '😐'
}

const switchLanguage = (locale: 'en' | 'zh') => {
  setLocale(locale)
  currentLocale.value = locale
  showLanguageMenu.value = false
  // 跳转到对应 dashboard
  const currentPath = router.currentRoute.value.path
  if (locale === 'zh') {
    if (!currentPath.startsWith('/cn')) {
      router.push('/cn/dashboard')
    }
  } else {
    if (currentPath.startsWith('/cn')) {
      router.push('/dashboard')
    }
  }
}

// Lifecycle
onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  
  await refreshEvents()
})
</script>

