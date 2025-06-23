<template>
  <div
    v-if="props.show"
    class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
    @click="handleClose"
  >
    <div
      class="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl max-w-6xl w-full mx-4 border border-white/20 max-h-[90vh] overflow-hidden"
      @click.stop
    >
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200/50">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Zap class="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {{ $t('virtualLife.title') }}
            </h2>
            <p class="text-sm text-gray-600">
              {{ $t('virtualLife.description') }}
            </p>
          </div>
        </div>
        <button
          @click="handleClose"
          class="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-2 transition-all"
        >
          <X class="w-6 h-6" />
        </button>
      </div>

      <!-- Content -->
      <div class="flex h-[calc(90vh-120px)]">
        <!-- Sidebar -->
        <div class="w-80 bg-gradient-to-b from-purple-50 to-pink-50 border-r border-gray-200/50 p-6 overflow-y-auto">
          <!-- Simulation Mode Selection -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('virtualLife.modes.title') }}</h3>
            <div class="space-y-3">
              <button
                v-for="mode in simulationModes"
                :key="mode.id"
                @click="selectedMode = mode.id"
                :class="[
                  'w-full p-4 rounded-xl text-left transition-all',
                  selectedMode === mode.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'bg-white/70 hover:bg-white/90 text-gray-700'
                ]"
              >
                <div class="flex items-center space-x-3">
                  <span class="text-2xl">{{ mode.icon }}</span>
                  <div>
                    <div class="font-semibold">{{ $t('virtualLife.modes.' + mode.id) }}</div>
                    <div class="text-sm opacity-80">{{ $t('virtualLife.modes.' + mode.id + 'Desc') }}</div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <!-- AI Personality Settings -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('virtualLife.personality.title') }}</h3>
            <div class="space-y-3">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('virtualLife.personality.riskTolerance') }}</label>
                <input
                  v-model="aiSettings.riskTolerance"
                  type="range"
                  min="0"
                  max="100"
                  class="w-full"
                />
                <div class="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{{ $t('virtualLife.personality.conservative') }}</span>
                  <span>{{ aiSettings.riskTolerance }}%</span>
                  <span>{{ $t('virtualLife.personality.adventurous') }}</span>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('virtualLife.personality.creativity') }}</label>
                <input
                  v-model="aiSettings.creativity"
                  type="range"
                  min="0"
                  max="100"
                  class="w-full"
                />
                <div class="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{{ $t('virtualLife.personality.practical') }}</span>
                  <span>{{ aiSettings.creativity }}%</span>
                  <span>{{ $t('virtualLife.personality.imaginative') }}</span>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('virtualLife.personality.focusArea') }}</label>
                <select
                  v-model="aiSettings.focusArea"
                  class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="balanced">🎯 {{ $t('virtualLife.personality.balanced') }}</option>
                  <option value="career">💼 {{ $t('virtualLife.personality.career') }}</option>
                  <option value="relationships">❤️ {{ $t('virtualLife.personality.relationships') }}</option>
                  <option value="health">🏥 {{ $t('virtualLife.personality.health') }}</option>
                  <option value="creativity">🎨 {{ $t('virtualLife.personality.creativity') }}</option>
                  <option value="adventure">🌍 {{ $t('virtualLife.personality.adventurous') }}</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('dashboard.quickActions.title') }}</h3>
            <div class="space-y-2">
              <button
                @click="generateRandomScenario"
                :disabled="isGenerating"
                class="w-full p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-50"
              >
                <Shuffle class="w-4 h-4 inline mr-2" />
                {{ $t('virtualLife.actions.randomScenario') }}
              </button>
              <button
                @click="analyzeRealLife"
                :disabled="isAnalyzing"
                class="w-full p-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 transition-all disabled:opacity-50"
              >
                <Brain class="w-4 h-4 inline mr-2" />
                {{ $t('virtualLife.actions.analyzeRealLife') }}
              </button>
              <button
                @click="resetSimulation"
                class="w-full p-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all"
              >
                <RotateCcw class="w-4 h-4 inline mr-2" />
                {{ $t('virtualLife.actions.resetSimulation') }}
              </button>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="flex-1 flex flex-col">
          <!-- Simulation View -->
          <div class="flex-1 p-6 overflow-y-auto">
            <!-- Current Scenario -->
            <div v-if="currentScenario" class="mb-6">
              <div class="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 border border-purple-200">
                <div class="flex items-start space-x-4">
                  <div class="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span class="text-2xl">{{ currentScenario.icon }}</span>
                  </div>
                  <div class="flex-1">
                    <h3 class="text-xl font-bold text-gray-900 mb-2">{{ $t(currentScenario.title) }}</h3>
                    <p class="text-gray-700 mb-4">{{ $t(currentScenario.description) }}</p>
                    
                    <!-- Scenario Stats -->
                    <div class="grid grid-cols-3 gap-4 mb-4">
                      <div class="text-center">
                        <div class="text-2xl font-bold text-purple-600">{{ currentScenario.impact.happiness }}%</div>
                        <div class="text-sm text-gray-600">{{ $t('virtualLife.stats.happiness') }}</div>
                      </div>
                      <div class="text-center">
                        <div class="text-2xl font-bold text-blue-600">{{ currentScenario.impact.success }}%</div>
                        <div class="text-sm text-gray-600">{{ $t('virtualLife.stats.success') }}</div>
                      </div>
                      <div class="text-center">
                        <div class="text-2xl font-bold text-green-600">{{ currentScenario.impact.growth }}%</div>
                        <div class="text-sm text-gray-600">{{ $t('virtualLife.stats.growth') }}</div>
                      </div>
                    </div>

                    <!-- AI Insight -->
                    <div class="bg-white/70 rounded-lg p-4 mb-4">
                      <div class="flex items-center space-x-2 mb-2">
                        <Sparkles class="w-5 h-5 text-purple-500" />
                        <span class="font-semibold text-gray-900">{{ $t('virtualLife.scenario.aiInsight') }}</span>
                      </div>
                      <p class="text-gray-700 text-sm">
                        <template v-if="currentScenario.aiInsight && currentScenario.aiInsight.key">
                          {{ $t(currentScenario.aiInsight.key, currentScenario.aiInsight.params) }}
                        </template>
                        <template v-else>
                          {{ $te(currentScenario.aiInsight) ? $t(currentScenario.aiInsight) : currentScenario.aiInsight }}
                        </template>
                      </p>
                    </div>

                    <!-- Choices -->
                    <div class="space-y-3">
                      <h4 class="font-semibold text-gray-900">{{ $t('virtualLife.scenario.makeChoice') }}</h4>
                      <div class="grid gap-3">
                        <button
                          v-for="(choice, index) in currentScenario.choices"
                          :key="index"
                          @click="makeChoice(choice)"
                          class="p-4 bg-white/70 hover:bg-white/90 rounded-lg border border-gray-200 text-left transition-all hover:shadow-md"
                        >
                          <div class="flex items-center space-x-3">
                            <span class="text-lg">{{ choice.icon }}</span>
                            <div class="flex-1">
                              <div class="font-medium text-gray-900">{{ $t(choice.text) }}</div>
                              <div class="text-sm text-gray-600">{{ $t(choice.consequence) }}</div>
                            </div>
                            <div class="text-right">
                              <div class="text-xs text-gray-500">{{ $t('virtualLife.scenario.impact') }}</div>
                              <div class="text-sm font-medium" :class="getImpactColor(choice.impact)">
                                {{ choice.impact > 0 ? '+' : '' }}{{ choice.impact }}
                              </div>
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Life Timeline -->
            <div v-if="virtualTimeline.length > 0" class="mb-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('virtualLife.stats.title') }}</h3>
              <div class="space-y-4">
                <div
                  v-for="(event, index) in virtualTimeline"
                  :key="index"
                  class="flex items-start space-x-4 p-4 bg-white/70 rounded-lg border border-gray-200"
                >
                  <div class="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <span class="text-sm">{{ event.icon }}</span>
                  </div>
                  <div class="flex-1">
                    <div class="font-medium text-gray-900">{{ $t(event.title) }}</div>
                    <div class="text-sm text-gray-600">{{ $t(event.description) }}</div>
                    <div class="text-xs text-gray-500 mt-1">{{ event.timestamp }}</div>
                  </div>
                  <div class="text-right">
                    <div class="text-sm font-medium" :class="getImpactColor(event.impact)">
                      {{ event.impact > 0 ? '+' : '' }}{{ event.impact }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Virtual Stats -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="bg-white/70 rounded-lg p-4 text-center">
                <div class="text-2xl font-bold text-purple-600">{{ virtualStats.happiness }}</div>
                <div class="text-sm text-gray-600">{{ $t('virtualLife.stats.happiness') }}</div>
              </div>
              <div class="bg-white/70 rounded-lg p-4 text-center">
                <div class="text-2xl font-bold text-blue-600">{{ virtualStats.success }}</div>
                <div class="text-sm text-gray-600">{{ $t('virtualLife.stats.success') }}</div>
              </div>
              <div class="bg-white/70 rounded-lg p-4 text-center">
                <div class="text-2xl font-bold text-green-600">{{ virtualStats.growth }}</div>
                <div class="text-sm text-gray-600">{{ $t('virtualLife.stats.growth') }}</div>
              </div>
              <div class="bg-white/70 rounded-lg p-4 text-center">
                <div class="text-2xl font-bold text-orange-600">{{ virtualStats.experience }}</div>
                <div class="text-sm text-gray-600">{{ $t('virtualLife.stats.experience') }}</div>
              </div>
            </div>

            <!-- Loading State -->
            <div v-if="isGenerating || isAnalyzing" class="text-center py-12">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p class="text-gray-600">
                {{ isGenerating ? $t('virtualLife.loading') : $t('virtualLife.analyzing') }}
              </p>
            </div>

            <!-- Welcome State -->
            <div v-if="!currentScenario && !isGenerating && !isAnalyzing" class="text-center py-12">
              <div class="w-20 h-20 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap class="w-10 h-10 text-purple-600" />
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ $t('virtualLife.title') }}</h3>
              <p class="text-gray-600 mb-6 max-w-md mx-auto">
                {{ $t('virtualLife.subtitle') }}
              </p>
              <button
                @click="generateRandomScenario"
                class="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
              >
                {{ $t('virtualLife.actions.randomScenario') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { 
  X, 
  Zap, 
  Shuffle, 
  Brain, 
  RotateCcw, 
  Sparkles 
} from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

interface Props {
  show: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

const { t } = useI18n()

// Simulation modes
const simulationModes = [
  {
    id: 'explore',
    name: 'Life Explorer',
    description: 'Discover new possibilities',
    icon: '🌟'
  },
  {
    id: 'decision',
    name: 'Decision Maker',
    description: 'Test important choices',
    icon: '🤔'
  },
  {
    id: 'goal',
    name: 'Goal Achiever',
    description: 'Plan your success path',
    icon: '🎯'
  },
  {
    id: 'adventure',
    name: 'Adventure Seeker',
    description: 'Take bold risks',
    icon: '🚀'
  }
]

// State
const selectedMode = ref('explore')
const isGenerating = ref(false)
const isAnalyzing = ref(false)
const currentScenario = ref<any>(null)
const virtualTimeline = ref<any[]>([])

const aiSettings = reactive({
  riskTolerance: 50,
  creativity: 70,
  focusArea: 'balanced'
})

const virtualStats = reactive({
  happiness: 75,
  success: 60,
  growth: 80,
  experience: 45
})

// Scenario templates
const scenarioTemplates = [
  {
    id: 'career_change',
    title: 'virtualLife.scenarioTemplates.career_change.title',
    description: 'virtualLife.scenarioTemplates.career_change.description',
    icon: '💼',
    category: 'career',
    impact: { happiness: 15, success: 25, growth: 30 },
    aiInsight: 'virtualLife.scenarioTemplates.career_change.aiInsight',
    choices: [
      {
        text: 'virtualLife.scenarioTemplates.career_change.choices.0.text',
        consequence: 'virtualLife.scenarioTemplates.career_change.choices.0.consequence',
        icon: '✈️',
        impact: 20
      },
      {
        text: 'virtualLife.scenarioTemplates.career_change.choices.1.text',
        consequence: 'virtualLife.scenarioTemplates.career_change.choices.1.consequence',
        icon: '🏠',
        impact: -5
      },
      {
        text: 'virtualLife.scenarioTemplates.career_change.choices.2.text',
        consequence: 'virtualLife.scenarioTemplates.career_change.choices.2.consequence',
        icon: '💻',
        impact: 10
      }
    ]
  },
  {
    id: 'relationship_choice',
    title: 'virtualLife.scenarioTemplates.relationship_choice.title',
    description: 'virtualLife.scenarioTemplates.relationship_choice.description',
    icon: '💕',
    category: 'relationships',
    impact: { happiness: 25, success: 5, growth: 15 },
    aiInsight: 'virtualLife.scenarioTemplates.relationship_choice.aiInsight',
    choices: [
      {
        text: 'virtualLife.scenarioTemplates.relationship_choice.choices.0.text',
        consequence: 'virtualLife.scenarioTemplates.relationship_choice.choices.0.consequence',
        icon: '❤️',
        impact: 15
      },
      {
        text: 'virtualLife.scenarioTemplates.relationship_choice.choices.1.text',
        consequence: 'virtualLife.scenarioTemplates.relationship_choice.choices.1.consequence',
        icon: '🤝',
        impact: 5
      },
      {
        text: 'virtualLife.scenarioTemplates.relationship_choice.choices.2.text',
        consequence: 'virtualLife.scenarioTemplates.relationship_choice.choices.2.consequence',
        icon: '🌍',
        impact: 10
      }
    ]
  },
  {
    id: 'creative_pursuit',
    title: 'virtualLife.scenarioTemplates.creative_pursuit.title',
    description: 'virtualLife.scenarioTemplates.creative_pursuit.description',
    icon: '📚',
    category: 'creativity',
    impact: { happiness: 20, success: 10, growth: 25 },
    aiInsight: 'virtualLife.scenarioTemplates.creative_pursuit.aiInsight',
    choices: [
      {
        text: 'virtualLife.scenarioTemplates.creative_pursuit.choices.0.text',
        consequence: 'virtualLife.scenarioTemplates.creative_pursuit.choices.0.consequence',
        icon: '✍️',
        impact: 18
      },
      {
        text: 'virtualLife.scenarioTemplates.creative_pursuit.choices.1.text',
        consequence: 'virtualLife.scenarioTemplates.creative_pursuit.choices.1.consequence',
        icon: '📋',
        impact: 12
      },
      {
        text: 'virtualLife.scenarioTemplates.creative_pursuit.choices.2.text',
        consequence: 'virtualLife.scenarioTemplates.creative_pursuit.choices.2.consequence',
        icon: '👥',
        impact: 15
      }
    ]
  },
  {
    id: 'health_challenge',
    title: 'virtualLife.scenarioTemplates.health_challenge.title',
    description: 'virtualLife.scenarioTemplates.health_challenge.description',
    icon: '🏥',
    category: 'health',
    impact: { happiness: 10, success: 15, growth: 30 },
    aiInsight: 'virtualLife.scenarioTemplates.health_challenge.aiInsight',
    choices: [
      {
        text: 'virtualLife.scenarioTemplates.health_challenge.choices.0.text',
        consequence: 'virtualLife.scenarioTemplates.health_challenge.choices.0.consequence',
        icon: '🔄',
        impact: 25
      },
      {
        text: 'virtualLife.scenarioTemplates.health_challenge.choices.1.text',
        consequence: 'virtualLife.scenarioTemplates.health_challenge.choices.1.consequence',
        icon: '📈',
        impact: 20
      },
      {
        text: 'virtualLife.scenarioTemplates.health_challenge.choices.2.text',
        consequence: 'virtualLife.scenarioTemplates.health_challenge.choices.2.consequence',
        icon: '👨‍⚕️',
        impact: 22
      }
    ]
  },
  {
    id: 'financial_opportunity',
    title: 'virtualLife.scenarioTemplates.financial_opportunity.title',
    description: 'virtualLife.scenarioTemplates.financial_opportunity.description',
    icon: '💰',
    category: 'finance',
    impact: { happiness: 5, success: 30, growth: 20 },
    aiInsight: 'virtualLife.scenarioTemplates.financial_opportunity.aiInsight',
    choices: [
      {
        text: 'virtualLife.scenarioTemplates.financial_opportunity.choices.0.text',
        consequence: 'virtualLife.scenarioTemplates.financial_opportunity.choices.0.consequence',
        icon: '🎲',
        impact: 25
      },
      {
        text: 'virtualLife.scenarioTemplates.financial_opportunity.choices.1.text',
        consequence: 'virtualLife.scenarioTemplates.financial_opportunity.choices.1.consequence',
        icon: '⚖️',
        impact: 15
      },
      {
        text: 'virtualLife.scenarioTemplates.financial_opportunity.choices.2.text',
        consequence: 'virtualLife.scenarioTemplates.financial_opportunity.choices.2.consequence',
        icon: '🛡️',
        impact: -5
      }
    ]
  }
]

// Methods
const handleClose = () => {
  emit('close')
}

const generateRandomScenario = async () => {
  isGenerating.value = true
  
  // Simulate AI processing
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // Select scenario based on AI settings and mode
  const filteredScenarios = scenarioTemplates.filter(scenario => {
    if (aiSettings.focusArea === 'balanced') return true
    return scenario.category === aiSettings.focusArea.replace('_', '')
  })
  
  const randomScenario = filteredScenarios[Math.floor(Math.random() * filteredScenarios.length)]
  
  // Adjust scenario based on AI settings
  const adjustedScenario = {
    ...randomScenario,
    aiInsight: generateAIInsight(randomScenario),
    choices: randomScenario.choices.map(choice => ({
      ...choice,
      impact: adjustImpactForSettings(choice.impact)
    }))
  }
  
  currentScenario.value = adjustedScenario
  isGenerating.value = false
}

const generateAIInsight = (scenario: any) => {
  const keys = [
    'virtualLife.aiInsights.riskComfort',
    'virtualLife.aiInsights.creativity',
    'virtualLife.aiInsights.focusArea',
    'virtualLife.aiInsights.balance',
    'virtualLife.aiInsights.vision'
  ]
  const idx = Math.floor(Math.random() * keys.length)
  const key = keys[idx]
  // 变量参数
  const params: any = {
    risk: aiSettings.riskTolerance,
    focus: t('virtualLife.personality.' + aiSettings.focusArea) || aiSettings.focusArea
  }
  return { key, params }
}

const adjustImpactForSettings = (baseImpact: number) => {
  const riskMultiplier = aiSettings.riskTolerance / 50
  const creativityBonus = aiSettings.creativity > 70 ? 2 : 0
  
  return Math.round(baseImpact * riskMultiplier + creativityBonus)
}

const makeChoice = (choice: any) => {
  // Add to timeline
  virtualTimeline.value.unshift({
    title: choice.text,
    description: choice.consequence,
    icon: choice.icon,
    impact: choice.impact,
    timestamp: new Date().toLocaleString()
  })
  
  // Update stats
  virtualStats.happiness = Math.max(0, Math.min(100, virtualStats.happiness + choice.impact))
  virtualStats.success = Math.max(0, Math.min(100, virtualStats.success + Math.round(choice.impact * 0.8)))
  virtualStats.growth = Math.max(0, Math.min(100, virtualStats.growth + Math.round(choice.impact * 1.2)))
  virtualStats.experience += Math.abs(choice.impact)
  
  // Generate next scenario after a delay
  setTimeout(() => {
    generateRandomScenario()
  }, 1500)
}

const analyzeRealLife = async () => {
  isAnalyzing.value = true
  
  // Simulate AI analysis of real life data
  await new Promise(resolve => setTimeout(resolve, 3000))
  
  // Generate personalized scenario based on "analysis"
  const personalizedScenario = {
    title: 'Personal Growth Opportunity',
    description: 'Based on your recent life events, I notice you\'ve been focusing heavily on work. What if you took time to explore a new hobby or skill?',
    icon: '🌱',
    impact: { happiness: 20, success: 15, growth: 25 },
    aiInsight: 'Your real-life data shows high work engagement but limited personal development activities. Diversifying your experiences could enhance overall life satisfaction.',
    choices: [
      {
        text: 'Learn a new language',
        consequence: 'Expand your cultural horizons',
        icon: '🗣️',
        impact: 15
      },
      {
        text: 'Take up a sport',
        consequence: 'Improve physical and mental health',
        icon: '🏃‍♂️',
        impact: 18
      },
      {
        text: 'Start a creative project',
        consequence: 'Express your artistic side',
        icon: '🎨',
        impact: 20
      }
    ]
  }
  
  currentScenario.value = personalizedScenario
  isAnalyzing.value = false
}

const resetSimulation = () => {
  currentScenario.value = null
  virtualTimeline.value = []
  virtualStats.happiness = 75
  virtualStats.success = 60
  virtualStats.growth = 80
  virtualStats.experience = 45
}

const getImpactColor = (impact: number) => {
  if (impact > 15) return 'text-green-600'
  if (impact > 5) return 'text-blue-600'
  if (impact > 0) return 'text-yellow-600'
  return 'text-red-600'
}
</script>

