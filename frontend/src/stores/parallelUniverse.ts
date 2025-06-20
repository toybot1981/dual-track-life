import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface ParallelUniverseEvent {
  id: string
  title: string
  description: string
  type: 'preset' | 'time-triggered' | 'random'
  category: string
  impact: {
    happiness: number
    success: number
    growth: number
    experience: number
  }
  choices: Array<{
    id: string
    text: string
    impact: {
      happiness: number
      success: number
      growth: number
      experience: number
    }
    nextEventId?: string
  }>
  timestamp: Date
  completed: boolean
}

export interface ParallelUniverse {
  id: string
  title: string
  description: string
  mode: 'user-defined' | 'ai-planned'
  triggeredByEvent: any
  theme: string
  status: 'active' | 'completed' | 'paused'
  timeline: ParallelUniverseEvent[]
  stats: {
    happiness: number
    success: number
    growth: number
    experience: number
    level: number
  }
  achievements: Array<{
    id: string
    title: string
    description: string
    unlockedAt: Date
  }>
  insights: Array<{
    id: string
    text: string
    category: string
    createdAt: Date
  }>
  createdAt: Date
  updatedAt: Date
}

export const useParallelUniverseStore = defineStore('parallelUniverse', () => {
  // State
  const currentParallelUniverse = ref<ParallelUniverse | null>(null)
  const parallelUniverseHistory = ref<ParallelUniverse[]>([])
  const showParallelUniverseModal = ref(false)
  const showParallelUniverseGrid = ref(false)
  const triggeringRealLifeEvent = ref<any | null>(null)
  const selectedUniverseForComparison = ref<ParallelUniverse | null>(null)

  // Computed
  const totalParallelUniverses = computed(() => parallelUniverseHistory.value.length)
  const activeParallelUniverses = computed(() => 
    parallelUniverseHistory.value.filter(pu => pu.status === 'active')
  )
  const completedParallelUniverses = computed(() => 
    parallelUniverseHistory.value.filter(pu => pu.status === 'completed')
  )

  // Actions
  const openParallelUniverseModal = (event: any) => {
    triggeringRealLifeEvent.value = event
    showParallelUniverseModal.value = true
  }

  const closeParallelUniverseModal = () => {
    showParallelUniverseModal.value = false
    triggeringRealLifeEvent.value = null
  }

  const openParallelUniverseGrid = () => {
    showParallelUniverseGrid.value = true
  }

  const closeParallelUniverseGrid = () => {
    showParallelUniverseGrid.value = false
  }

  const startNewParallelUniverse = (mode: 'user-defined' | 'ai-planned', event: any, theme?: string) => {
    const newUniverse: ParallelUniverse = {
      id: `pu_${Date.now()}`,
      title: generateUniverseTitle(mode, theme, event),
      description: generateUniverseDescription(mode, theme, event),
      mode,
      triggeredByEvent: event,
      theme: theme || 'general',
      status: 'active',
      timeline: [],
      stats: {
        happiness: 50,
        success: 50,
        growth: 50,
        experience: 0,
        level: 1
      },
      achievements: [],
      insights: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Generate initial events based on mode
    if (mode === 'ai-planned') {
      newUniverse.timeline = generateAIPlannedEvents(theme, event)
    }

    currentParallelUniverse.value = newUniverse
    parallelUniverseHistory.value.push(newUniverse)
    
    return newUniverse
  }

  const updateParallelUniverseStats = (universeId: string, statChanges: Partial<ParallelUniverse['stats']>) => {
    const universe = parallelUniverseHistory.value.find(pu => pu.id === universeId)
    if (universe) {
      Object.assign(universe.stats, statChanges)
      universe.updatedAt = new Date()
      
      // Check for level up
      const newLevel = Math.floor(universe.stats.experience / 100) + 1
      if (newLevel > universe.stats.level) {
        universe.stats.level = newLevel
        addAchievement(universeId, {
          id: `level_${newLevel}`,
          title: `Level ${newLevel} Reached`,
          description: `You've reached level ${newLevel} in your parallel universe!`,
          unlockedAt: new Date()
        })
      }
    }
  }

  const addParallelUniverseEvent = (universeId: string, event: ParallelUniverseEvent) => {
    const universe = parallelUniverseHistory.value.find(pu => pu.id === universeId)
    if (universe) {
      universe.timeline.push(event)
      universe.updatedAt = new Date()
    }
  }

  const makeChoice = (universeId: string, eventId: string, choiceId: string) => {
    const universe = parallelUniverseHistory.value.find(pu => pu.id === universeId)
    if (!universe) return

    const event = universe.timeline.find(e => e.id === eventId)
    if (!event) return

    const choice = event.choices.find(c => c.id === choiceId)
    if (!choice) return

    // Apply choice impact
    updateParallelUniverseStats(universeId, choice.impact)
    
    // Mark event as completed
    event.completed = true

    // Generate next event if specified
    if (choice.nextEventId) {
      // Logic to trigger next event
    } else {
      // Generate random next event
      generateNextEvent(universeId, choice)
    }

    // Add insight based on choice
    addInsight(universeId, {
      id: `insight_${Date.now()}`,
      text: generateInsightFromChoice(choice, event),
      category: event.category,
      createdAt: new Date()
    })
  }

  const addAchievement = (universeId: string, achievement: ParallelUniverse['achievements'][0]) => {
    const universe = parallelUniverseHistory.value.find(pu => pu.id === universeId)
    if (universe) {
      universe.achievements.push(achievement)
    }
  }

  const addInsight = (universeId: string, insight: ParallelUniverse['insights'][0]) => {
    const universe = parallelUniverseHistory.value.find(pu => pu.id === universeId)
    if (universe) {
      universe.insights.push(insight)
    }
  }

  const transferInsightToRealLife = (universeId: string, insightId: string) => {
    const universe = parallelUniverseHistory.value.find(pu => pu.id === universeId)
    if (!universe) return

    const insight = universe.insights.find(i => i.id === insightId)
    if (!insight) return

    // This would integrate with the events store to add a new real life event
    // based on the parallel universe insight
    return {
      title: `Insight from Parallel Universe: ${universe.title}`,
      description: insight.text,
      category: 'personal',
      emotion: 'grateful',
      importance: 8,
      location: 'Virtual Experience',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0].substring(0, 5)
    }
  }

  const resetParallelUniverseData = () => {
    currentParallelUniverse.value = null
    parallelUniverseHistory.value = []
    showParallelUniverseModal.value = false
    showParallelUniverseGrid.value = false
    triggeringRealLifeEvent.value = null
    selectedUniverseForComparison.value = null
  }

  // Helper functions
  const generateUniverseTitle = (mode: string, theme?: string, event?: any): string => {
    const themes = {
      'entrepreneur': '创业人生',
      'artist': '艺术人生', 
      'adventurer': '冒险人生',
      'scholar': '学者人生',
      'family': '家庭人生',
      'general': '平行人生'
    }
    return themes[theme as keyof typeof themes] || `平行宇宙 - ${event?.title || '未知起点'}`
  }

  const generateUniverseDescription = (mode: string, theme?: string, event?: any): string => {
    if (mode === 'ai-planned') {
      return `基于AI规划的${theme}主题平行宇宙，从"${event?.title}"事件开始的全新人生轨迹。`
    } else {
      return `用户自定义的平行宇宙，从"${event?.title}"事件开始探索不同的人生可能性。`
    }
  }

  const generateAIPlannedEvents = (theme?: string, triggerEvent?: any): ParallelUniverseEvent[] => {
    const baseEvents: ParallelUniverseEvent[] = [
      {
        id: `event_${Date.now()}_1`,
        title: '新的开始',
        description: `在"${triggerEvent?.title}"之后，你面临一个重要的人生节点。你会如何开始这段新的旅程？`,
        type: 'preset',
        category: 'life-choice',
        impact: { happiness: 0, success: 0, growth: 5, experience: 10 },
        choices: [
          {
            id: 'choice_1',
            text: '谨慎规划，稳步前进',
            impact: { happiness: 5, success: 10, growth: 5, experience: 15 }
          },
          {
            id: 'choice_2', 
            text: '大胆冒险，追求突破',
            impact: { happiness: 10, success: 5, growth: 15, experience: 20 }
          },
          {
            id: 'choice_3',
            text: '寻求他人建议和帮助',
            impact: { happiness: 8, success: 8, growth: 10, experience: 12 }
          }
        ],
        timestamp: new Date(),
        completed: false
      }
    ]

    return baseEvents
  }

  const generateNextEvent = (universeId: string, previousChoice: any) => {
    // Generate next event based on previous choice and universe theme
    const nextEvent: ParallelUniverseEvent = {
      id: `event_${Date.now()}`,
      title: '意外的机遇',
      description: '基于你之前的选择，一个新的机会出现了...',
      type: 'random',
      category: 'opportunity',
      impact: { happiness: 0, success: 0, growth: 0, experience: 5 },
      choices: [
        {
          id: 'choice_next_1',
          text: '抓住机会',
          impact: { happiness: 5, success: 15, growth: 10, experience: 20 }
        },
        {
          id: 'choice_next_2',
          text: '谨慎观望',
          impact: { happiness: 2, success: 5, growth: 5, experience: 10 }
        }
      ],
      timestamp: new Date(),
      completed: false
    }

    addParallelUniverseEvent(universeId, nextEvent)
  }

  const generateInsightFromChoice = (choice: any, event: ParallelUniverseEvent): string => {
    const insights = [
      `通过选择"${choice.text}"，我学会了在${event.category}方面的重要经验。`,
      `这个决定让我明白了${choice.text}的价值和意义。`,
      `在${event.title}中选择${choice.text}，给了我新的人生感悟。`
    ]
    return insights[Math.floor(Math.random() * insights.length)]
  }

  return {
    // State
    currentParallelUniverse,
    parallelUniverseHistory,
    showParallelUniverseModal,
    showParallelUniverseGrid,
    triggeringRealLifeEvent,
    selectedUniverseForComparison,
    
    // Computed
    totalParallelUniverses,
    activeParallelUniverses,
    completedParallelUniverses,
    
    // Actions
    openParallelUniverseModal,
    closeParallelUniverseModal,
    openParallelUniverseGrid,
    closeParallelUniverseGrid,
    startNewParallelUniverse,
    updateParallelUniverseStats,
    addParallelUniverseEvent,
    makeChoice,
    addAchievement,
    addInsight,
    transferInsightToRealLife,
    resetParallelUniverseData
  }
})

