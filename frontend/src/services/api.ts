import axios from 'axios'

// API基础配置 - 使用模拟模式
const API_BASE_URL = 'http://localhost:10000/api'
const MOCK_MODE = true // 启用模拟模式

// Demo账号数据
const DEMO_USER = {
  id: 999999,
  username: 'demo_user',
  email: 'demo@dualtracklife.com',
  fullName: 'Demo User',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: new Date().toISOString()
}

// Demo事件数据 - 丰富的真实生活场景
const DEMO_EVENTS = [
  // 最近的事件
  {
    id: 1001,
    userId: 999999,
    title: '完成了一个重要的项目演示',
    description: '经过三个月的努力，终于在公司年度会议上成功展示了我们团队的创新项目。获得了CEO的认可和同事们的掌声。',
    category: 'Work',
    eventDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    emotion: 'excited',
    importance: 9,
    location: '公司总部会议室',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 1002,
    userId: 999999,
    title: '和老朋友重聚',
    description: '大学室友来城市出差，我们在老地方的咖啡厅聊了整个下午。回忆起大学时光，感慨时间过得真快。',
    category: 'Relationships',
    eventDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    emotion: 'happy',
    importance: 8,
    location: '星巴克咖啡厅',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 1003,
    userId: 999999,
    title: '开始学习新的编程语言',
    description: '决定学习Rust编程语言来提升技术栈。购买了相关书籍，制定了学习计划，每天晚上学习2小时。',
    category: 'Learning',
    eventDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    emotion: 'excited',
    importance: 7,
    location: '家里书房',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 1004,
    userId: 999999,
    title: '参加了马拉松比赛',
    description: '人生第一次参加半程马拉松，虽然成绩不理想，但完成了挑战。感受到了运动的魅力和坚持的力量。',
    category: 'Health',
    eventDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    emotion: 'grateful',
    importance: 8,
    location: '城市体育公园',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 1005,
    userId: 999999,
    title: '投资理财获得收益',
    description: '之前投资的基金终于有了不错的回报，虽然不多但是验证了我的投资策略。决定继续学习理财知识。',
    category: 'Finance',
    eventDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    emotion: 'happy',
    importance: 6,
    location: '家里',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  // 上个月的事件
  {
    id: 1006,
    userId: 999999,
    title: '周末去爬山',
    description: '和朋友们一起去附近的山区徒步，呼吸新鲜空气，欣赏美丽的风景。拍了很多照片，心情特别舒畅。',
    category: 'Entertainment',
    eventDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    emotion: 'happy',
    importance: 7,
    location: '青山国家森林公园',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 1007,
    userId: 999999,
    title: '工作压力有点大',
    description: '最近项目进度紧张，经常加班到很晚。虽然有压力但也在快速成长，学到了很多新技能。',
    category: 'Work',
    eventDate: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    emotion: 'stressed',
    importance: 6,
    location: '公司办公室',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 1008,
    userId: 999999,
    title: '参加了读书会',
    description: '加入了一个线下读书会，这个月读的是《人类简史》。和大家分享读后感，听到了很多不同的观点。',
    category: 'Learning',
    eventDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    emotion: 'excited',
    importance: 7,
    location: '市图书馆',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 1009,
    userId: 999999,
    title: '体检结果出来了',
    description: '年度体检结果基本正常，但医生建议要多运动，少熬夜。决定制定更健康的生活作息。',
    category: 'Health',
    eventDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    emotion: 'neutral',
    importance: 8,
    location: '市中心医院',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 1010,
    userId: 999999,
    title: '看了一场精彩的音乐会',
    description: '去音乐厅听了交响乐演出，被美妙的音乐深深感动。决定以后要多参加这样的文化活动。',
    category: 'Entertainment',
    eventDate: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
    emotion: 'grateful',
    importance: 7,
    location: '国家大剧院',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  // 更早的事件
  {
    id: 1011,
    userId: 999999,
    title: '搬到了新公寓',
    description: '终于搬到了心仪的新公寓，虽然房租贵了一些，但环境和交通都更好。开始了新的生活阶段。',
    category: 'Personal',
    eventDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    emotion: 'excited',
    importance: 9,
    location: '市中心新公寓',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 1012,
    userId: 999999,
    title: '学会了做意大利面',
    description: '跟着YouTube视频学做意大利面，第一次尝试就很成功。朋友们都说很好吃，很有成就感。',
    category: 'Personal',
    eventDate: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
    emotion: 'happy',
    importance: 5,
    location: '家里厨房',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 1013,
    userId: 999999,
    title: '获得了工作晋升',
    description: '经过一年的努力，终于获得了晋升机会。新的职位意味着更多的责任和挑战，但也有更好的发展前景。',
    category: 'Work',
    eventDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    emotion: 'excited',
    importance: 10,
    location: '公司HR办公室',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 1014,
    userId: 999999,
    title: '开始了新的健身计划',
    description: '办了健身房会员卡，制定了详细的健身计划。目标是在半年内减重10公斤，增强体质。',
    category: 'Health',
    eventDate: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
    emotion: 'excited',
    importance: 8,
    location: '社区健身房',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 1015,
    userId: 999999,
    title: '和家人一起旅行',
    description: '和父母一起去了三亚度假，享受了难得的家庭时光。在海边散步，品尝当地美食，拍了很多合影。',
    category: 'Travel',
    eventDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    emotion: 'grateful',
    importance: 9,
    location: '三亚海滩',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

// 模拟数据存储
const mockStorage = {
  users: JSON.parse(localStorage.getItem('mockUsers') || '[]'),
  events: JSON.parse(localStorage.getItem('mockEvents') || '[]'),
  currentUserId: null as number | null
}

// 初始化Demo数据
const initializeDemoData = () => {
  // 检查是否已经有demo用户
  const existingDemoUser = mockStorage.users.find((user: any) => user.id === DEMO_USER.id)
  if (!existingDemoUser) {
    mockStorage.users.push(DEMO_USER)
  }
  
  // 检查是否已经有demo事件
  const existingDemoEvents = mockStorage.events.filter((event: any) => event.userId === DEMO_USER.id)
  if (existingDemoEvents.length === 0) {
    mockStorage.events.push(...DEMO_EVENTS)
  }
  
  saveMockData()
}

// 保存模拟数据到localStorage
const saveMockData = () => {
  localStorage.setItem('mockUsers', JSON.stringify(mockStorage.users))
  localStorage.setItem('mockEvents', JSON.stringify(mockStorage.events))
}

// 初始化demo数据
initializeDemoData()

// 模拟API响应
const mockAPI = {
  // 用户注册
  register: async (userData: {
    username: string
    email: string
    password: string
    fullName?: string
  }) => {
    await new Promise(resolve => setTimeout(resolve, 1000)) // 模拟网络延迟
    
    // 检查用户是否已存在
    const existingUser = mockStorage.users.find(
      (user: any) => user.username === userData.username || user.email === userData.email
    )
    
    if (existingUser) {
      throw new Error('Username or email already exists')
    }
    
    // 创建新用户
    const newUser = {
      id: Date.now(),
      username: userData.username,
      email: userData.email,
      fullName: userData.fullName || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    mockStorage.users.push(newUser)
    mockStorage.currentUserId = newUser.id
    saveMockData()
    
    // 生成模拟token
    const token = `mock_token_${newUser.id}_${Date.now()}`
    
    return {
      success: true,
      token,
      user: newUser
    }
  },

  // 用户登录
  login: async (credentials: { username: string; password: string }) => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 查找用户
    const user = mockStorage.users.find(
      (u: any) => u.username === credentials.username || u.email === credentials.username
    )
    
    if (!user) {
      throw new Error('Invalid username or password')
    }
    
    mockStorage.currentUserId = user.id
    
    // 生成模拟token
    const token = `mock_token_${user.id}_${Date.now()}`
    
    return {
      success: true,
      token,
      user
    }
  },

  // Demo登录
  demoLogin: async () => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    mockStorage.currentUserId = DEMO_USER.id
    
    // 生成模拟token
    const token = `mock_token_${DEMO_USER.id}_${Date.now()}`
    
    return {
      success: true,
      token,
      user: DEMO_USER
    }
  },

  // 获取用户信息
  getProfile: async () => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (!mockStorage.currentUserId) {
      throw new Error('User not authenticated')
    }
    
    const user = mockStorage.users.find((u: any) => u.id === mockStorage.currentUserId)
    if (!user) {
      throw new Error('User not found')
    }
    
    return {
      success: true,
      user
    }
  },

  // 获取事件列表
  getEvents: async () => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (!mockStorage.currentUserId) {
      throw new Error('User not authenticated')
    }
    
    const userEvents = mockStorage.events.filter((event: any) => event.userId === mockStorage.currentUserId)
    
    return {
      success: true,
      events: userEvents.sort((a: any, b: any) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime())
    }
  },

  // 创建事件
  createEvent: async (eventData: any) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (!mockStorage.currentUserId) {
      throw new Error('User not authenticated')
    }
    
    const newEvent = {
      id: Date.now(),
      ...eventData,
      userId: mockStorage.currentUserId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    mockStorage.events.push(newEvent)
    saveMockData()
    
    return {
      success: true,
      event: newEvent
    }
  },

  // 更新事件
  updateEvent: async (eventId: number, eventData: any) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (!mockStorage.currentUserId) {
      throw new Error('User not authenticated')
    }
    
    const eventIndex = mockStorage.events.findIndex(
      (event: any) => event.id === eventId && event.userId === mockStorage.currentUserId
    )
    
    if (eventIndex === -1) {
      throw new Error('Event not found')
    }
    
    mockStorage.events[eventIndex] = {
      ...mockStorage.events[eventIndex],
      ...eventData,
      updatedAt: new Date().toISOString()
    }
    
    saveMockData()
    
    return {
      success: true,
      event: mockStorage.events[eventIndex]
    }
  },

  // 重置为Demo数据
  async resetToDemoData() {
    // 清除当前用户的所有事件
    if (mockStorage.currentUserId) {
      mockStorage.events = mockStorage.events.filter((event: any) => event.userId !== mockStorage.currentUserId)
      
      // 如果是demo用户，重新添加demo事件
      if (mockStorage.currentUserId === DEMO_USER.id) {
        mockStorage.events.push(...DEMO_EVENTS)
      }
      
      saveMockData()
    }
    
    return {
      success: true,
      message: 'Demo data reset successfully'
    }
  },

  // 删除事件
  deleteEvent: async (eventId: number) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (!mockStorage.currentUserId) {
      throw new Error('User not authenticated')
    }
    
    const eventIndex = mockStorage.events.findIndex(
      (event: any) => event.id === eventId && event.userId === mockStorage.currentUserId
    )
    
    if (eventIndex === -1) {
      throw new Error('Event not found')
    }
    
    mockStorage.events.splice(eventIndex, 1)
    saveMockData()
    
    return {
      success: true,
      message: 'Event deleted successfully'
    }
  }
}

// 创建axios实例
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器 - 添加认证token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      // 从token中提取用户ID（模拟模式）
      if (MOCK_MODE && token.startsWith('mock_token_')) {
        const userId = parseInt(token.split('_')[2])
        mockStorage.currentUserId = userId
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器 - 处理错误
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token过期或无效，清除本地存储并跳转到登录页
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      mockStorage.currentUserId = null
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// 认证API
export const authAPI = {
  // 用户注册
  register: async (userData: {
    username: string
    email: string
    password: string
    fullName?: string
  }) => {
    if (MOCK_MODE) {
      return await mockAPI.register(userData)
    }
    
    try {
      const response = await api.post('/auth/register', userData)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Registration failed')
    }
  },

  // 用户登录
  login: async (credentials: { username: string; password: string }) => {
    if (MOCK_MODE) {
      return await mockAPI.login(credentials)
    }
    
    try {
      const response = await api.post('/auth/login', credentials)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Login failed')
    }
  },

  // Demo登录
  demoLogin: async () => {
    if (MOCK_MODE) {
      return await mockAPI.demoLogin()
    }
    
    // 如果不是模拟模式，使用预设的demo账号登录
    return await mockAPI.login({ username: 'demo_user', password: 'demo123' })
  },

  // 获取用户信息
  getProfile: async () => {
    if (MOCK_MODE) {
      return await mockAPI.getProfile()
    }
    
    try {
      const response = await api.get('/auth/profile')
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to get profile')
    }
  },

  // 健康检查
  healthCheck: async () => {
    if (MOCK_MODE) {
      return {
        status: 'OK',
        message: 'Mock API is running',
        timestamp: Date.now()
      }
    }
    
    try {
      const response = await api.get('/auth/health')
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Health check failed')
    }
  }
}

// 事件API
export const eventAPI = {
  // 获取所有事件
  getEvents: async () => {
    if (MOCK_MODE) {
      return await mockAPI.getEvents()
    }
    
    try {
      const response = await api.get('/events')
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to get events')
    }
  },

  // 获取特定事件
  getEvent: async (eventId: number) => {
    if (MOCK_MODE) {
      const userEvents = mockStorage.events.filter((event: any) => event.userId === mockStorage.currentUserId)
      const event = userEvents.find((e: any) => e.id === eventId)
      if (!event) {
        throw new Error('Event not found')
      }
      return { success: true, event }
    }
    
    try {
      const response = await api.get(`/events/${eventId}`)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to get event')
    }
  },

  // 创建事件
  createEvent: async (eventData: {
    title: string
    description?: string
    category: string
    eventDate: string
    emotion?: string
    importance?: number
    location?: string
  }) => {
    if (MOCK_MODE) {
      return await mockAPI.createEvent(eventData)
    }
    
    try {
      const response = await api.post('/events', eventData)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to create event')
    }
  },

  // 更新事件
  updateEvent: async (eventId: number, eventData: {
    title: string
    description?: string
    category: string
    eventDate: string
    emotion?: string
    importance?: number
    location?: string
  }) => {
    if (MOCK_MODE) {
      return await mockAPI.updateEvent(eventId, eventData)
    }
    
    try {
      const response = await api.put(`/events/${eventId}`, eventData)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update event')
    }
  },

  // 删除事件
  deleteEvent: async (eventId: number) => {
    if (MOCK_MODE) {
      return await mockAPI.deleteEvent(eventId)
    }
    
    try {
      const response = await api.delete(`/events/${eventId}`)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to delete event')
    }
  },

  // 按分类获取事件
  getEventsByCategory: async (category: string) => {
    if (MOCK_MODE) {
      const userEvents = mockStorage.events.filter(
        (event: any) => event.userId === mockStorage.currentUserId && event.category === category
      )
      return { success: true, events: userEvents }
    }
    
    try {
      const response = await api.get(`/events/category/${category}`)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to get events by category')
    }
  },

  // 搜索事件
  searchEvents: async (keyword: string) => {
    if (MOCK_MODE) {
      const userEvents = mockStorage.events.filter((event: any) => 
        event.userId === mockStorage.currentUserId &&
        (event.title.toLowerCase().includes(keyword.toLowerCase()) ||
         (event.description && event.description.toLowerCase().includes(keyword.toLowerCase())))
      )
      return { success: true, events: userEvents }
    }
    
    try {
      const response = await api.get(`/events/search?keyword=${encodeURIComponent(keyword)}`)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to search events')
    }
  },

  // 获取事件数量
  getEventCount: async () => {
    if (MOCK_MODE) {
      const userEvents = mockStorage.events.filter((event: any) => event.userId === mockStorage.currentUserId)
      return { success: true, count: userEvents.length }
    }
    
    try {
      const response = await api.get('/events/count')
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to get event count')
    }
  },

  // 按日期范围获取事件
  getEventsByDateRange: async (startDate: string, endDate: string) => {
    if (MOCK_MODE) {
      const userEvents = mockStorage.events.filter((event: any) => 
        event.userId === mockStorage.currentUserId &&
        event.eventDate >= startDate &&
        event.eventDate <= endDate
      )
      return { success: true, events: userEvents }
    }
    
    try {
      const response = await api.get(`/events/date-range?startDate=${startDate}&endDate=${endDate}`)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to get events by date range')
    }
  },

  // 重置为Demo数据
  resetToDemoData: async () => {
    if (MOCK_MODE) {
      return await mockAPI.resetToDemoData()
    }
    
    throw new Error('Reset demo data is only available in mock mode')
  }
}

export default api

