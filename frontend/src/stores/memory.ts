import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 回忆记录器数据类型定义
export interface Memory {
  id: string
  title: string
  content: string
  type: 'text' | 'image' | 'audio' | 'video' | 'mixed'
  mediaFiles: MediaFile[]
  emotions: EmotionAnalysis
  location?: LocationInfo
  tags: string[]
  category: string
  importance: number // 1-10
  createdAt: Date
  updatedAt: Date
  isPrivate: boolean
  weather?: WeatherInfo
  companions?: string[]
}

export interface MediaFile {
  id: string
  type: 'image' | 'audio' | 'video'
  url: string
  filename: string
  size: number
  duration?: number // for audio/video
  thumbnail?: string // for video
  metadata?: Record<string, any>
}

export interface EmotionAnalysis {
  primary: string // 主要情感
  secondary?: string // 次要情感
  intensity: number // 情感强度 1-10
  confidence: number // AI分析置信度 0-1
  keywords: string[] // 情感关键词
  sentiment: 'positive' | 'negative' | 'neutral'
}

export interface LocationInfo {
  latitude: number
  longitude: number
  address: string
  city: string
  country: string
  venue?: string // 具体场所名称
  accuracy: number
}

export interface WeatherInfo {
  temperature: number
  condition: string
  humidity: number
  description: string
}

export interface MemoryFilter {
  dateRange?: {
    start: Date
    end: Date
  }
  emotions?: string[]
  categories?: string[]
  types?: string[]
  locations?: string[]
  tags?: string[]
  importance?: {
    min: number
    max: number
  }
}

export interface MemoryStats {
  totalMemories: number
  memoriesByType: Record<string, number>
  memoriesByEmotion: Record<string, number>
  memoriesByCategory: Record<string, number>
  averageImportance: number
  mostActiveMonth: string
  emotionalTrend: Array<{
    date: string
    sentiment: number
  }>
}

export const useMemoryStore = defineStore('memory', () => {
  // 状态
  const memories = ref<Memory[]>([])
  const isLoading = ref(false)
  const error = ref('')
  const currentFilter = ref<MemoryFilter>({})
  const selectedMemory = ref<Memory | null>(null)
  
  // 计算属性
  const filteredMemories = computed(() => {
    let result = memories.value
    
    if (currentFilter.value.dateRange) {
      const { start, end } = currentFilter.value.dateRange
      result = result.filter(memory => {
        const date = new Date(memory.createdAt)
        return date >= start && date <= end
      })
    }
    
    if (currentFilter.value.emotions?.length) {
      result = result.filter(memory => 
        currentFilter.value.emotions!.includes(memory.emotions.primary) ||
        (memory.emotions.secondary && currentFilter.value.emotions!.includes(memory.emotions.secondary))
      )
    }
    
    if (currentFilter.value.categories?.length) {
      result = result.filter(memory => 
        currentFilter.value.categories!.includes(memory.category)
      )
    }
    
    if (currentFilter.value.types?.length) {
      result = result.filter(memory => 
        currentFilter.value.types!.includes(memory.type)
      )
    }
    
    if (currentFilter.value.tags?.length) {
      result = result.filter(memory => 
        memory.tags.some(tag => currentFilter.value.tags!.includes(tag))
      )
    }
    
    if (currentFilter.value.importance) {
      const { min, max } = currentFilter.value.importance
      result = result.filter(memory => 
        memory.importance >= min && memory.importance <= max
      )
    }
    
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  })
  
  const memoryStats = computed((): MemoryStats => {
    const total = memories.value.length
    
    const byType = memories.value.reduce((acc, memory) => {
      acc[memory.type] = (acc[memory.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const byEmotion = memories.value.reduce((acc, memory) => {
      acc[memory.emotions.primary] = (acc[memory.emotions.primary] || 0) + 1
      if (memory.emotions.secondary) {
        acc[memory.emotions.secondary] = (acc[memory.emotions.secondary] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)
    
    const byCategory = memories.value.reduce((acc, memory) => {
      acc[memory.category] = (acc[memory.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const avgImportance = total > 0 
      ? memories.value.reduce((sum, memory) => sum + memory.importance, 0) / total 
      : 0
    
    // 计算最活跃月份
    const monthCounts = memories.value.reduce((acc, memory) => {
      const month = new Date(memory.createdAt).toISOString().slice(0, 7)
      acc[month] = (acc[month] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const mostActiveMonth = Object.entries(monthCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || ''
    
    // 计算情感趋势
    const emotionalTrend = memories.value
      .map(memory => ({
        date: new Date(memory.createdAt).toISOString().slice(0, 10),
        sentiment: memory.emotions.sentiment === 'positive' ? 1 : 
                  memory.emotions.sentiment === 'negative' ? -1 : 0
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
    
    return {
      totalMemories: total,
      memoriesByType: byType,
      memoriesByEmotion: byEmotion,
      memoriesByCategory: byCategory,
      averageImportance: avgImportance,
      mostActiveMonth,
      emotionalTrend
    }
  })
  
  const recentMemories = computed(() => 
    memories.value
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)
  )
  
  const topEmotions = computed(() => 
    Object.entries(memoryStats.value.memoriesByEmotion)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([emotion, count]) => ({ emotion, count }))
  )
  
  // Actions
  const createMemory = async (memoryData: Omit<Memory, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      isLoading.value = true
      error.value = ''
      
      const newMemory: Memory = {
        ...memoryData,
        id: generateId(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      // 如果有文本内容，进行情感分析
      if (memoryData.content) {
        newMemory.emotions = await analyzeEmotion(memoryData.content)
      }
      
      // 如果有地理位置权限，获取当前位置
      if (navigator.geolocation && !memoryData.location) {
        try {
          const position = await getCurrentPosition()
          newMemory.location = await reverseGeocode(position.coords.latitude, position.coords.longitude)
        } catch (err) {
          console.warn('无法获取地理位置:', err)
        }
      }
      
      // 获取天气信息
      if (newMemory.location) {
        try {
          newMemory.weather = await getWeatherInfo(newMemory.location.latitude, newMemory.location.longitude)
        } catch (err) {
          console.warn('无法获取天气信息:', err)
        }
      }
      
      memories.value.unshift(newMemory)
      
      return { success: true, memory: newMemory }
    } catch (err: any) {
      error.value = err.message || '创建回忆失败'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }
  
  const updateMemory = async (id: string, updates: Partial<Memory>) => {
    try {
      isLoading.value = true
      error.value = ''
      
      const index = memories.value.findIndex(memory => memory.id === id)
      if (index === -1) {
        throw new Error('回忆不存在')
      }
      
      const updatedMemory = {
        ...memories.value[index],
        ...updates,
        updatedAt: new Date()
      }
      
      // 如果更新了内容，重新分析情感
      if (updates.content && updates.content !== memories.value[index].content) {
        updatedMemory.emotions = await analyzeEmotion(updates.content)
      }
      
      memories.value[index] = updatedMemory
      
      return { success: true, memory: updatedMemory }
    } catch (err: any) {
      error.value = err.message || '更新回忆失败'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }
  
  const deleteMemory = async (id: string) => {
    try {
      isLoading.value = true
      error.value = ''
      
      const index = memories.value.findIndex(memory => memory.id === id)
      if (index === -1) {
        throw new Error('回忆不存在')
      }
      
      memories.value.splice(index, 1)
      
      if (selectedMemory.value?.id === id) {
        selectedMemory.value = null
      }
      
      return { success: true }
    } catch (err: any) {
      error.value = err.message || '删除回忆失败'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }
  
  const uploadMediaFile = async (file: File): Promise<MediaFile> => {
    // 模拟文件上传
    return new Promise((resolve) => {
      setTimeout(() => {
        const mediaFile: MediaFile = {
          id: generateId(),
          type: file.type.startsWith('image/') ? 'image' : 
                file.type.startsWith('audio/') ? 'audio' : 'video',
          url: URL.createObjectURL(file),
          filename: file.name,
          size: file.size,
          metadata: {
            lastModified: file.lastModified,
            type: file.type
          }
        }
        
        if (file.type.startsWith('video/')) {
          // 为视频生成缩略图
          mediaFile.thumbnail = generateVideoThumbnail(file)
        }
        
        resolve(mediaFile)
      }, 1000)
    })
  }
  
  const setFilter = (filter: MemoryFilter) => {
    currentFilter.value = filter
  }
  
  const clearFilter = () => {
    currentFilter.value = {}
  }
  
  const selectMemory = (memory: Memory | null) => {
    selectedMemory.value = memory
  }
  
  const searchMemories = (query: string) => {
    if (!query.trim()) return filteredMemories.value
    
    const lowerQuery = query.toLowerCase()
    return filteredMemories.value.filter(memory => 
      memory.title.toLowerCase().includes(lowerQuery) ||
      memory.content.toLowerCase().includes(lowerQuery) ||
      memory.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
      memory.category.toLowerCase().includes(lowerQuery) ||
      memory.emotions.keywords.some(keyword => keyword.toLowerCase().includes(lowerQuery))
    )
  }
  
  const getMemoriesByTimeRange = (days: number) => {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)
    
    return memories.value.filter(memory => 
      new Date(memory.createdAt) >= cutoffDate
    )
  }
  
  const exportMemories = (format: 'json' | 'csv' = 'json') => {
    if (format === 'json') {
      return JSON.stringify(memories.value, null, 2)
    } else {
      // CSV导出逻辑
      const headers = ['标题', '内容', '类型', '情感', '重要性', '创建时间', '标签']
      const rows = memories.value.map(memory => [
        memory.title,
        memory.content.replace(/\n/g, ' '),
        memory.type,
        memory.emotions.primary,
        memory.importance,
        memory.createdAt.toISOString(),
        memory.tags.join(';')
      ])
      
      return [headers, ...rows].map(row => row.join(',')).join('\n')
    }
  }
  
  // 辅助函数
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }
  
  const analyzeEmotion = async (text: string): Promise<EmotionAnalysis> => {
    // 模拟AI情感分析
    return new Promise((resolve) => {
      setTimeout(() => {
        const emotions = ['快乐', '悲伤', '愤怒', '恐惧', '惊讶', '厌恶', '平静', '兴奋', '焦虑', '满足']
        const keywords = text.split(/\s+/).filter(word => word.length > 1)
        
        // 简单的情感分析逻辑
        let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral'
        let primary = '平静'
        let intensity = 5
        
        const positiveWords = ['开心', '快乐', '兴奋', '满足', '成功', '美好', '棒', '好']
        const negativeWords = ['难过', '悲伤', '愤怒', '失望', '糟糕', '痛苦', '困难']
        
        const hasPositive = positiveWords.some(word => text.includes(word))
        const hasNegative = negativeWords.some(word => text.includes(word))
        
        if (hasPositive && !hasNegative) {
          sentiment = 'positive'
          primary = '快乐'
          intensity = 7
        } else if (hasNegative && !hasPositive) {
          sentiment = 'negative'
          primary = '悲伤'
          intensity = 6
        } else if (hasPositive && hasNegative) {
          primary = '复杂'
          intensity = 5
        }
        
        resolve({
          primary,
          intensity,
          confidence: 0.8,
          keywords: keywords.slice(0, 5),
          sentiment
        })
      }, 500)
    })
  }
  
  const getCurrentPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      })
    })
  }
  
  const reverseGeocode = async (lat: number, lng: number): Promise<LocationInfo> => {
    // 模拟反向地理编码
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          latitude: lat,
          longitude: lng,
          address: '模拟地址',
          city: '北京市',
          country: '中国',
          accuracy: 10
        })
      }, 1000)
    })
  }
  
  const getWeatherInfo = async (lat: number, lng: number): Promise<WeatherInfo> => {
    // 模拟天气API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          temperature: 22,
          condition: 'sunny',
          humidity: 65,
          description: '晴朗'
        })
      }, 800)
    })
  }
  
  const generateVideoThumbnail = (file: File): string => {
    // 模拟视频缩略图生成
    return URL.createObjectURL(file)
  }
  
  // 初始化演示数据
  const loadDemoMemories = () => {
    const demoMemories: Memory[] = [
      {
        id: '1',
        title: '美好的周末时光',
        content: '今天和朋友们一起去公园野餐，天气很好，心情特别愉快。我们聊了很多有趣的话题，还拍了很多照片。',
        type: 'mixed',
        mediaFiles: [],
        emotions: {
          primary: '快乐',
          intensity: 8,
          confidence: 0.9,
          keywords: ['朋友', '野餐', '愉快', '有趣'],
          sentiment: 'positive'
        },
        location: {
          latitude: 39.9042,
          longitude: 116.4074,
          address: '北京市朝阳区朝阳公园',
          city: '北京市',
          country: '中国',
          venue: '朝阳公园',
          accuracy: 5
        },
        tags: ['朋友', '户外', '周末'],
        category: '社交',
        importance: 7,
        createdAt: new Date('2024-06-15T14:30:00'),
        updatedAt: new Date('2024-06-15T14:30:00'),
        isPrivate: false,
        weather: {
          temperature: 25,
          condition: 'sunny',
          humidity: 60,
          description: '晴朗'
        },
        companions: ['小明', '小红', '小李']
      },
      {
        id: '2',
        title: '工作上的小成就',
        content: '今天完成了一个重要的项目，老板表扬了我的工作。虽然过程很辛苦，但结果很令人满意。',
        type: 'text',
        mediaFiles: [],
        emotions: {
          primary: '满足',
          secondary: '自豪',
          intensity: 7,
          confidence: 0.85,
          keywords: ['项目', '表扬', '满意', '成就'],
          sentiment: 'positive'
        },
        tags: ['工作', '成就', '项目'],
        category: '职业',
        importance: 8,
        createdAt: new Date('2024-06-14T18:00:00'),
        updatedAt: new Date('2024-06-14T18:00:00'),
        isPrivate: false
      },
      {
        id: '3',
        title: '雨天的思考',
        content: '下雨的午后，坐在咖啡厅里看书，突然想起了很多往事。有些怀念，有些感慨。',
        type: 'text',
        mediaFiles: [],
        emotions: {
          primary: '怀念',
          intensity: 6,
          confidence: 0.75,
          keywords: ['雨天', '咖啡厅', '往事', '怀念'],
          sentiment: 'neutral'
        },
        tags: ['思考', '雨天', '咖啡厅'],
        category: '个人',
        importance: 5,
        createdAt: new Date('2024-06-13T15:20:00'),
        updatedAt: new Date('2024-06-13T15:20:00'),
        isPrivate: true
      }
    ]
    
    memories.value = demoMemories
  }
  
  return {
    // 状态
    memories,
    isLoading,
    error,
    currentFilter,
    selectedMemory,
    
    // 计算属性
    filteredMemories,
    memoryStats,
    recentMemories,
    topEmotions,
    
    // Actions
    createMemory,
    updateMemory,
    deleteMemory,
    uploadMediaFile,
    setFilter,
    clearFilter,
    selectMemory,
    searchMemories,
    getMemoriesByTimeRange,
    exportMemories,
    loadDemoMemories
  }
})

