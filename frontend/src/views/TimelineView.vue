<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
    <!-- 主时间轴容器 -->
    <div class="container mx-auto px-4 py-8">
      <!-- 页面标题 -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          {{ $t('timeline.title') }}
        </h1>
        <p class="text-gray-600 text-lg">
          {{ $t('timeline.subtitle') }}
        </p>
      </div>

      <!-- 时间轴视图切换 -->
      <div class="flex justify-center mb-8">
        <div class="bg-white rounded-xl p-2 shadow-lg">
          <button
            v-for="view in timelineViews"
            :key="view.id"
            @click="currentView = view.id"
            :class="[
              'px-6 py-3 rounded-lg font-medium transition-all duration-300',
              currentView === view.id
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            ]"
          >
            <component :is="view.icon" class="w-5 h-5 inline-block mr-2" />
            {{ view.name }}
          </button>
        </div>
      </div>

      <!-- 真实人生时间轴 -->
      <div v-if="currentView === 'real'" class="space-y-8">
        <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-800 flex items-center">
              <Calendar class="w-6 h-6 mr-3 text-blue-500" />
              {{ $t('timeline.realLife') }}
            </h2>
            <button
              @click="showEventModal = true"
              class="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
            >
              <Plus class="w-5 h-5 inline-block mr-2" />
              {{ $t('timeline.addEvent') }}
            </button>
          </div>

          <!-- 真实事件时间轴 -->
          <div class="relative">
            <div class="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 to-purple-200"></div>
            
            <div v-for="(event, index) in realLifeEvents" :key="event.id" class="relative flex items-start mb-8">
              <!-- 时间轴节点 -->
              <div class="relative z-10">
                <div 
                  :class="[
                    'w-16 h-16 rounded-full flex items-center justify-center shadow-lg cursor-pointer transition-all duration-300',
                    (event.importance || 0) >= 8 
                      ? 'bg-gradient-to-r from-red-400 to-pink-400 hover:scale-110' 
                      : (event.importance || 0) >= 6
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-400 hover:scale-105'
                      : 'bg-gradient-to-r from-blue-400 to-indigo-400 hover:scale-105'
                  ]"
                  @click="(event.importance || 0) >= 7 ? triggerParallelUniverse(event) : null"
                >
                  <span class="text-2xl">{{ getCategoryIcon(event.category) }}</span>
                </div>
                
                <!-- 平行宇宙入口提示 -->
                <div 
                  v-if="(event.importance || 0) >= 7"
                  class="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse"
                >
                  <Zap class="w-3 h-3 text-white" />
                </div>
              </div>

              <!-- 事件内容 -->
              <div class="ml-8 flex-1">
                <div class="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 border border-white/30">
                  <div class="flex items-start justify-between mb-4">
                    <div class="flex-1">
                      <h3 class="text-xl font-semibold text-gray-800 mb-2">{{ event.title }}</h3>
                      <p class="text-gray-600 mb-3">{{ event.description }}</p>
                      <div class="flex items-center space-x-4 text-sm text-gray-500">
                        <span class="flex items-center">
                          <Clock class="w-4 h-4 mr-1" />
                          {{ formatDate(event.eventDate) }}
                        </span>
                        <span class="flex items-center">
                          <MapPin class="w-4 h-4 mr-1" />
                          {{ event.location || $t('timeline.noLocation') }}
                        </span>
                        <span class="flex items-center">
                          <Star class="w-4 h-4 mr-1" />
                          {{ event.importance }}/10
                        </span>
                      </div>
                    </div>
                    
                    <!-- 平行宇宙入口按钮 -->
                    <button
                      v-if="(event.importance || 0) >= 7"
                      @click="triggerParallelUniverse(event)"
                      class="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center"
                    >
                      <Zap class="w-4 h-4 mr-2" />
                      {{ $t('timeline.enterParallel') }}
                    </button>
                  </div>

                  <!-- 已触发的平行宇宙 -->
                  <div v-if="getTriggeredUniverses(String(event.id)).length > 0" class="mt-4 pt-4 border-t border-gray-100">
                    <h4 class="text-sm font-medium text-gray-700 mb-2">{{ $t('parallelUniverse.grid.title') }}:</h4>
                    <div class="flex flex-wrap gap-2">
                      <button
                        v-for="universe in getTriggeredUniverses(String(event.id))"
                        :key="universe.id"
                        @click="enterUniverse(universe)"
                        class="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-3 py-1 rounded-full text-sm hover:shadow-md transition-all duration-300"
                      >
                        {{ universe.title }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 空状态 -->
            <div v-if="realLifeEvents.length === 0" class="text-center py-12">
              <Calendar class="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 class="text-xl font-medium text-gray-500 mb-2">{{ $t('timeline.noEvents') }}</h3>
              <p class="text-gray-400 mb-6">{{ $t('timeline.addFirstEvent') }}</p>
              <button
                @click="showEventModal = true"
                class="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
              >
                {{ $t('timeline.addEvent') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 平行宇宙视图 -->
      <div v-else-if="currentView === 'parallel'" class="space-y-8">
        <ParallelUniverseGrid 
          @create-new-universe="showUniverseModal = true"
          @universe-selected="enterUniverse"
          @compare-universe="handleCompareUniverse"
        />
      </div>

      <!-- 对比视图 -->
      <div v-else-if="currentView === 'comparison'" class="space-y-8">
        <LifeComparisonView />
      </div>
    </div>

    <!-- 事件模态框 -->
    <EventModal
      :show="showEventModal"
      :event="selectedEvent"
      @close="closeEventModal"
      @save="handleEventSaved"
    />

    <!-- 平行宇宙创建模态框 -->
    <ParallelUniverseModal
      :is-visible="showUniverseModal"
      :real-life-event="triggerEvent"
      @close="closeUniverseModal"
      @universe-started="handleUniverseCreated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { 
  Calendar, 
  Plus, 
  Clock, 
  MapPin, 
  Star, 
  Zap,
  GitBranch,
  BarChart3
} from 'lucide-vue-next'

import { useEventStore, type Event } from '@/stores/events'
import { useParallelUniverseStore } from '@/stores/parallelUniverse'
import EventModal from '@/components/EventModal.vue'
import ParallelUniverseModal from '@/components/ParallelUniverseModal.vue'
import ParallelUniverseGrid from '@/components/ParallelUniverseGrid.vue'
import LifeComparisonView from '@/components/LifeComparisonView.vue'

const { t } = useI18n()
const router = useRouter()
const eventStore = useEventStore()
const parallelUniverseStore = useParallelUniverseStore()

// 响应式数据
const currentView = ref('real')
const showEventModal = ref(false)
const showUniverseModal = ref(false)
const selectedEvent = ref<Event | null>(null)
const triggerEvent = ref<Event | null>(null)

// 时间轴视图选项
const timelineViews = [
  { id: 'real', name: t('timeline.realLife'), icon: Calendar },
  { id: 'parallel', name: t('timeline.parallelUniverses'), icon: GitBranch },
  { id: 'comparison', name: t('timeline.comparison'), icon: BarChart3 }
]

// 计算属性
const realLifeEvents = computed(() => {
  return eventStore.events.sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime())
})

// 方法
const getCategoryIcon = (category: string) => {
  const iconMap: Record<string, string> = {
    'Work': '💼',
    'Personal': '👤',
    'Health': '🏥',
    'Learning': '📚',
    'Relationships': '❤️',
    'Travel': '✈️',
    'Entertainment': '🎬',
    'Finance': '💰'
  }
  return iconMap[category] || '📝'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const triggerParallelUniverse = (event: Event) => {
  triggerEvent.value = event
  showUniverseModal.value = true
}

const getTriggeredUniverses = (eventId: string) => {
  return parallelUniverseStore.parallelUniverseHistory.filter(u => 
    u.triggeredByEvent && u.triggeredByEvent.id === eventId
  )
}

const enterUniverse = (universe: any) => {
  parallelUniverseStore.currentParallelUniverse = universe
  // Navigate to a detailed universe view or stay on timeline
  currentView.value = 'parallel'
}

const handleCompareUniverse = (universe: any) => {
  parallelUniverseStore.selectedUniverseForComparison = universe
  currentView.value = 'comparison'
}

const closeEventModal = () => {
  showEventModal.value = false
  selectedEvent.value = null
}

const closeUniverseModal = () => {
  showUniverseModal.value = false
  triggerEvent.value = null
}

const handleEventSaved = () => {
  closeEventModal()
  eventStore.fetchEvents()
}

const handleUniverseCreated = (universe: any) => {
  closeUniverseModal()
  // Switch to parallel universe view to show the new universe
  currentView.value = 'parallel'
}

// 生命周期
onMounted(() => {
  eventStore.fetchEvents()
})
</script>

