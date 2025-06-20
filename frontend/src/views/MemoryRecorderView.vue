<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- 页面头部 -->
    <div class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- 标题区域 -->
          <div class="flex items-center space-x-4">
            <button
              @click="$router.go(-1)"
              class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft class="w-5 h-5" />
            </button>
            <div class="flex items-center space-x-3">
              <div class="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Camera class="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h1 class="text-xl font-semibold text-gray-900 dark:text-white">回忆记录器</h1>
                <p class="text-sm text-gray-500 dark:text-gray-400">记录生活中的美好瞬间</p>
              </div>
            </div>
          </div>
          
          <!-- 操作按钮 -->
          <div class="flex items-center space-x-3">
            <!-- 搜索 -->
            <div class="relative">
              <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="搜索回忆..."
                class="pl-10 pr-4 py-2 w-64 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
            
            <!-- 筛选按钮 -->
            <button
              @click="showFilterModal = true"
              class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
            >
              <Filter class="w-5 h-5" />
              <span v-if="hasActiveFilters" class="absolute -top-1 -right-1 w-3 h-3 bg-purple-600 rounded-full"></span>
            </button>
            
            <!-- 视图切换 -->
            <div class="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                v-for="view in viewOptions"
                :key="view.value"
                @click="currentView = view.value"
                :class="[
                  'p-2 rounded-md transition-colors',
                  currentView === view.value
                    ? 'bg-white dark:bg-gray-600 text-purple-600 dark:text-purple-400 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                ]"
                :title="view.label"
              >
                <component :is="view.icon" class="w-4 h-4" />
              </button>
            </div>
            
            <!-- 新建回忆按钮 -->
            <button
              @click="showRecorderModal = true"
              class="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus class="w-4 h-4" />
              <span>新建回忆</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 主要内容区域 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 统计卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">总回忆数</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ memoryStats.totalMemories }}</p>
            </div>
            <div class="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Heart class="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">本月新增</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ thisMonthCount }}</p>
            </div>
            <div class="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <TrendingUp class="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">平均重要性</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ memoryStats.averageImportance.toFixed(1) }}</p>
            </div>
            <div class="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Star class="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">主要情感</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ topEmotion }}</p>
            </div>
            <div class="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Smile class="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
      </div>
      
      <!-- 内容区域 -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <!-- 网格视图 -->
        <div v-if="currentView === 'grid'" class="p-6">
          <div v-if="displayedMemories.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <MemoryCard
              v-for="memory in displayedMemories"
              :key="memory.id"
              :memory="memory"
              @view="viewMemory"
              @edit="editMemory"
              @share="shareMemory"
              @delete="deleteMemory"
            />
          </div>
          <div v-else class="text-center py-12">
            <div class="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search class="w-12 h-12 text-gray-400" />
            </div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">没有找到匹配的回忆</h3>
            <p class="text-gray-500 dark:text-gray-400">尝试调整搜索条件或筛选器</p>
          </div>
        </div>
        
        <!-- 时间轴视图 -->
        <div v-else-if="currentView === 'timeline'" class="p-6">
          <MemoryTimeline
            :memories="displayedMemories"
            @view="viewMemory"
            @edit="editMemory"
            @create="showRecorderModal = true"
          />
        </div>
        
        <!-- 统计视图 -->
        <div v-else-if="currentView === 'stats'" class="p-6">
          <MemoryStats :stats="memoryStats" />
        </div>
      </div>
    </div>
    
    <!-- 回忆记录器模态框 -->
    <MemoryRecorderModal
      :show="showRecorderModal"
      :memory="editingMemory"
      @close="closeRecorderModal"
      @saved="handleMemorySaved"
    />
    
    <!-- 筛选模态框 -->
    <MemoryFilterModal
      :show="showFilterModal"
      :filter="currentFilter"
      @close="showFilterModal = false"
      @apply="applyFilter"
      @clear="clearFilter"
    />
    
    <!-- 回忆详情模态框 -->
    <MemoryDetailModal
      :show="showDetailModal"
      :memory="viewingMemory"
      @close="showDetailModal = false"
      @edit="editMemory"
      @delete="deleteMemory"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { 
  ArrowLeft, Camera, Search, Filter, Plus, Heart, TrendingUp, 
  Star, Smile, Grid, List, BarChart3
} from 'lucide-vue-next'
import { useMemoryStore, type Memory, type MemoryFilter } from '@/stores/memory'
import MemoryCard from '@/components/MemoryCard.vue'
import MemoryTimeline from '@/components/MemoryTimeline.vue'
import MemoryRecorderModal from '@/components/MemoryRecorderModal.vue'

// 模拟其他组件（实际开发中需要创建）
const MemoryStats = { template: '<div>统计图表组件</div>' }
const MemoryFilterModal = { template: '<div>筛选模态框组件</div>' }
const MemoryDetailModal = { template: '<div>详情模态框组件</div>' }

const memoryStore = useMemoryStore()

// 响应式数据
const searchQuery = ref('')
const currentView = ref('grid')
const showRecorderModal = ref(false)
const showFilterModal = ref(false)
const showDetailModal = ref(false)
const editingMemory = ref<Memory | null>(null)
const viewingMemory = ref<Memory | null>(null)
const currentFilter = ref<MemoryFilter>({})

// 视图选项
const viewOptions = [
  { value: 'grid', label: '网格视图', icon: Grid },
  { value: 'timeline', label: '时间轴', icon: List },
  { value: 'stats', label: '统计分析', icon: BarChart3 }
]

// 计算属性
const displayedMemories = computed(() => {
  let memories = memoryStore.filteredMemories
  
  if (searchQuery.value.trim()) {
    memories = memoryStore.searchMemories(searchQuery.value)
  }
  
  return memories
})

const memoryStats = computed(() => memoryStore.memoryStats)

const thisMonthCount = computed(() => {
  const thisMonth = new Date().toISOString().slice(0, 7)
  return memoryStore.memories.filter(memory => 
    new Date(memory.createdAt).toISOString().slice(0, 7) === thisMonth
  ).length
})

const topEmotion = computed(() => {
  const emotions = memoryStore.topEmotions
  return emotions.length > 0 ? emotions[0].emotion : '平静'
})

const hasActiveFilters = computed(() => {
  return Object.keys(currentFilter.value).length > 0
})

// 方法
const viewMemory = (memory: Memory) => {
  viewingMemory.value = memory
  showDetailModal.value = true
}

const editMemory = (memory: Memory) => {
  editingMemory.value = memory
  showRecorderModal.value = true
}

const shareMemory = (memory: Memory) => {
  // 实现分享功能
  console.log('分享回忆:', memory.title)
}

const deleteMemory = async (memory: Memory) => {
  if (confirm(`确定要删除回忆"${memory.title}"吗？`)) {
    const result = await memoryStore.deleteMemory(memory.id)
    if (result.success) {
      showDetailModal.value = false
    }
  }
}

const closeRecorderModal = () => {
  showRecorderModal.value = false
  editingMemory.value = null
}

const handleMemorySaved = (memory: Memory) => {
  console.log('回忆已保存:', memory.title)
}

const applyFilter = (filter: MemoryFilter) => {
  currentFilter.value = filter
  memoryStore.setFilter(filter)
  showFilterModal.value = false
}

const clearFilter = () => {
  currentFilter.value = {}
  memoryStore.clearFilter()
  showFilterModal.value = false
}

// 生命周期
onMounted(() => {
  // 加载演示数据
  memoryStore.loadDemoMemories()
})

// 监听搜索查询变化
watch(searchQuery, () => {
  // 搜索逻辑已在计算属性中处理
})
</script>

<style scoped>
/* 自定义样式 */
</style>

