<template>
  <div
    v-if="props.show"
    class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
    @click="$emit('close')"
  >
    <div
      class="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 max-w-lg w-full mx-4 border border-white/20"
      @click.stop
    >
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {{ editingEvent ? $t('events.editEvent') : $t('events.addEvent') }}
        </h2>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-2 transition-all"
        >
          <X class="w-6 h-6" />
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Title -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-3">
            {{ $t('events.eventTitle') }} *
          </label>
          <input
            v-model="form.title"
            type="text"
            required
            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all"
            :placeholder="$t('events.eventTitle')"
          />
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-3">
            {{ $t('events.eventDescription') }}
          </label>
          <textarea
            v-model="form.description"
            rows="3"
            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all resize-none"
            :placeholder="$t('events.eventDescription')"
          ></textarea>
        </div>

        <!-- Category and Emotion Row -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-3">
              {{ $t('events.category') }} *
            </label>
            <select
              v-model="form.category"
              required
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all"
            >
              <option value="">{{ $t('common.select') }}</option>
              <option value="Work">💼 {{ $t('events.categories.work') }}</option>
              <option value="Personal">👤 {{ $t('events.categories.personal') }}</option>
              <option value="Health">🏥 {{ $t('events.categories.health') }}</option>
              <option value="Learning">📚 {{ $t('events.categories.learning') }}</option>
              <option value="Relationships">❤️ {{ $t('events.categories.relationships') }}</option>
              <option value="Entertainment">🎬 {{ $t('events.categories.entertainment') }}</option>
              <option value="Travel">✈️ {{ $t('events.categories.travel') }}</option>
              <option value="Finance">💰 {{ $t('events.categories.finance') }}</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-3">
              {{ $t('events.emotion') }}
            </label>
            <select
              v-model="form.emotion"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all"
            >
              <option value="">{{ $t('common.select') }}</option>
              <option value="happy">😊 {{ $t('events.emotions.happy') }}</option>
              <option value="excited">🎉 {{ $t('events.emotions.excited') }}</option>
              <option value="neutral">😐 {{ $t('events.emotions.neutral') }}</option>
              <option value="stressed">😰 {{ $t('events.emotions.stressed') }}</option>
              <option value="sad">😢 {{ $t('events.emotions.sad') }}</option>
              <option value="angry">😠 {{ $t('events.emotions.angry') }}</option>
              <option value="surprised">😲 {{ $t('events.emotions.surprised') }}</option>
              <option value="grateful">🙏 {{ $t('events.emotions.grateful') }}</option>
            </select>
          </div>
        </div>

        <!-- Date and Time -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-3">
            {{ $t('events.eventDate') }} *
          </label>
          <input
            v-model="form.eventDate"
            type="datetime-local"
            required
            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all"
          />
        </div>

        <!-- Importance Slider -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-3">
            {{ $t('events.importance') }}: {{ form.importance }}/10
          </label>
          <div class="relative">
            <input
              v-model.number="form.importance"
              type="range"
              min="1"
              max="10"
              class="w-full h-2 bg-gradient-to-r from-blue-200 to-purple-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div class="flex justify-between text-xs text-gray-500 mt-2">
              <span>{{ $t('common.no') }}</span>
              <span class="font-semibold text-blue-600">{{ form.importance }}</span>
              <span>{{ $t('common.yes') }}</span>
            </div>
          </div>
        </div>

        <!-- Location -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-3">
            {{ $t('events.location') }}
          </label>
          <input
            v-model="form.location"
            type="text"
            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all"
            :placeholder="$t('events.location')"
          />
        </div>

        <!-- Error Message -->
        <div v-if="error" class="bg-red-50 border border-red-200 rounded-xl p-4">
          <p class="text-red-700 text-sm font-medium">{{ error }}</p>
        </div>

        <!-- Submit Buttons -->
        <div class="flex space-x-4 pt-6">
          <button
            type="button"
            @click="$emit('close')"
            class="flex-1 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all font-medium"
          >
            {{ $t('common.cancel') }}
          </button>
          <button
            type="submit"
            :disabled="isLoading"
            class="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all font-medium shadow-lg"
          >
            <span v-if="isLoading">{{ editingEvent ? $t('common.loading') : $t('common.loading') }}</span>
            <span v-else>{{ editingEvent ? $t('events.editEvent') : $t('events.addEvent') }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { X } from 'lucide-vue-next'
import type { Event } from '../stores/events'
import { useEventStore } from '../stores/events'

interface Props {
  show: boolean
  event?: Event | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  save: [event: Event]
}>()

const eventStore = useEventStore()
const isLoading = ref(false)
const error = ref('')

const editingEvent = ref<Event | null>(null)

const form = reactive({
  title: '',
  description: '',
  category: '',
  eventDate: '',
  emotion: '',
  importance: 5,
  location: ''
})

const resetForm = () => {
  form.title = ''
  form.description = ''
  form.category = ''
  form.eventDate = new Date().toISOString().slice(0, 16)
  form.emotion = ''
  form.importance = 5
  form.location = ''
  error.value = ''
}


// Watch for event prop changes after resetForm is defined
watch(
  () => props.event,
  (newEvent) => {
    editingEvent.value = newEvent || null
    if (newEvent) {
      form.title = newEvent.title
      form.description = newEvent.description || ''
      form.category = newEvent.category
      form.eventDate = newEvent.eventDate ? new Date(newEvent.eventDate).toISOString().slice(0, 16) : ''
      form.emotion = newEvent.emotion || ''
      form.importance = newEvent.importance || 5
      form.location = newEvent.location || ''
    } else {
      resetForm()
    }
  },
  { immediate: true }
)

const handleSubmit = async () => {
  error.value = ''
  isLoading.value = true
  
  try {
    const eventData = {
      title: form.title,
      description: form.description,
      category: form.category,
      eventDate: form.eventDate,
      emotion: form.emotion,
      importance: form.importance,
      location: form.location
    }
    
    let result
    if (editingEvent.value?.id) {
      // Update existing event
      result = await eventStore.updateEvent(editingEvent.value.id, eventData)
    } else {
      // Create new event
      result = await eventStore.createEvent(eventData)
    }
    
    if (result.success) {
      emit('save', result.event)
      emit('close')
      resetForm()
    } else {
      error.value = result.error || 'Failed to save event'
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to save event'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.slider::-webkit-slider-thumb {
  appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: linear-gradient(45deg, #3b82f6, #8b5cf6);
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.slider::-moz-range-thumb {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: linear-gradient(45deg, #3b82f6, #8b5cf6);
  cursor: pointer;
  border: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>

