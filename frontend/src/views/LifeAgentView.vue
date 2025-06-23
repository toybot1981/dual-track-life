<template>
  <div class="life-agent-view min-h-screen bg-gray-50">
    <!-- 页面头部 -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center space-x-4">
            <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Life Agent</h1>
              <p class="text-sm text-gray-600">智能人生助手</p>
            </div>
          </div>
          
          <div class="flex items-center space-x-4">
            <div class="text-sm text-gray-600">
              当前角色: <span class="font-medium text-blue-600">{{ currentRole?.roleName || '通用助手' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        <!-- 左侧功能面板 -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-sm border p-6 space-y-6">
            
            <!-- AI角色选择 -->
            <div>
              <h3 class="font-semibold text-gray-900 mb-3">AI角色选择</h3>
              <div class="space-y-2">
                <div 
                  v-for="role in availableRoles" 
                  :key="role.roleId"
                  @click="selectRole(role)"
                  :class="[
                    'p-3 border rounded-lg cursor-pointer transition-all',
                    currentRole?.roleId === role.roleId 
                      ? 'bg-blue-50 border-blue-300 text-blue-700' 
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  ]"
                >
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="font-medium text-sm">{{ role.roleName }}</p>
                      <p class="text-xs text-gray-600">{{ role.description }}</p>
                    </div>
                    <div v-if="currentRole?.roleId === role.roleId" class="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 功能快捷按钮 -->
            <div>
              <h3 class="font-semibold text-gray-900 mb-3">智能功能</h3>
              <div class="space-y-2">
                <button
                  @click="openEventAnalysis"
                  class="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                      </svg>
                    </div>
                    <div>
                      <p class="font-medium text-sm">事件分析</p>
                      <p class="text-xs text-gray-600">深度分析人生事件</p>
                    </div>
                  </div>
                </button>

                <button
                  @click="openTrajectoryAnalysis"
                  class="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                      </svg>
                    </div>
                    <div>
                      <p class="font-medium text-sm">轨迹分析</p>
                      <p class="text-xs text-gray-600">人生轨迹规划</p>
                    </div>
                  </div>
                </button>

                <button
                  @click="openPersonalizedAdvice"
                  class="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                      </svg>
                    </div>
                    <div>
                      <p class="font-medium text-sm">个性化建议</p>
                      <p class="text-xs text-gray-600">定制化指导方案</p>
                    </div>
                  </div>
                </button>

                <button
                  @click="openEmotionalSupport"
                  class="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                      <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                      </svg>
                    </div>
                    <div>
                      <p class="font-medium text-sm">情感支持</p>
                      <p class="text-xs text-gray-600">专业心理疏导</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <!-- 使用统计 -->
            <div>
              <h3 class="font-semibold text-gray-900 mb-3">使用统计</h3>
              <div class="space-y-2 text-sm text-gray-600">
                <div class="flex justify-between">
                  <span>今日对话</span>
                  <span class="font-medium">{{ todayChats }}</span>
                </div>
                <div class="flex justify-between">
                  <span>总计对话</span>
                  <span class="font-medium">{{ totalChats }}</span>
                </div>
                <div class="flex justify-between">
                  <span>分析次数</span>
                  <span class="font-medium">{{ analysisCount }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧主要内容区域 -->
        <div class="lg:col-span-3">
          <div class="bg-white rounded-lg shadow-sm border h-full">
            <!-- 路由视图或聊天界面 -->
            <router-view v-if="$route.name !== 'LifeAgent'" />
            
            <!-- 默认聊天界面 -->
            <div v-else class="h-full flex flex-col">
              <ChatInterface 
                :current-role="currentRole"
                :user-id="userId"
                @role-switch="handleRoleSwitch"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 模态框组件 -->
    <EventAnalysisModal
      v-if="showEventAnalysis"
      @close="showEventAnalysis = false"
      @analyze="handleEventAnalysis"
    />

    <TrajectoryAnalysisModal
      v-if="showTrajectoryAnalysis"
      @close="showTrajectoryAnalysis = false"
      @analyze="handleTrajectoryAnalysis"
    />

    <PersonalizedAdviceModal
      v-if="showPersonalizedAdvice"
      @close="showPersonalizedAdvice = false"
      @get-advice="handlePersonalizedAdvice"
    />

    <EmotionalSupportModal
      v-if="showEmotionalSupport"
      @close="showEmotionalSupport = false"
      @get-support="handleEmotionalSupport"
    />

    <!-- 结果显示模态框 -->
    <div v-if="showResultModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-5/6 overflow-y-auto m-4">
        <div class="flex items-center justify-between p-6 border-b">
          <h2 class="text-xl font-bold text-gray-900">{{ resultTitle }}</h2>
          <button @click="showResultModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div class="p-6">
          <div class="prose prose-sm max-w-none">
            <pre class="whitespace-pre-wrap text-gray-700">{{ resultContent }}</pre>
          </div>
        </div>
        <div class="flex justify-end p-6 border-t bg-gray-50">
          <button
            @click="showResultModal = false"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ChatInterface from '@/components/ChatInterface.vue'
import EventAnalysisModal from '@/components/EventAnalysisModal.vue'
import TrajectoryAnalysisModal from '@/components/TrajectoryAnalysisModal.vue'
import PersonalizedAdviceModal from '@/components/PersonalizedAdviceModal.vue'
import EmotionalSupportModal from '@/components/EmotionalSupportModal.vue'
import { AIService, type AIRole } from '@/services/aiService'

const router = useRouter()

// 响应式数据
const currentRole = ref<AIRole | null>(null)
const availableRoles = ref<AIRole[]>([])
const userId = ref(1) // 从用户状态获取

// 模态框状态
const showEventAnalysis = ref(false)
const showTrajectoryAnalysis = ref(false)
const showPersonalizedAdvice = ref(false)
const showEmotionalSupport = ref(false)
const showResultModal = ref(false)
const resultTitle = ref('')
const resultContent = ref('')

// 统计数据
const todayChats = ref(0)
const totalChats = ref(0)
const analysisCount = ref(0)

// 初始化
onMounted(async () => {
  await loadAIRoles()
  loadStatistics()
})

// 加载AI角色
const loadAIRoles = async () => {
  try {
    availableRoles.value = [
      {
        roleId: 'life_mentor',
        roleName: '人生导师',
        description: '经验丰富的人生指导专家',
        expertise: ['人生规划', '经验分享', '智慧指导'],
        personality: '温暖睿智',
        isActive: true
      },
      {
        roleId: 'psychologist',
        roleName: '心理咨询师',
        description: '专业的心理健康专家',
        expertise: ['心理疏导', '情感支持', '行为分析'],
        personality: '专业温和',
        isActive: true
      },
      {
        roleId: 'career_coach',
        roleName: '职业导师',
        description: '资深的职业发展顾问',
        expertise: ['职业规划', '求职指导', '技能发展'],
        personality: '实用专业',
        isActive: true
      },
      {
        roleId: 'life_coach',
        roleName: '生活教练',
        description: '专业的生活质量提升专家',
        expertise: ['生活规划', '习惯养成', '健康管理'],
        personality: '积极鼓励',
        isActive: true
      },
      {
        roleId: 'philosopher',
        roleName: '哲学家',
        description: '深度思考的人生哲学家',
        expertise: ['人生哲学', '价值思辨', '意义探索'],
        personality: '深刻理性',
        isActive: true
      }
    ]
    
    if (availableRoles.value.length > 0) {
      currentRole.value = availableRoles.value[0]
    }
  } catch (error) {
    console.error('加载AI角色失败:', error)
  }
}

// 加载统计数据
const loadStatistics = () => {
  // 从本地存储或API获取统计数据
  todayChats.value = parseInt(localStorage.getItem('todayChats') || '0')
  totalChats.value = parseInt(localStorage.getItem('totalChats') || '0')
  analysisCount.value = parseInt(localStorage.getItem('analysisCount') || '0')
}

// 选择角色
const selectRole = (role: AIRole) => {
  currentRole.value = role
}

// 处理角色切换
const handleRoleSwitch = (roleId: string) => {
  const role = availableRoles.value.find(r => r.roleId === roleId)
  if (role) {
    currentRole.value = role
  }
}

// 打开功能模态框
const openEventAnalysis = () => {
  showEventAnalysis.value = true
}

const openTrajectoryAnalysis = () => {
  showTrajectoryAnalysis.value = true
}

const openPersonalizedAdvice = () => {
  showPersonalizedAdvice.value = true
}

const openEmotionalSupport = () => {
  showEmotionalSupport.value = true
}

// 处理分析请求
const handleEventAnalysis = async (data: any) => {
  showEventAnalysis.value = false
  
  try {
    const response = await AIService.eventAnalysis(
      data.eventTitle,
      data.eventDescription,
      data.eventType,
      data.userQuery
    )
    
    resultTitle.value = '事件分析结果'
    resultContent.value = response.analysis || response.response
    showResultModal.value = true
    
    // 更新统计
    analysisCount.value++
    localStorage.setItem('analysisCount', analysisCount.value.toString())
  } catch (error) {
    console.error('事件分析失败:', error)
    resultTitle.value = '分析失败'
    resultContent.value = '抱歉，分析服务暂时不可用，请稍后再试。'
    showResultModal.value = true
  }
}

const handleTrajectoryAnalysis = async (data: any) => {
  showTrajectoryAnalysis.value = false
  
  try {
    const response = await AIService.trajectoryAnalysis(
      data.currentSituation,
      data.goals,
      data.timeFrame
    )
    
    resultTitle.value = '轨迹分析结果'
    resultContent.value = response.analysis || response.response
    showResultModal.value = true
    
    analysisCount.value++
    localStorage.setItem('analysisCount', analysisCount.value.toString())
  } catch (error) {
    console.error('轨迹分析失败:', error)
    resultTitle.value = '分析失败'
    resultContent.value = '抱歉，分析服务暂时不可用，请稍后再试。'
    showResultModal.value = true
  }
}

const handlePersonalizedAdvice = async (data: any) => {
  showPersonalizedAdvice.value = false
  
  try {
    const response = await AIService.personalizedAdvice(
      data.userProfile,
      data.currentSituation,
      data.goals
    )
    
    resultTitle.value = '个性化建议'
    resultContent.value = response.advice || response.response
    showResultModal.value = true
    
    analysisCount.value++
    localStorage.setItem('analysisCount', analysisCount.value.toString())
  } catch (error) {
    console.error('个性化建议失败:', error)
    resultTitle.value = '获取建议失败'
    resultContent.value = '抱歉，建议服务暂时不可用，请稍后再试。'
    showResultModal.value = true
  }
}

const handleEmotionalSupport = async (data: any) => {
  showEmotionalSupport.value = false
  
  try {
    const response = await AIService.emotionalSupport(
      data.emotionalState,
      data.situation,
      data.userMessage
    )
    
    resultTitle.value = '情感支持'
    resultContent.value = response.support || response.response
    showResultModal.value = true
    
    analysisCount.value++
    localStorage.setItem('analysisCount', analysisCount.value.toString())
  } catch (error) {
    console.error('情感支持失败:', error)
    resultTitle.value = '获取支持失败'
    resultContent.value = '抱歉，支持服务暂时不可用，请稍后再试。'
    showResultModal.value = true
  }
}
</script>

<style scoped>
/* 自定义样式 */
.life-agent-view {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.prose pre {
  background-color: transparent;
  padding: 0;
  margin: 0;
  border: none;
  font-family: inherit;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>

