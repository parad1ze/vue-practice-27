<template>
  <div class="color-card" :style="{ backgroundColor: colorValue }">
    <div class="color-info" :class="{ 'light-text': isDarkColor }">
      <div class="color-value" @click="handleCopy">
        {{ formattedColor }}
        <i class="fas fa-copy copy-icon"></i>
      </div>
      <div class="color-actions">
        <button
          class="pin-button"
          @click="$emit('toggle-pin')"
          :class="{ pinned: isPinned }"
          :title="isPinned ? 'Открепить цвет' : 'Закрепить цвет'"
        >
          <i class="fas fa-thumbtack"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { hexToRgb, getColorBrightness } from '../utils/colorUtils'

export default {
  name: 'ColorCard',
  props: {
    color: {
      type: String,
      required: true
    },
    format: {
      type: String,
      default: 'hex'
    },
    isPinned: {
      type: Boolean,
      default: false
    }
  },
  emits: ['copy', 'toggle-pin'],
  setup(props, { emit }) {
    const colorValue = computed(() => {
      return props.format === 'hex' ? props.color : `rgb(${hexToRgb(props.color).join(', ')})`
    })

    const formattedColor = computed(() => {
      if (props.format === 'hex') {
        return props.color.toUpperCase()
      } else {
        const rgb = hexToRgb(props.color)
        return `rgb(${rgb.join(', ')})`
      }
    })

    const isDarkColor = computed(() => {
      return getColorBrightness(props.color) < 128
    })

    const handleCopy = () => {
      const text = props.format === 'hex' ? props.color.toUpperCase() : `rgb(${hexToRgb(props.color).join(', ')})`
      emit('copy', text)
    }

    return {
      colorValue,
      formattedColor,
      isDarkColor,
      handleCopy
    }
  }
}
</script>

<style scoped>
.color-card {
  height: 180px;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.color-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.color-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.light-text {
  background: rgba(255, 255, 255, 0.9);
  color: #333;
}

.color-value {
  font-family: 'Consolas', 'Monaco', monospace;
  font-weight: bold;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.copy-icon {
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.color-value:hover .copy-icon {
  opacity: 1;
}

.color-actions {
  display: flex;
  gap: 10px;
}

.pin-button {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.light-text .pin-button {
  background: rgba(0, 0, 0, 0.1);
  color: #333;
}

.pin-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.light-text .pin-button:hover {
  background: rgba(0, 0, 0, 0.2);
}

.pin-button.pinned {
  background: #ffc107;
  color: #000;
}

.pin-button.pinned:hover {
  background: #e0a800;
}

@media (max-width: 768px) {
  .color-card {
    height: 150px;
  }
  
  .color-value {
    font-size: 1rem;
  }
}
</style>