import { defineStore } from 'pinia'

// 虚拟人生统计接口
export interface VirtualStats {
  happiness: number      // 幸福感 (0-100)
  success: number        // 成功度 (0-100)
  growth: number         // 成长值 (0-100)
  experience: number     // 经验值 (0-∞)
}

// 虚拟人生决策接口
export interface VirtualDecision {
  id: number
  scenarioId: number
  title: string
  description: string
  choice: string
  impact: {
    happiness: number
    success: number
    growth: number
    experience: number
  }
  timestamp: string
}

// 虚拟场景接口
export interface VirtualScenario {
  id: number
  title: string
  description: string
  category: string
  choices: {
    id: number
    text: string
    impact: {
      happiness: number
      success: number
      growth: number
      experience: number
    }
    probability: number
  }[]
  aiInsight: string
  difficulty: number
}

// AI个性设置接口
export interface AIPersonality {
  riskTolerance: number    // 风险承受度 (0-100)
  creativity: number       // 创造力水平 (0-100)
  focusArea: string        // 专注领域
}

// Demo虚拟人生数据
const DEMO_VIRTUAL_STATS: VirtualStats = {
  happiness: 78,
  success: 65,
  growth: 82,
  experience: 1250
}

const DEMO_VIRTUAL_DECISIONS: VirtualDecision[] = [
  {
    id: 1,
    scenarioId: 101,
    title: '选择了创业机会',
    description: '在一个虚拟场景中，我选择了离开稳定工作去创业，虽然有风险但获得了宝贵的经验。',
    choice: '勇敢创业',
    impact: {
      happiness: -5,
      success: +15,
      growth: +20,
      experience: +100
    },
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 2,
    scenarioId: 102,
    title: '投资了新技能学习',
    description: '选择花费时间和金钱学习AI技术，提升了个人能力和未来竞争力。',
    choice: '投资学习',
    impact: {
      happiness: +10,
      success: +8,
      growth: +25,
      experience: +80
    },
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 3,
    scenarioId: 103,
    title: '选择了工作生活平衡',
    description: '面对高薪但高压的工作机会，选择了更平衡的生活方式，提升了幸福感。',
    choice: '平衡生活',
    impact: {
      happiness: +20,
      success: -5,
      growth: +5,
      experience: +60
    },
    timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
  }
]

const DEMO_AI_PERSONALITY: AIPersonality = {
  riskTolerance: 65,
  creativity: 75,
  focusArea: 'balanced'
}

export const useVirtualLifeStore = defineStore('virtualLife', {
  state: () => ({
    // 虚拟人生统计
    currentStats: DEMO_VIRTUAL_STATS,
    
    // 决策历史
    decisions: DEMO_VIRTUAL_DECISIONS,
    
    // AI个性设置
    aiPersonality: DEMO_AI_PERSONALITY,
    
    // 当前场景
    currentScenario: null as VirtualScenario | null,
    
    // 加载状态
    isLoading: false,
    
    // 错误信息
    error: null as string | null
  }),

  getters: {
    // 当前等级（基于经验值）
    currentLevel: (state) => Math.floor(state.currentStats.experience / 100) + 1,
    
    // 下一级所需经验
    experienceToNextLevel: (state) => {
      const currentLevel = Math.floor(state.currentStats.experience / 100) + 1
      return currentLevel * 100 - state.currentStats.experience
    },
    
    // 总体生活质量评分
    overallScore: (state) => {
      const { happiness, success, growth } = state.currentStats
      return Math.round((happiness + success + growth) / 3)
    },
    
    // 最近的决策
    recentDecisions: (state) => {
      return state.decisions
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 5)
    }
  },

  actions: {
    // 生成随机场景
    async generateRandomScenario() {
      this.isLoading = true
      this.error = null

      try {
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 1500))

        const scenarios = this.getScenariosByPersonality()
        const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)]
        
        this.currentScenario = randomScenario
        return randomScenario
      } catch (error: any) {
        this.error = error.message || 'Failed to generate scenario'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // 基于真实生活分析生成场景
    async analyzeRealLifeAndGenerateScenario(realLifeEvents: any[]) {
      this.isLoading = true
      this.error = null

      try {
        // 模拟AI分析延迟
        await new Promise(resolve => setTimeout(resolve, 2000))

        // 分析真实生活事件模式
        const analysis = this.analyzeLifePatterns(realLifeEvents)
        const scenario = this.generateScenarioBasedOnAnalysis(analysis)
        
        this.currentScenario = scenario
        return scenario
      } catch (error: any) {
        this.error = error.message || 'Failed to analyze real life'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // 做出决策
    async makeDecision(choiceId: number) {
      if (!this.currentScenario) {
        throw new Error('No active scenario')
      }

      const choice = this.currentScenario.choices.find(c => c.id === choiceId)
      if (!choice) {
        throw new Error('Invalid choice')
      }

      // 创建决策记录
      const decision: VirtualDecision = {
        id: Date.now(),
        scenarioId: this.currentScenario.id,
        title: this.currentScenario.title,
        description: `在"${this.currentScenario.title}"场景中，选择了"${choice.text}"`,
        choice: choice.text,
        impact: choice.impact,
        timestamp: new Date().toISOString()
      }

      // 更新统计数据
      this.updateStats(choice.impact)
      
      // 添加到决策历史
      this.decisions.push(decision)
      
      // 清除当前场景
      this.currentScenario = null

      // 保存到localStorage
      this.saveToLocalStorage()

      return decision
    },

    // 更新AI个性设置
    updateAIPersonality(personality: Partial<AIPersonality>) {
      this.aiPersonality = { ...this.aiPersonality, ...personality }
      this.saveToLocalStorage()
    },

    // 更新统计数据
    updateStats(impact: VirtualStats) {
      this.currentStats.happiness = Math.max(0, Math.min(100, this.currentStats.happiness + impact.happiness))
      this.currentStats.success = Math.max(0, Math.min(100, this.currentStats.success + impact.success))
      this.currentStats.growth = Math.max(0, Math.min(100, this.currentStats.growth + impact.growth))
      this.currentStats.experience = Math.max(0, this.currentStats.experience + impact.experience)
    },

    // 根据个性生成场景
    getScenariosByPersonality(): VirtualScenario[] {
      const { riskTolerance, creativity, focusArea } = this.aiPersonality

      const baseScenarios: VirtualScenario[] = [
        {
          id: 201,
          title: '职业发展机会',
          description: '你收到了一个新的工作机会，薪资比现在高30%，但需要搬到另一个城市，离开现在的朋友圈。',
          category: 'Career',
          choices: [
            {
              id: 1,
              text: '接受新工作，勇敢迎接挑战',
              impact: { happiness: -10, success: +20, growth: +15, experience: +120 },
              probability: riskTolerance > 60 ? 0.8 : 0.4
            },
            {
              id: 2,
              text: '留在现在的工作，寻求内部晋升',
              impact: { happiness: +5, success: +8, growth: +5, experience: +60 },
              probability: riskTolerance < 40 ? 0.8 : 0.6
            },
            {
              id: 3,
              text: '与新公司谈判远程工作',
              impact: { happiness: +15, success: +12, growth: +10, experience: +90 },
              probability: creativity > 70 ? 0.7 : 0.3
            }
          ],
          aiInsight: `基于你${riskTolerance}%的风险承受度，建议${riskTolerance > 60 ? '勇敢尝试新机会' : '谨慎评估风险'}。`,
          difficulty: 7
        },
        {
          id: 202,
          title: '投资理财决策',
          description: '你有一笔闲钱，朋友推荐了几种投资方式：股票、基金、房产或创业投资。',
          category: 'Finance',
          choices: [
            {
              id: 1,
              text: '投资股票，追求高收益',
              impact: { happiness: +5, success: +15, growth: +8, experience: +80 },
              probability: riskTolerance > 70 ? 0.8 : 0.3
            },
            {
              id: 2,
              text: '购买稳健基金',
              impact: { happiness: +10, success: +8, growth: +5, experience: +50 },
              probability: riskTolerance < 50 ? 0.9 : 0.6
            },
            {
              id: 3,
              text: '投资朋友的创业项目',
              impact: { happiness: +8, success: +20, growth: +15, experience: +100 },
              probability: creativity > 60 ? 0.6 : 0.2
            }
          ],
          aiInsight: `考虑到你的风险偏好，${riskTolerance > 60 ? '可以考虑一些高风险高收益的投资' : '建议选择稳健的投资方式'}。`,
          difficulty: 6
        },
        {
          id: 203,
          title: '学习新技能',
          description: '你想提升自己，有几个学习方向：编程、设计、语言或管理技能。',
          category: 'Learning',
          choices: [
            {
              id: 1,
              text: '学习前沿编程技术',
              impact: { happiness: +12, success: +18, growth: +20, experience: +100 },
              probability: focusArea === 'career' ? 0.9 : 0.6
            },
            {
              id: 2,
              text: '学习新的外语',
              impact: { happiness: +15, success: +10, growth: +15, experience: +80 },
              probability: creativity > 50 ? 0.8 : 0.5
            },
            {
              id: 3,
              text: '提升管理和领导力',
              impact: { happiness: +8, success: +22, growth: +12, experience: +90 },
              probability: focusArea === 'career' ? 0.8 : 0.4
            }
          ],
          aiInsight: `基于你的专注领域${focusArea}，建议选择能最大化个人发展的技能。`,
          difficulty: 5
        },
        {
          id: 204,
          title: '人际关系挑战',
          description: '你和一个重要的朋友发生了误解，关系变得紧张。你需要决定如何处理这个情况。',
          category: 'Relationships',
          choices: [
            {
              id: 1,
              text: '主动道歉并解释误解',
              impact: { happiness: +20, success: +5, growth: +10, experience: +70 },
              probability: 0.8
            },
            {
              id: 2,
              text: '给彼此一些时间冷静',
              impact: { happiness: -5, success: 0, growth: +5, experience: +30 },
              probability: 0.6
            },
            {
              id: 3,
              text: '通过共同朋友调解',
              impact: { happiness: +10, success: +8, growth: +8, experience: +50 },
              probability: creativity > 60 ? 0.7 : 0.4
            }
          ],
          aiInsight: '人际关系是幸福感的重要来源，建议积极主动地解决冲突。',
          difficulty: 4
        },
        {
          id: 205,
          title: '健康生活选择',
          description: '你意识到需要改善生活方式，有几个选择：健身、饮食调整、作息规律或心理健康。',
          category: 'Health',
          choices: [
            {
              id: 1,
              text: '制定严格的健身计划',
              impact: { happiness: +15, success: +10, growth: +18, experience: +80 },
              probability: 0.7
            },
            {
              id: 2,
              text: '调整饮食结构，健康饮食',
              impact: { happiness: +12, success: +8, growth: +12, experience: +60 },
              probability: 0.8
            },
            {
              id: 3,
              text: '改善睡眠和作息规律',
              impact: { happiness: +18, success: +12, growth: +10, experience: +70 },
              probability: 0.9
            }
          ],
          aiInsight: '健康是一切的基础，建议从最容易坚持的方面开始改善。',
          difficulty: 3
        }
      ]

      // 根据专注领域过滤和调整场景
      return baseScenarios.filter(scenario => {
        if (focusArea === 'career') return ['Career', 'Learning'].includes(scenario.category)
        if (focusArea === 'relationships') return ['Relationships', 'Health'].includes(scenario.category)
        if (focusArea === 'health') return ['Health', 'Learning'].includes(scenario.category)
        return true // balanced - 返回所有场景
      })
    },

    // 分析生活模式
    analyzeLifePatterns(events: any[]) {
      const categories = events.reduce((acc, event) => {
        acc[event.category] = (acc[event.category] || 0) + 1
        return acc
      }, {})

      const emotions = events.reduce((acc, event) => {
        if (event.emotion) {
          acc[event.emotion] = (acc[event.emotion] || 0) + 1
        }
        return acc
      }, {})

      const avgImportance = events.reduce((sum, event) => sum + (event.importance || 5), 0) / events.length

      return {
        mostFrequentCategory: Object.keys(categories).reduce((a, b) => categories[a] > categories[b] ? a : b),
        mostFrequentEmotion: Object.keys(emotions).reduce((a, b) => emotions[a] > emotions[b] ? a : b, 'neutral'),
        averageImportance: avgImportance,
        totalEvents: events.length
      }
    },

    // 基于分析生成场景
    generateScenarioBasedOnAnalysis(analysis: any): VirtualScenario {
      const scenarios = {
        Work: {
          id: 301,
          title: '工作效率提升挑战',
          description: `基于你最近的工作事件分析，你在工作方面投入很多精力。现在有机会通过新的方法论来提升工作效率。`,
          category: 'Work',
          choices: [
            {
              id: 1,
              text: '学习时间管理技巧',
              impact: { happiness: +10, success: +15, growth: +12, experience: +80 },
              probability: 0.8
            },
            {
              id: 2,
              text: '引入自动化工具',
              impact: { happiness: +8, success: +20, growth: +15, experience: +100 },
              probability: 0.6
            },
            {
              id: 3,
              text: '重新规划工作优先级',
              impact: { happiness: +15, success: +12, growth: +8, experience: +60 },
              probability: 0.9
            }
          ],
          aiInsight: '基于你的工作模式分析，建议优化工作流程以获得更好的工作生活平衡。',
          difficulty: 5
        },
        Personal: {
          id: 302,
          title: '个人发展规划',
          description: `你在个人发展方面很活跃。现在是时候制定一个更系统的个人成长计划了。`,
          category: 'Personal',
          choices: [
            {
              id: 1,
              text: '制定5年人生规划',
              impact: { happiness: +12, success: +18, growth: +20, experience: +120 },
              probability: 0.7
            },
            {
              id: 2,
              text: '专注当下的技能提升',
              impact: { happiness: +15, success: +12, growth: +15, experience: +80 },
              probability: 0.8
            },
            {
              id: 3,
              text: '寻找人生导师',
              impact: { happiness: +10, success: +15, growth: +25, experience: +100 },
              probability: 0.6
            }
          ],
          aiInsight: '你的个人发展意识很强，建议制定更具体的成长目标。',
          difficulty: 6
        }
      }

      const categoryScenario = scenarios[analysis.mostFrequentCategory as keyof typeof scenarios]
      return categoryScenario || scenarios.Work
    },

    // 保存到本地存储
    saveToLocalStorage() {
      const data = {
        currentStats: this.currentStats,
        decisions: this.decisions,
        aiPersonality: this.aiPersonality
      }
      localStorage.setItem('virtualLifeData', JSON.stringify(data))
    },

    // 从本地存储加载
    loadFromLocalStorage() {
      const data = localStorage.getItem('virtualLifeData')
      if (data) {
        try {
          const parsed = JSON.parse(data)
          this.currentStats = parsed.currentStats || DEMO_VIRTUAL_STATS
          this.decisions = parsed.decisions || DEMO_VIRTUAL_DECISIONS
          this.aiPersonality = parsed.aiPersonality || DEMO_AI_PERSONALITY
        } catch (error) {
          console.error('Failed to load virtual life data:', error)
        }
      }
    },

    // 重置为Demo数据
    resetToDemoData() {
      this.currentStats = { ...DEMO_VIRTUAL_STATS }
      this.decisions = [...DEMO_VIRTUAL_DECISIONS]
      this.aiPersonality = { ...DEMO_AI_PERSONALITY }
      this.saveToLocalStorage()
    },

    // 清除错误
    clearError() {
      this.error = null
    }
  }
})

