<!-- AI Life Coach Component -->
<template>
  <div class="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
    <div class="flex items-center space-x-3 mb-6">
      <div class="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
        <Brain class="w-6 h-6 text-white" />
      </div>
      <div>
        <h3 class="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          {{ $t('aiCoach.title') }}
        </h3>
        <p class="text-sm text-gray-600">
          {{ $t('aiCoach.subtitle') }}
        </p>
      </div>
    </div>

    <!-- AI Insights -->
    <div v-if="insights.length > 0" class="mb-6">
      <h4 class="font-semibold text-gray-900 mb-3">{{ $t('aiCoach.insights.today') }}</h4>
      <div class="space-y-3">
        <div
          v-for="(insight, index) in insights"
          :key="index"
          class="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100"
        >
          <div class="flex items-start space-x-3">
            <Lightbulb class="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
            <div>
              <p class="text-gray-700 text-sm">{{ $t('aiCoach.insights.messages.' + (insight.key || index), insight.params || {}) }}</p>
              <div class="flex items-center space-x-2 mt-2">
                <span class="text-xs text-indigo-600 font-medium">{{ $t('aiCoach.insights.categories.' + (insight.category || 'general')) }}</span>
                <span class="text-xs text-gray-500">•</span>
                <span class="text-xs text-gray-500">{{ insight.confidence }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-2 gap-3">
      <button
        @click="generateInsight"
        :disabled="isGenerating"
        class="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all disabled:opacity-50 text-sm font-medium"
      >
        <Sparkles class="w-4 h-4 inline mr-2" />
        {{ isGenerating ? $t('common.loading') : $t('aiCoach.insights.title') }}
      </button>
      <button
        @click="$emit('openSimulation')"
        class="p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all text-sm font-medium"
      >
        <Zap class="w-4 h-4 inline mr-2" />
        {{ $t('dashboard.quickActions.virtualSimulation') }}
      </button>
    </div>

    <!-- Life Score -->
    <div class="mt-6 p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg border border-green-100">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-medium text-gray-700">{{ $t('aiCoach.balance.title') }}</span>
        <span class="text-lg font-bold text-green-600">{{ lifeScore }}/100</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div 
          class="bg-gradient-to-r from-green-400 to-teal-400 h-2 rounded-full transition-all duration-500"
          :style="{ width: `${lifeScore}%` }"
        ></div>
      </div>
      <p class="text-xs text-gray-600 mt-2">{{ getScoreMessage(lifeScore) }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Brain, Lightbulb, Sparkles, Zap } from 'lucide-vue-next'

interface Props {
  events: any[]
  virtualStats?: any
}

const props = defineProps<Props>()
const emit = defineEmits<{
  openSimulation: []
}>()

const insights = ref<any[]>([])
const isGenerating = ref(false)

const lifeScore = computed(() => {
  if (!props.events.length) return 75
  
  // Calculate based on event diversity, frequency, and emotions
  const categories = new Set(props.events.map(e => e.category)).size
  const recentEvents = props.events.filter(e => {
    const eventDate = new Date(e.eventDate)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return eventDate >= weekAgo
  }).length
  
  const positiveEmotions = props.events.filter(e => 
    ['happy', 'excited', 'grateful'].includes(e.emotion)
  ).length
  
  const diversityScore = Math.min(categories * 12, 40)
  const activityScore = Math.min(recentEvents * 10, 30)
  const emotionScore = Math.min((positiveEmotions / Math.max(props.events.length, 1)) * 30, 30)
  
  return Math.round(diversityScore + activityScore + emotionScore)
})

const generateInsight = async () => {
  isGenerating.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const newInsights = await analyzeLifePatterns()
    insights.value = newInsights.slice(0, 3) // Show top 3 insights
  } finally {
    isGenerating.value = false
  }
}

const analyzeLifePatterns = async () => {
  const patterns = []
  
  // Analyze event patterns
  if (props.events.length > 0) {
    const categories = props.events.reduce((acc, event) => {
      acc[event.category] = (acc[event.category] || 0) + 1
      return acc
    }, {})
    
    const mostActive = Object.keys(categories).reduce((a, b) => 
      categories[a] > categories[b] ? a : b
    )
    
    if (categories[mostActive] > props.events.length * 0.4) {
      patterns.push({
        message: `You're heavily focused on ${mostActive.toLowerCase()}. Consider exploring other life areas for better balance.`,
        category: 'Balance',
        confidence: 85
      })
    }
    
    // Emotion analysis
    const emotions = props.events.filter(e => e.emotion).map(e => e.emotion)
    const stressedCount = emotions.filter(e => e === 'stressed').length
    
    if (stressedCount > emotions.length * 0.3) {
      patterns.push({
        message: 'I notice elevated stress levels in your recent events. Virtual life simulation could help explore stress-reduction strategies.',
        category: 'Wellness',
        confidence: 78
      })
    }
    
    // Growth opportunities
    const lowImportanceEvents = props.events.filter(e => (e.importance || 5) < 6).length
    if (lowImportanceEvents > props.events.length * 0.6) {
      patterns.push({
        message: 'Many of your events have low importance ratings. Consider setting bigger, more meaningful goals.',
        category: 'Growth',
        confidence: 72
      })
    }
  }
  
  // Default insights for new users
  if (patterns.length === 0) {
    patterns.push({
      message: 'Start tracking more diverse life events to get personalized insights and recommendations.',
      category: 'Getting Started',
      confidence: 90
    })
  }
  
  return patterns
}

const getScoreMessage = (score: number) => {
  if (score >= 80) return 'Excellent life balance! Keep up the great work.'
  if (score >= 60) return 'Good balance with room for improvement.'
  if (score >= 40) return 'Consider diversifying your activities and experiences.'
  return 'Focus on creating more varied and meaningful experiences.'
}

onMounted(() => {
  generateInsight()
})
</script>

