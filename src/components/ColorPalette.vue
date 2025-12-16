<template>
  <div class="color-palette">
    <div class="controls-section">
      <PaletteControls
        :color-count="colorCount"
        :color-format="colorFormat"
        :pinned-colors="pinnedColors"
        @generate="generatePalette"
        @update-count="colorCount = $event"
        @update-format="colorFormat = $event"
        @toggle-pin="toggleColorPin"
        @clear-pinned="clearPinnedColors"
      />
    </div>

    <div class="palette-section">
      <div class="palette-display">
        <div
          v-for="(color, index) in currentPalette"
          :key="index"
          class="palette-color-wrapper"
        >
          <ColorCard
            :color="color"
            :format="colorFormat"
            :is-pinned="isColorPinned(color)"
            @copy="copyToClipboard"
            @toggle-pin="toggleColorPin(color)"
          />
        </div>
      </div>
      
      <div v-if="currentPalette.length === 0" class="empty-palette">
        <p>Нажмите "Сгенерировать палитру" чтобы создать первую цветовую схему!</p>
      </div>
    </div>

    <div class="preview-section">
      <PalettePreview :colors="currentPalette" :format="colorFormat" />
    </div>

    <div class="notification" :class="{ show: showNotification }">
      <i class="fas fa-check-circle"></i> {{ notificationText }}
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import PaletteControls from './PaletteControls.vue'
import ColorCard from './ColorCard.vue'
import PalettePreview from './PalettePreview.vue'
import { generateHarmoniousColors } from '../utils/colorUtils'

export default {
  name: 'ColorPalette',
  components: {
    PaletteControls,
    ColorCard,
    PalettePreview
  },
  setup() {
    const currentPalette = ref([])
    const pinnedColors = ref([])
    const colorCount = ref(5)
    const colorFormat = ref('hex')
    const showNotification = ref(false)
    const notificationText = ref('')

    const generatePalette = () => {
      const newColors = generateHarmoniousColors(colorCount.value)
      
      const result = []
      let newColorIndex = 0
      
      for (let i = 0; i < colorCount.value; i++) {
        if (i < pinnedColors.value.length) {
          result.push(pinnedColors.value[i])
        } else {
          result.push(newColors[newColorIndex])
          newColorIndex++
        }
      }
      
      currentPalette.value = result
    }

    const isColorPinned = (color) => {
      return pinnedColors.value.includes(color)
    }

    const toggleColorPin = (color) => {
      const index = pinnedColors.value.indexOf(color)
      if (index === -1) {
        pinnedColors.value.push(color)
        showNotificationWithText(`Цвет ${color.toUpperCase()} закреплен`)
      } else {
        pinnedColors.value.splice(index, 1)
        showNotificationWithText(`Цвет ${color.toUpperCase()} откреплен`)
      }
    }

    const clearPinnedColors = () => {
      pinnedColors.value = []
      generatePalette()
      showNotificationWithText('Все цвета откреплены')
    }

    const copyToClipboard = (text) => {
      navigator.clipboard.writeText(text).then(() => {
        showNotificationWithText(`${text} скопирован в буфер обмена!`)
      })
    }

    const showNotificationWithText = (text) => {
      notificationText.value = text
      showNotification.value = true
      setTimeout(() => {
        showNotification.value = false
      }, 2000)
    }

    const loadFromStorage = () => {
      const saved = localStorage.getItem('colorPalette')
      if (saved) {
        const data = JSON.parse(saved)
        currentPalette.value = data.currentPalette || []
        pinnedColors.value = data.pinnedColors || []
        colorCount.value = data.colorCount || 5
        colorFormat.value = data.colorFormat || 'hex'
      }
    }

    const saveToStorage = () => {
      const data = {
        currentPalette: currentPalette.value,
        pinnedColors: pinnedColors.value,
        colorCount: colorCount.value,
        colorFormat: colorFormat.value
      }
      localStorage.setItem('colorPalette', JSON.stringify(data))
    }

    onMounted(() => {
      loadFromStorage()
      if (currentPalette.value.length === 0) {
        generatePalette()
      }
    })

    watch([currentPalette, pinnedColors, colorCount, colorFormat], () => {
      saveToStorage()
    }, { deep: true })

    return {
      currentPalette,
      pinnedColors,
      colorCount,
      colorFormat,
      showNotification,
      notificationText,
      generatePalette,
      isColorPinned,
      toggleColorPin,
      clearPinnedColors,
      copyToClipboard
    }
  }
}
</script>

<style scoped>
.color-palette {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.controls-section {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.palette-section {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.palette-display {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.empty-palette {
  text-align: center;
  padding: 40px;
  color: #666;
  font-style: italic;
  background: #f8f9fa;
  border-radius: 8px;
}

.preview-section {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.notification {
  position: fixed;
  bottom: 30px;
  right: 30px;
  background: #28a745;
  color: white;
  padding: 15px 25px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  gap: 10px;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.3s ease;
  z-index: 1000;
  max-width: 400px;
}

.notification.show {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 768px) {
  .palette-display {
    grid-template-columns: 1fr;
  }
  
  .controls-section,
  .palette-section,
  .preview-section {
    padding: 20px;
  }
  
  .notification {
    bottom: 20px;
    right: 20px;
    left: 20px;
    text-align: center;
    justify-content: center;
  }
}
</style>