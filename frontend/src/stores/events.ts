import { defineStore } from 'pinia'
import { ref } from 'vue'
import { eventAPI } from '@/services/api'

export interface Event {
  id?: number
  title: string
  description?: string
  category: string
  eventDate: string
  emotion?: string
  importance?: number
  location?: string
  impact?: string
  userId?: number
  createdAt?: string
  updatedAt?: string
}

export const useEventStore = defineStore('events', () => {
  const events = ref<Event[]>([])
  const isLoading = ref(false)
  const error = ref('')

  // 获取所有事件
  const fetchEvents = async () => {
    try {
      isLoading.value = true
      error.value = ''
      
      const response = await eventAPI.getEvents()
      
      if (response.success) {
        events.value = response.events || []
        return { success: true }
      } else {
        error.value = response.error || 'Failed to fetch events'
        return { success: false, error: error.value }
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch events'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // 获取特定事件
  const fetchEvent = async (eventId: number) => {
    try {
      const response = await eventAPI.getEvent(eventId)
      
      if (response.success) {
        return { success: true, event: response.event }
      } else {
        return { success: false, error: response.error }
      }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }

  // 创建事件
  const createEvent = async (eventData: Omit<Event, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    try {
      isLoading.value = true
      error.value = ''
      
      const response = await eventAPI.createEvent(eventData)
      
      if (response.success) {
        // 添加到本地事件列表
        events.value.unshift(response.event)
        return { success: true, event: response.event }
      } else {
        error.value = response.error || 'Failed to create event'
        return { success: false, error: error.value }
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to create event'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // 更新事件
  const updateEvent = async (eventId: number, eventData: Omit<Event, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    try {
      isLoading.value = true
      error.value = ''
      
      const response = await eventAPI.updateEvent(eventId, eventData)
      
      if (response.success) {
        // 更新本地事件列表
        const index = events.value.findIndex(event => event.id === eventId)
        if (index !== -1) {
          events.value[index] = response.event
        }
        return { success: true, event: response.event }
      } else {
        error.value = response.error || 'Failed to update event'
        return { success: false, error: error.value }
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to update event'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // 删除事件
  const deleteEvent = async (eventId: number) => {
    try {
      isLoading.value = true
      error.value = ''
      
      const response = await eventAPI.deleteEvent(eventId)
      
      if (response.success) {
        // 从本地事件列表中移除
        events.value = events.value.filter(event => event.id !== eventId)
        return { success: true }
      } else {
        error.value = response.error || 'Failed to delete event'
        return { success: false, error: error.value }
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to delete event'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // 按分类获取事件
  const fetchEventsByCategory = async (category: string) => {
    try {
      const response = await eventAPI.getEventsByCategory(category)
      
      if (response.success) {
        return { success: true, events: response.events }
      } else {
        return { success: false, error: response.error }
      }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }

  // 搜索事件
  const searchEvents = async (keyword: string) => {
    try {
      const response = await eventAPI.searchEvents(keyword)
      
      if (response.success) {
        return { success: true, events: response.events }
      } else {
        return { success: false, error: response.error }
      }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }

  // 获取事件数量
  const fetchEventCount = async () => {
    try {
      const response = await eventAPI.getEventCount()
      
      if (response.success) {
        return { success: true, count: response.count }
      } else {
        return { success: false, error: response.error }
      }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }

  // 按日期范围获取事件
  const fetchEventsByDateRange = async (startDate: string, endDate: string) => {
    try {
      const response = await eventAPI.getEventsByDateRange(startDate, endDate)
      
      if (response.success) {
        return { success: true, events: response.events }
      } else {
        return { success: false, error: response.error }
      }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }

  // 清除错误
  const clearError = () => {
    error.value = ''
  }

  // 重置为Demo数据
  const resetToDemoData = async () => {
    isLoading.value = true
    error.value = ''

    try {
      const response = await eventAPI.resetToDemoData()
      
      if (response.success) {
        // 重新获取事件列表
        await fetchEvents()
        return { success: true }
      } else {
        throw new Error('Failed to reset demo data')
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to reset demo data'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 重置store
  const reset = () => {
    events.value = []
    isLoading.value = false
    error.value = ''
  }

  return {
    events,
    isLoading,
    error,
    fetchEvents,
    fetchEvent,
    createEvent,
    updateEvent,
    deleteEvent,
    fetchEventsByCategory,
    searchEvents,
    fetchEventCount,
    fetchEventsByDateRange,
    clearError,
    resetToDemoData,
    reset
  }
})

