<template>
  <div class="parallel-universe-grid">
    <!-- Header -->
    <div class="grid-header mb-8">
      <h2 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 dark:from-purple-400 dark:to-pink-300 mb-4">
        {{ $t('parallelUniverse.grid.title') }}
      </h2>
      <p class="text-gray-600 dark:text-gray-300 text-lg">
        {{ $t('parallelUniverse.grid.description') }}
      </p>
    </div>

    <!-- Stats Overview -->
    <div class="stats-overview grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="stat-card bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-blue-100 text-sm font-medium">{{ $t('parallelUniverse.stats.total') }}</p>
            <p class="text-3xl font-bold">{{ totalParallelUniverses }}</p>
          </div>
          <i class="i-lucide-layers text-3xl opacity-80"></i>
        </div>
      </div>
      
      <div class="stat-card bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-green-100 text-sm font-medium">{{ $t('parallelUniverse.stats.active') }}</p>
            <p class="text-3xl font-bold">{{ activeParallelUniverses.length }}</p>
          </div>
          <i class="i-lucide-play text-3xl opacity-80"></i>
        </div>
      </div>
      
      <div class="stat-card bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-purple-100 text-sm font-medium">{{ $t('parallelUniverse.stats.completed') }}</p>
            <p class="text-3xl font-bold">{{ completedParallelUniverses.length }}</p>
          </div>
          <i class="i-lucide-check-circle text-3xl opacity-80"></i>
        </div>
      </div>
      
      <div class="stat-card bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-2xl shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-orange-100 text-sm font-medium">{{ $t('parallelUniverse.stats.insights') }}</p>
            <p class="text-3xl font-bold">{{ totalInsights }}</p>
          </div>
          <i class="i-lucide-lightbulb text-3xl opacity-80"></i>
        </div>
      </div>
    </div>

    <!-- Universe Grid -->
    <div class="universe-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="universe in parallelUniverseHistory" :key="universe.id"
           class="universe-card bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 cursor-pointer"
           @click="selectUniverse(universe)">
        
        <!-- Universe Header -->
        <div class="universe-header mb-4">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-xl font-bold text-gray-800 dark:text-gray-200 truncate">
              {{ universe.title }}
            </h3>
            <span :class="[
              'status-badge px-3 py-1 rounded-full text-xs font-medium',
              universe.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
              universe.status === 'completed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
              'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
            ]">
              {{ $t(`parallelUniverse.status.${universe.status}`) }}
            </span>
          </div>
          <p class="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
            {{ universe.description }}
          </p>
        </div>

        <!-- Universe Stats -->
        <div class="universe-stats mb-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="stat-item">
              <div class="flex items-center justify-between mb-1">
                <span class="text-xs text-gray-500 dark:text-gray-400">{{ $t('virtualLife.stats.happiness') }}</span>
                <span class="text-xs font-medium text-gray-700 dark:text-gray-300">{{ universe.stats.happiness }}/100</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div class="bg-gradient-to-r from-pink-400 to-pink-500 h-2 rounded-full transition-all duration-300"
                     :style="{ width: `${universe.stats.happiness}%` }"></div>
              </div>
            </div>
            
            <div class="stat-item">
              <div class="flex items-center justify-between mb-1">
                <span class="text-xs text-gray-500 dark:text-gray-400">{{ $t('virtualLife.stats.success') }}</span>
                <span class="text-xs font-medium text-gray-700 dark:text-gray-300">{{ universe.stats.success }}/100</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div class="bg-gradient-to-r from-blue-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                     :style="{ width: `${universe.stats.success}%` }"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Universe Info -->
        <div class="universe-info flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div class="flex items-center space-x-4">
            <span class="flex items-center">
              <i class="i-lucide-calendar w-4 h-4 mr-1"></i>
              {{ formatDate(universe.createdAt) }}
            </span>
            <span class="flex items-center">
              <i class="i-lucide-star w-4 h-4 mr-1"></i>
              {{ $t('parallelUniverse.level') }} {{ universe.stats.level }}
            </span>
          </div>
          <div class="flex items-center space-x-2">
            <span v-if="universe.achievements.length > 0" class="flex items-center">
              <i class="i-lucide-trophy w-4 h-4 mr-1 text-yellow-500"></i>
              {{ universe.achievements.length }}
            </span>
            <span v-if="universe.insights.length > 0" class="flex items-center">
              <i class="i-lucide-lightbulb w-4 h-4 mr-1 text-blue-500"></i>
              {{ universe.insights.length }}
            </span>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="universe-actions mt-4 flex space-x-2">
          <button v-if="universe.status === 'active'"
                  @click.stop="continueUniverse(universe)"
                  class="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors duration-200">
            {{ $t('parallelUniverse.actions.continue') }}
          </button>
          <button @click.stop="viewUniverse(universe)"
                  class="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200">
            {{ $t('parallelUniverse.actions.view') }}
          </button>
          <button @click.stop="compareUniverse(universe)"
                  class="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-sm font-medium rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-200">
            <i class="i-lucide-git-compare w-4 h-4"></i>
          </button>
        </div>
      </div>

      <!-- Add New Universe Card -->
      <div class="add-universe-card bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-2xl shadow-lg p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center min-h-[300px]"
           @click="$emit('create-new-universe')">
        <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
          <i class="i-lucide-plus text-white text-2xl"></i>
        </div>
        <h3 class="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
          {{ $t('parallelUniverse.grid.createNew') }}
        </h3>
        <p class="text-gray-500 dark:text-gray-400 text-sm">
          {{ $t('parallelUniverse.grid.createNewDescription') }}
        </p>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="parallelUniverseHistory.length === 0" class="empty-state text-center py-16">
      <div class="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
        <i class="i-lucide-zap text-white text-4xl"></i>
      </div>
      <h3 class="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-4">
        {{ $t('parallelUniverse.grid.empty.title') }}
      </h3>
      <p class="text-gray-500 dark:text-gray-400 text-lg mb-8 max-w-md mx-auto">
        {{ $t('parallelUniverse.grid.empty.description') }}
      </p>
      <button @click="$emit('create-new-universe')"
              class="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-full text-lg shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200">
        {{ $t('parallelUniverse.grid.empty.action') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useParallelUniverseStore } from '@/stores/parallelUniverse'
import { useRouter } from 'vue-router'

const emit = defineEmits(['create-new-universe', 'universe-selected', 'compare-universe'])

const { t } = useI18n()
const router = useRouter()
const parallelUniverseStore = useParallelUniverseStore()

const {
  parallelUniverseHistory,
  totalParallelUniverses,
  activeParallelUniverses,
  completedParallelUniverses
} = parallelUniverseStore

const totalInsights = computed(() => {
  return parallelUniverseHistory.reduce((total, universe) => total + universe.insights.length, 0)
})

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString()
}

const selectUniverse = (universe: any) => {
  emit('universe-selected', universe)
}

const continueUniverse = (universe: any) => {
  parallelUniverseStore.currentParallelUniverse = universe
  router.push('/timeline')
}

const viewUniverse = (universe: any) => {
  parallelUniverseStore.currentParallelUniverse = universe
  router.push('/timeline')
}

const compareUniverse = (universe: any) => {
  emit('compare-universe', universe)
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

