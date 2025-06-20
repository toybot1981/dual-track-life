<template>
  <div class="life-comparison-view">
    <!-- Header -->
    <div class="comparison-header mb-8">
      <h2 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-4">
        {{ $t('comparison.title') }}
      </h2>
      <p class="text-gray-600 dark:text-gray-300 text-lg">
        {{ $t('comparison.description') }}
      </p>
    </div>

    <!-- Universe Selection -->
    <div class="universe-selection mb-8">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Real Life Selection -->
        <div class="selection-card bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 class="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
            <Calendar class="w-6 h-6 mr-3 text-blue-500" />
            {{ $t('comparison.realLife') }}
          </h3>
          <div class="real-life-stats">
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div class="stat-item">
                <div class="text-2xl font-bold text-blue-600">{{ realLifeStats.totalEvents }}</div>
                <div class="text-sm text-gray-500">{{ $t('comparison.totalEvents') }}</div>
              </div>
              <div class="stat-item">
                <div class="text-2xl font-bold text-green-600">{{ realLifeStats.avgImportance }}</div>
                <div class="text-sm text-gray-500">{{ $t('comparison.avgImportance') }}</div>
              </div>
            </div>
            <div class="category-distribution">
              <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ $t('comparison.categoryDistribution') }}</h4>
              <div class="space-y-2">
                <div v-for="(count, category) in realLifeStats.categoryDistribution" :key="category" class="flex items-center justify-between">
                  <span class="text-sm text-gray-600 dark:text-gray-400">{{ getCategoryIcon(category) }} {{ category }}</span>
                  <span class="text-sm font-medium text-gray-800 dark:text-gray-200">{{ count }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Parallel Universe Selection -->
        <div class="selection-card bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 class="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
            <GitBranch class="w-6 h-6 mr-3 text-purple-500" />
            {{ $t('comparison.parallelUniverse') }}
          </h3>
          
          <div v-if="!selectedUniverse" class="text-center py-8">
            <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <GitBranch class="w-8 h-8 text-white" />
            </div>
            <p class="text-gray-500 dark:text-gray-400 mb-4">{{ $t('comparison.selectUniverse') }}</p>
            <select 
              v-model="selectedUniverseId"
              @change="selectUniverse"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            >
              <option value="">{{ $t('comparison.chooseUniverse') }}</option>
              <option v-for="universe in availableUniverses" :key="universe.id" :value="universe.id">
                {{ universe.title }}
              </option>
            </select>
          </div>

          <div v-else class="universe-stats">
            <div class="flex items-center justify-between mb-4">
              <h4 class="font-medium text-gray-800 dark:text-gray-200">{{ selectedUniverse.title }}</h4>
              <button @click="clearSelection" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X class="w-4 h-4" />
              </button>
            </div>
            
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div class="stat-item">
                <div class="text-2xl font-bold text-purple-600">{{ selectedUniverse.stats.level }}</div>
                <div class="text-sm text-gray-500">{{ $t('comparison.level') }}</div>
              </div>
              <div class="stat-item">
                <div class="text-2xl font-bold text-pink-600">{{ selectedUniverse.timeline.length }}</div>
                <div class="text-sm text-gray-500">{{ $t('comparison.decisions') }}</div>
              </div>
            </div>

            <div class="stats-bars space-y-3">
              <template v-for="(value, stat) in selectedUniverse.stats" :key="stat">
                <div v-if="stat !== 'level' && stat !== 'experience'">
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t(`virtualLife.stats.${stat}`) }}</span>
                    <span class="text-sm font-medium text-gray-800 dark:text-gray-200">{{ value }}/100</span>
                  </div>
                  <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      :class="getStatBarColor(stat as string)"
                      class="h-2 rounded-full transition-all duration-300"
                      :style="{ width: `${value}%` }"
                    ></div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Comparison Results -->
    <div v-if="selectedUniverse" class="comparison-results">
      <!-- Stats Comparison Chart -->
      <div class="comparison-chart bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 mb-8">
        <h3 class="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center">
          <BarChart3 class="w-6 h-6 mr-3 text-indigo-500" />
          {{ $t('comparison.statsComparison') }}
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="metric in comparisonMetrics" :key="metric.key" class="metric-card">
            <div class="text-center mb-4">
              <h4 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">{{ metric.name }}</h4>
              <div class="flex items-center justify-center space-x-4">
                <div class="text-center">
                  <div class="text-2xl font-bold text-blue-600">{{ metric.realValue }}</div>
                  <div class="text-xs text-gray-500">{{ $t('comparison.real') }}</div>
                </div>
                <div class="text-gray-400">vs</div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-purple-600">{{ metric.virtualValue }}</div>
                  <div class="text-xs text-gray-500">{{ $t('comparison.virtual') }}</div>
                </div>
              </div>
            </div>
            
            <div class="comparison-bar relative h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                class="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-400 to-blue-500 transition-all duration-500"
                :style="{ width: `${(metric.realValue / (metric.realValue + metric.virtualValue)) * 100}%` }"
              ></div>
              <div 
                class="absolute right-0 top-0 h-full bg-gradient-to-r from-purple-400 to-purple-500 transition-all duration-500"
                :style="{ width: `${(metric.virtualValue / (metric.realValue + metric.virtualValue)) * 100}%` }"
              ></div>
            </div>
            
            <div class="mt-2 text-center">
              <span :class="[
                'text-sm font-medium',
                metric.difference > 0 ? 'text-green-600' : metric.difference < 0 ? 'text-red-600' : 'text-gray-600'
              ]">
                {{ metric.difference > 0 ? '+' : '' }}{{ metric.difference }}
                {{ metric.difference > 0 ? $t('comparison.virtualHigher') : metric.difference < 0 ? $t('comparison.realHigher') : $t('comparison.equal') }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Insights and Recommendations -->
      <div class="insights-section bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 mb-8">
        <h3 class="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center">
          <Lightbulb class="w-6 h-6 mr-3 text-yellow-500" />
          {{ $t('comparison.insights') }}
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="insight-card">
            <h4 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">{{ $t('comparison.keyDifferences') }}</h4>
            <ul class="space-y-2">
              <li v-for="difference in keyDifferences" :key="difference.id" class="flex items-start space-x-3">
                <div class="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <span class="text-gray-600 dark:text-gray-300 text-sm">{{ difference.text }}</span>
              </li>
            </ul>
          </div>
          
          <div class="insight-card">
            <h4 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">{{ $t('comparison.recommendations') }}</h4>
            <ul class="space-y-2">
              <li v-for="recommendation in recommendations" :key="recommendation.id" class="flex items-start space-x-3">
                <div class="w-2 h-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                <span class="text-gray-600 dark:text-gray-300 text-sm">{{ recommendation.text }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Experience Transfer -->
      <div class="experience-transfer bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 class="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center">
          <ArrowRightLeft class="w-6 h-6 mr-3 text-green-500" />
          {{ $t('comparison.experienceTransfer') }}
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="transfer-section">
            <h4 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">{{ $t('comparison.availableInsights') }}</h4>
            <div class="space-y-3">
              <div v-for="insight in selectedUniverse.insights" :key="insight.id" 
                   class="insight-item bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                <p class="text-gray-700 dark:text-gray-300 text-sm mb-2">{{ insight.text }}</p>
                <div class="flex items-center justify-between">
                  <span class="text-xs text-purple-600 dark:text-purple-400">{{ insight.category }}</span>
                  <button 
                    @click="transferInsight(insight)"
                    class="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full hover:shadow-md transition-all duration-200"
                  >
                    {{ $t('comparison.transfer') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div class="transfer-section">
            <h4 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">{{ $t('comparison.transferredInsights') }}</h4>
            <div v-if="transferredInsights.length === 0" class="text-center py-8">
              <ArrowRightLeft class="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p class="text-gray-500 dark:text-gray-400 text-sm">{{ $t('comparison.noTransfers') }}</p>
            </div>
            <div v-else class="space-y-3">
              <div v-for="insight in transferredInsights" :key="insight.id" 
                   class="insight-item bg-green-50 dark:bg-green-900/30 p-4 rounded-lg border border-green-200 dark:border-green-700">
                <p class="text-gray-700 dark:text-gray-300 text-sm mb-2">{{ insight.text }}</p>
                <div class="flex items-center justify-between">
                  <span class="text-xs text-green-600 dark:text-green-400">{{ $t('comparison.transferred') }}</span>
                  <span class="text-xs text-gray-500">{{ formatDate(insight.transferredAt) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { 
  Calendar, 
  GitBranch, 
  BarChart3, 
  Lightbulb, 
  ArrowRightLeft,
  X
} from 'lucide-vue-next'

import { useEventStore } from '@/stores/events'
import { useParallelUniverseStore } from '@/stores/parallelUniverse'

const { t } = useI18n()
const eventStore = useEventStore()
const parallelUniverseStore = useParallelUniverseStore()

// Reactive data
const selectedUniverseId = ref('')
const transferredInsights = ref<any[]>([])

// Computed properties
const selectedUniverse = computed(() => {
  if (!selectedUniverseId.value) return null
  return parallelUniverseStore.parallelUniverseHistory.find(u => u.id === selectedUniverseId.value)
})

const availableUniverses = computed(() => {
  return parallelUniverseStore.parallelUniverseHistory
})

const realLifeStats = computed(() => {
  const events = eventStore.events
  const categoryDistribution: Record<string, number> = {}
  
  events.forEach(event => {
    categoryDistribution[event.category] = (categoryDistribution[event.category] || 0) + 1
  })
  
  const avgImportance = events.length > 0 
    ? Math.round(events.reduce((sum, event) => sum + (event.importance || 0), 0) / events.length)
    : 0
  
  return {
    totalEvents: events.length,
    avgImportance,
    categoryDistribution
  }
})

const comparisonMetrics = computed(() => {
  if (!selectedUniverse.value) return []
  
  return [
    {
      key: 'happiness',
      name: t('virtualLife.stats.happiness'),
      realValue: calculateRealLifeHappiness(),
      virtualValue: selectedUniverse.value.stats.happiness,
      difference: selectedUniverse.value.stats.happiness - calculateRealLifeHappiness()
    },
    {
      key: 'success',
      name: t('virtualLife.stats.success'),
      realValue: calculateRealLifeSuccess(),
      virtualValue: selectedUniverse.value.stats.success,
      difference: selectedUniverse.value.stats.success - calculateRealLifeSuccess()
    },
    {
      key: 'growth',
      name: t('virtualLife.stats.growth'),
      realValue: calculateRealLifeGrowth(),
      virtualValue: selectedUniverse.value.stats.growth,
      difference: selectedUniverse.value.stats.growth - calculateRealLifeGrowth()
    },
    {
      key: 'experience',
      name: t('virtualLife.stats.experience'),
      realValue: Math.min(eventStore.events.length * 10, 100),
      virtualValue: Math.min(selectedUniverse.value.stats.experience, 100),
      difference: Math.min(selectedUniverse.value.stats.experience, 100) - Math.min(eventStore.events.length * 10, 100)
    }
  ]
})

const keyDifferences = computed(() => {
  if (!selectedUniverse.value) return []
  
  const differences: Array<{id: string, text: string}> = []
  const metrics = comparisonMetrics.value
  
  metrics.forEach(metric => {
    if (Math.abs(metric.difference) > 10) {
      differences.push({
        id: metric.key,
        text: metric.difference > 0 
          ? t('comparison.virtualHigherIn', { metric: metric.name, diff: Math.abs(metric.difference) })
          : t('comparison.realHigherIn', { metric: metric.name, diff: Math.abs(metric.difference) })
      })
    }
  })
  
  return differences
})

const recommendations = computed(() => {
  if (!selectedUniverse.value) return []
  
  const recs: Array<{id: string, text: string}> = []
  const metrics = comparisonMetrics.value
  
  metrics.forEach(metric => {
    if (metric.difference > 15) {
      recs.push({
        id: `improve_real_${metric.key}`,
        text: t('comparison.improveReal', { metric: metric.name })
      })
    } else if (metric.difference < -15) {
      recs.push({
        id: `learn_from_virtual_${metric.key}`,
        text: t('comparison.learnFromVirtual', { metric: metric.name })
      })
    }
  })
  
  return recs
})

// Methods
const selectUniverse = () => {
  // Universe is automatically selected via computed property
}

const clearSelection = () => {
  selectedUniverseId.value = ''
}

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

const getStatBarColor = (stat: string) => {
  const colorMap: Record<string, string> = {
    happiness: 'bg-gradient-to-r from-pink-400 to-pink-500',
    success: 'bg-gradient-to-r from-blue-400 to-blue-500',
    growth: 'bg-gradient-to-r from-green-400 to-green-500',
    experience: 'bg-gradient-to-r from-purple-400 to-purple-500'
  }
  return colorMap[stat] || 'bg-gray-400'
}

const calculateRealLifeHappiness = () => {
  const events = eventStore.events
  const positiveEmotions = ['happy', 'excited', 'grateful']
  const positiveCount = events.filter(e => positiveEmotions.includes(e.emotion || '')).length
  return Math.min(Math.round((positiveCount / Math.max(events.length, 1)) * 100), 100)
}

const calculateRealLifeSuccess = () => {
  const events = eventStore.events
  const highImportanceCount = events.filter(e => (e.importance || 0) >= 8).length
  return Math.min(Math.round((highImportanceCount / Math.max(events.length, 1)) * 100), 100)
}

const calculateRealLifeGrowth = () => {
  const events = eventStore.events
  const learningEvents = events.filter(e => e.category === 'Learning' || e.category === 'Personal').length
  return Math.min(Math.round((learningEvents / Math.max(events.length, 1)) * 100), 100)
}

const transferInsight = (insight: any) => {
  // Transfer insight to real life
  const transferredInsight = {
    ...insight,
    transferredAt: new Date(),
    id: `transferred_${insight.id}_${Date.now()}`
  }
  
  transferredInsights.value.push(transferredInsight)
  
  // Create a new real life event based on the insight
  const newEvent = parallelUniverseStore.transferInsightToRealLife(selectedUniverse.value!.id, insight.id)
  if (newEvent) {
    // Add event using the store's method (assuming it exists)
    // eventStore.addEvent(newEvent)
    console.log('New event created from insight:', newEvent)
  }
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString()
}

// Lifecycle
onMounted(() => {
  // Initialize data if needed
})
</script>

<style scoped>
.comparison-bar {
  position: relative;
  overflow: hidden;
}

.comparison-bar > div {
  transition: width 0.5s ease-in-out;
}
</style>

