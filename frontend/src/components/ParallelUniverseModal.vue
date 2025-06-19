<template>
  <Transition name="modal">
    <div v-if="isVisible" class="modal-mask">
      <div class="modal-wrapper" @click.self="closeModal">
        <div class="modal-container relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-4xl mx-4 transform transition-all duration-300 ease-out">
          <button @click="closeModal" class="absolute top-6 right-6 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-3xl font-bold z-10">
            ×
          </button>

          <div class="modal-header mb-8 text-center">
            <div class="mb-4">
              <div class="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
                <i class="i-lucide-zap text-white text-3xl"></i>
              </div>
            </div>
            <h3 class="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 dark:from-purple-400 dark:to-pink-300 mb-3">
              {{ $t('parallelUniverse.modal.title') }}
            </h3>
            <p class="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
              {{ $t('parallelUniverse.modal.description') }}
            </p>
            <div v-if="realLifeEvent" class="mt-4 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl border border-blue-200 dark:border-blue-700">
              <p class="text-sm text-blue-600 dark:text-blue-400 font-medium">
                {{ $t('parallelUniverse.modal.triggerEvent') }}: "{{ realLifeEvent.title }}"
              </p>
            </div>
          </div>

          <div class="modal-body">
            <!-- Mode Selection -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div @click="selectMode('user-defined')"
                   class="mode-card group bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 p-8 rounded-2xl shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl flex flex-col items-center justify-center text-white text-center relative overflow-hidden">
                <div class="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div class="relative z-10">
                  <i class="i-lucide-edit text-6xl mb-4"></i>
                  <h4 class="text-2xl font-bold mb-3">{{ $t('parallelUniverse.modal.userDefinedTitle') }}</h4>
                  <p class="text-sm opacity-90 leading-relaxed">{{ $t('parallelUniverse.modal.userDefinedDescription') }}</p>
                </div>
              </div>

              <div @click="selectMode('ai-planned')"
                   class="mode-card group bg-gradient-to-br from-green-500 to-teal-600 dark:from-green-600 dark:to-teal-700 p-8 rounded-2xl shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl flex flex-col items-center justify-center text-white text-center relative overflow-hidden">
                <div class="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div class="relative z-10">
                  <i class="i-lucide-brain text-6xl mb-4"></i>
                  <h4 class="text-2xl font-bold mb-3">{{ $t('parallelUniverse.modal.aiPlannedTitle') }}</h4>
                  <p class="text-sm opacity-90 leading-relaxed">{{ $t('parallelUniverse.modal.aiPlannedDescription') }}</p>
                </div>
              </div>
            </div>

            <!-- Theme Selection (shown after mode selection) -->
            <div v-if="selectedMode" class="theme-selection mb-8">
              <h4 class="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 text-center">
                {{ $t('parallelUniverse.modal.selectTheme') }}
              </h4>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div v-for="theme in availableThemes" :key="theme.id"
                     @click="selectedTheme = theme.id"
                     :class="[
                       'theme-card p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 text-center',
                       selectedTheme === theme.id 
                         ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 dark:border-purple-400' 
                         : 'border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-500'
                     ]">
                  <div class="text-2xl mb-2">{{ theme.icon }}</div>
                  <div class="text-sm font-medium text-gray-800 dark:text-gray-200">{{ $t(`parallelUniverse.themes.${theme.id}`) }}</div>
                </div>
              </div>
            </div>

            <!-- Start Button -->
            <div v-if="selectedMode && selectedTheme" class="text-center">
              <button @click="startParallelUniverse"
                      class="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-full text-lg shadow-lg transform transition-all duration-200 hover:scale-105">
                <i class="i-lucide-rocket mr-2"></i>
                {{ $t('parallelUniverse.modal.startUniverse') }}
              </button>
            </div>
          </div>

          <div class="modal-footer mt-8 text-center">
            <button @click="closeModal"
                    class="px-6 py-3 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-full font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200">
              {{ $t('common.cancel') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useParallelUniverseStore } from '@/stores/parallelUniverse'
import { useRouter } from 'vue-router'

const props = defineProps<{
  isVisible: boolean
  realLifeEvent?: any
}>()

const emit = defineEmits(['close', 'universe-started'])

const { t } = useI18n()
const router = useRouter()
const parallelUniverseStore = useParallelUniverseStore()

const selectedMode = ref<'user-defined' | 'ai-planned' | null>(null)
const selectedTheme = ref<string | null>(null)

const availableThemes = [
  { id: 'entrepreneur', icon: '💼' },
  { id: 'artist', icon: '🎨' },
  { id: 'adventurer', icon: '🌍' },
  { id: 'scholar', icon: '📚' },
  { id: 'family', icon: '👨‍👩‍👧‍👦' },
  { id: 'general', icon: '✨' }
]

watch(() => props.isVisible, (newVal) => {
  if (!newVal) {
    // Reset selections when modal is closed
    selectedMode.value = null
    selectedTheme.value = null
  }
})

const closeModal = () => {
  emit('close')
}

const selectMode = (mode: 'user-defined' | 'ai-planned') => {
  selectedMode.value = mode
}

const startParallelUniverse = () => {
  if (!selectedMode.value || !selectedTheme.value) return

  const newUniverse = parallelUniverseStore.startNewParallelUniverse(
    selectedMode.value,
    props.realLifeEvent,
    selectedTheme.value
  )

  emit('universe-started', newUniverse)
  closeModal()

  // Navigate to timeline view to show the new parallel universe
  router.push('/timeline')
}
</script>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  transition: opacity 0.3s ease;
  backdrop-filter: blur(4px);
}

.modal-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 2rem;
}

.modal-container {
  max-height: 90vh;
  overflow-y: auto;
}

/* Modal transition styles */
.modal-enter-from, .modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: all 0.3s ease;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9) translateY(-50px);
}

/* Custom scrollbar */
.modal-container::-webkit-scrollbar {
  width: 6px;
}

.modal-container::-webkit-scrollbar-track {
  background: transparent;
}

.modal-container::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

.modal-container::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.7);
}
</style>

