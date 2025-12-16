<template>
  <div class="accessibility-panel">
    <div class="panel-header">
      <h2><i class="fas fa-universal-access"></i> Проверка доступности</h2>
      <p>Анализ контрастности цветов по стандарту WCAG</p>
    </div>

    <div class="color-inputs">
      <div class="color-input-group">
        <label for="foreground-color">Цвет текста:</label>
        <div class="color-picker-wrapper">
          <input 
            type="color" 
            id="foreground-color" 
            v-model="foregroundColor"
            class="color-picker"
          >
          <input 
            type="text" 
            v-model="foregroundColor"
            @input="updateForeground"
            class="color-text-input"
            placeholder="#000000"
          >
        </div>
      </div>

      <div class="color-input-group">
        <label for="background-color">Цвет фона:</label>
        <div class="color-picker-wrapper">
          <input 
            type="color" 
            id="background-color" 
            v-model="backgroundColor"
            class="color-picker"
          >
          <input 
            type="text" 
            v-model="backgroundColor"
            @input="updateBackground"
            class="color-text-input"
            placeholder="#FFFFFF"
          >
        </div>
      </div>
    </div>

    <div class="swap-colors">
      <button @click="swapColors" class="swap-button">
        <i class="fas fa-exchange-alt"></i> Поменять цвета местами
      </button>
    </div>

    <div class="contrast-results">
      <h3>Результаты проверки контрастности</h3>
      
      <div class="contrast-score">
        <div class="score-value">{{ contrastRatio.toFixed(2) }}:1</div>
        <div class="score-label">Коэффициент контрастности</div>
      </div>

      <div class="wcag-compliance">
        <div class="compliance-item" :class="{ 'pass': passesWCAGAA }">
          <i :class="passesWCAGAA ? 'fas fa-check-circle' : 'fas fa-times-circle'"></i>
          <div>
            <strong>WCAG AA (4.5:1)</strong>
            <p>{{ passesWCAGAA ? 'Соответствует' : 'Не соответствует' }}</p>
          </div>
        </div>

        <div class="compliance-item" :class="{ 'pass': passesWCAGAAA }">
          <i :class="passesWCAGAAA ? 'fas fa-check-circle' : 'fas fa-times-circle'"></i>
          <div>
            <strong>WCAG AAA (7:1)</strong>
            <p>{{ passesWCAGAAA ? 'Соответствует' : 'Не соответствует' }}</p>
          </div>
        </div>
      </div>

      <div class="contrast-preview">
        <h4>Предпросмотр:</h4>
        <div 
          class="preview-area" 
          :style="{ backgroundColor: backgroundColor, color: foregroundColor }"
        >
          <div class="preview-text-large">
            Крупный текст (18px+)
          </div>
          <div class="preview-text-normal">
            Обычный текст (14-16px)
          </div>
          <div class="preview-text-small">
            Мелкий текст (12px)
          </div>
        </div>
      </div>

      <div class="recommendations" v-if="!passesWCAGAA">
        <h4><i class="fas fa-lightbulb"></i> Рекомендации:</h4>
        <ul>
          <li v-if="contrastRatio < 4.5">Увеличьте контраст между цветами</li>
          <li v-if="getBrightness(foregroundColor) > getBrightness(backgroundColor)">
            Попробуйте использовать более темный цвет для текста
          </li>
          <li v-else>
            Попробуйте использовать более светлый цвет для текста
          </li>
          <li>Используйте более насыщенные цвета для лучшей различимости</li>
        </ul>
      </div>
    </div>

    <div class="accessibility-actions">
      <button class="action-button check" @click="checkCurrentPalette">
        <i class="fas fa-check-circle"></i> Проверить текущую палитру
      </button>
      <button class="action-button save" @click="saveContrastCheck">
        <i class="fas fa-save"></i> Сохранить проверку
      </button>
    </div>

    <div class="contrast-history" v-if="history.length > 0">
      <h4>История проверок:</h4>
      <div class="history-items">
        <div 
          v-for="(item, index) in history.slice(0, 5)"
          :key="index"
          class="history-item"
          @click="loadFromHistory(item)"
        >
          <div class="history-colors">
            <div 
              class="history-foreground" 
              :style="{ backgroundColor: item.foreground }"
              :title="item.foreground"
            ></div>
            <div 
              class="history-background" 
              :style="{ backgroundColor: item.background }"
              :title="item.background"
            ></div>
          </div>
          <div class="history-info">
            <div class="history-ratio">{{ item.ratio.toFixed(2) }}:1</div>
            <div class="history-date">{{ formatDate(item.date) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'

export default {
  name: 'AccessibilityPanel',
  props: {
    currentPalette: {
      type: Array,
      default: () => []
    }
  },
  emits: ['save-check'],
  setup(props, { emit }) {
    const foregroundColor = ref('#000000')
    const backgroundColor = ref('#ffffff')
    const history = ref([])

    const getBrightness = (hex) => {
      const r = parseInt(hex.substr(1, 2), 16)
      const g = parseInt(hex.substr(3, 2), 16)
      const b = parseInt(hex.substr(5, 2), 16)
      return (r * 299 + g * 587 + b * 114) / 1000
    }

    const getRelativeLuminance = (hex) => {
      const r = parseInt(hex.substr(1, 2), 16) / 255
      const g = parseInt(hex.substr(3, 2), 16) / 255
      const b = parseInt(hex.substr(5, 2), 16) / 255
      
      const sRGB = [r, g, b].map(c => 
        c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
      )
      
      return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2]
    }

    const contrastRatio = computed(() => {
      const lum1 = getRelativeLuminance(foregroundColor.value)
      const lum2 = getRelativeLuminance(backgroundColor.value)
      
      const lighter = Math.max(lum1, lum2)
      const darker = Math.min(lum1, lum2)
      
      return (lighter + 0.05) / (darker + 0.05)
    })

    const passesWCAGAA = computed(() => contrastRatio.value >= 4.5)
    const passesWCAGAAA = computed(() => contrastRatio.value >= 7.0)

    const updateForeground = (event) => {
      let value = event.target.value
      if (!value.startsWith('#')) {
        value = '#' + value
      }
      if (/^#[0-9A-F]{6}$/i.test(value)) {
        foregroundColor.value = value.toUpperCase()
      }
    }

    const updateBackground = (event) => {
      let value = event.target.value
      if (!value.startsWith('#')) {
        value = '#' + value
      }
      if (/^#[0-9A-F]{6}$/i.test(value)) {
        backgroundColor.value = value.toUpperCase()
      }
    }

    const swapColors = () => {
      const temp = foregroundColor.value
      foregroundColor.value = backgroundColor.value
      backgroundColor.value = temp
    }

    const checkCurrentPalette = () => {
      if (props.currentPalette.length >= 2) {
        foregroundColor.value = props.currentPalette[0]
        backgroundColor.value = props.currentPalette[1]
      }
    }

    const saveContrastCheck = () => {
      const check = {
        foreground: foregroundColor.value,
        background: backgroundColor.value,
        ratio: contrastRatio.value,
        passesAA: passesWCAGAA.value,
        passesAAA: passesWCAGAAA.value,
        date: new Date().toISOString()
      }
      
      history.value.unshift(check)
      if (history.value.length > 10) {
        history.value = history.value.slice(0, 10)
      }
      
      localStorage.setItem('contrastHistory', JSON.stringify(history.value))
      emit('save-check', check)
    }

    const loadFromHistory = (item) => {
      foregroundColor.value = item.foreground
      backgroundColor.value = item.background
    }

    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleTimeString('ru-RU', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    }

    onMounted(() => {
      const savedHistory = localStorage.getItem('contrastHistory')
      if (savedHistory) {
        history.value = JSON.parse(savedHistory)
      }
    })

    watch([foregroundColor, backgroundColor], () => {
      // Авто-сохранение в историю при изменении
      const check = {
        foreground: foregroundColor.value,
        background: backgroundColor.value,
        ratio: contrastRatio.value,
        date: new Date().toISOString()
      }
      
      // Добавляем только если отличается от последней проверки
      if (history.value.length === 0 || 
          history.value[0].foreground !== check.foreground || 
          history.value[0].background !== check.background) {
        history.value.unshift(check)
        if (history.value.length > 10) {
          history.value = history.value.slice(0, 10)
        }
      }
    })

    return {
      foregroundColor,
      backgroundColor,
      history,
      contrastRatio,
      passesWCAGAA,
      passesWCAGAAA,
      getBrightness,
      updateForeground,
      updateBackground,
      swapColors,
      checkCurrentPalette,
      saveContrastCheck,
      loadFromHistory,
      formatDate
    }
  }
}
</script>

<style scoped>
.accessibility-panel {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.panel-header {
  margin-bottom: 2rem;
}

.panel-header h2 {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #333;
  margin-bottom: 0.5rem;
}

.panel-header p {
  color: #666;
}

.color-inputs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.color-input-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.color-input-group label {
  font-weight: 600;
  color: #555;
}

.color-picker-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.color-picker {
  width: 60px;
  height: 60px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.color-text-input {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-family: 'Consolas', monospace;
  font-size: 1rem;
}

.color-text-input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.swap-colors {
  text-align: center;
  margin-bottom: 2rem;
}

.swap-button {
  padding: 0.75rem 1.5rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.swap-button:hover {
  background: var(--secondary-color);
  transform: translateY(-2px);
}

.contrast-results {
  margin-bottom: 2rem;
}

.contrast-results h3 {
  margin-bottom: 1.5rem;
  color: #333;
}

.contrast-score {
  text-align: center;
  padding: 2rem;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  color: white;
  border-radius: 12px;
  margin-bottom: 2rem;
}

.score-value {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.score-label {
  font-size: 1.1rem;
  opacity: 0.9;
}

.wcag-compliance {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.compliance-item {
  padding: 1.5rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #f8f9fa;
}

.compliance-item.pass {
  background: #d4edda;
  border: 1px solid #c3e6cb;
}

.compliance-item:not(.pass) {
  background: #f8d7da;
  border: 1px solid #f5c6cb;
}

.compliance-item i {
  font-size: 1.5rem;
}

.compliance-item.pass i {
  color: var(--success-color);
}

.compliance-item:not(.pass) i {
  color: var(--danger-color);
}

.compliance-item strong {
  display: block;
  margin-bottom: 0.25rem;
}

.contrast-preview {
  margin-bottom: 2rem;
}

.contrast-preview h4 {
  margin-bottom: 1rem;
  color: #333;
}

.preview-area {
  padding: 2rem;
  border-radius: 8px;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
}

.preview-text-large {
  font-size: 24px;
  font-weight: bold;
}

.preview-text-normal {
  font-size: 16px;
}

.preview-text-small {
  font-size: 12px;
  opacity: 0.8;
}

.recommendations {
  padding: 1.5rem;
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.recommendations h4 {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 1rem;
  color: #856404;
}

.recommendations ul {
  padding-left: 1.5rem;
  color: #856404;
}

.recommendations li {
  margin-bottom: 0.5rem;
}

.accessibility-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.action-button {
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
}

.action-button.check {
  background: var(--primary-color);
  color: white;
}

.action-button.save {
  background: var(--success-color);
  color: white;
}

.action-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.contrast-history {
  margin-top: 2rem;
}

.contrast-history h4 {
  margin-bottom: 1rem;
  color: #333;
}

.history-items {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.history-item {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.history-item:hover {
  background: #e9ecef;
  transform: translateY(-2px);
}

.history-colors {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.history-foreground,
.history-background {
  width: 40px;
  height: 20px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.history-info {
  flex: 1;
}

.history-ratio {
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
}

.history-date {
  font-size: 0.8rem;
  color: #666;
}

@media (max-width: 768px) {
  .color-inputs {
    grid-template-columns: 1fr;
  }
  
  .wcag-compliance {
    grid-template-columns: 1fr;
  }
  
  .accessibility-actions {
    flex-direction: column;
  }
  
  .action-button {
    width: 100%;
    justify-content: center;
  }
  
  .history-items {
    grid-template-columns: 1fr;
  }
}
</style>