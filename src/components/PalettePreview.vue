<template>
  <div class="palette-preview">
    <h3><i class="fas fa-eye"></i> Предпросмотр палитры</h3>
    
    <div class="preview-options">
      <div class="background-toggle">
        <span>Фон предпросмотра:</span>
        <button
          class="bg-button"
          :class="{ active: previewBackground === 'light' }"
          @click="previewBackground = 'light'"
        >
          <i class="fas fa-sun"></i> Светлый
        </button>
        <button
          class="bg-button"
          :class="{ active: previewBackground === 'dark' }"
          @click="previewBackground = 'dark'"
        >
          <i class="fas fa-moon"></i> Тёмный
        </button>
      </div>
    </div>
    
    <div class="preview-container" :class="previewBackground">
      <div class="preview-mockup">
        <div class="mockup-header" :style="{ backgroundColor: colors[0] || '#667eea' }">
          <div class="mockup-title">Заголовок страницы</div>
          <div class="mockup-nav">
            <div class="mockup-nav-item" :style="{ backgroundColor: colors[1] || '#764ba2' }">Главная</div>
            <div class="mockup-nav-item" :style="{ backgroundColor: colors[2] || '#764ba2' }">О проекте</div>
            <div class="mockup-nav-item" :style="{ backgroundColor: colors[1] || '#764ba2' }">Контакты</div>
          </div>
        </div>
        
        <div class="mockup-content">
          <div class="mockup-card" :style="{ backgroundColor: colors[3] || '#ffffff', borderColor: colors[1] || '#764ba2' }">
            <div class="mockup-card-title" :style="{ color: colors[0] || '#667eea' }">Карточка с контентом</div>
            <div class="mockup-card-text">Это пример текста в карточке с использованием цветов из вашей палитры.</div>
            <button class="mockup-button" :style="{ backgroundColor: colors[4] || '#28a745', color: getContrastColor(colors[4] || '#28a745') }">
              Кнопка действия
            </button>
          </div>
        </div>
        
        <div class="mockup-footer" :style="{ backgroundColor: colors[2] || '#333333' }">
          <div class="mockup-footer-text">Футер страницы</div>
        </div>
      </div>
      
      <div v-if="colors.length > 0" class="palette-info">
        <h4>Используемые цвета:</h4>
        <div class="used-colors">
          <div
            v-for="(color, index) in colors"
            :key="index"
            class="used-color"
            :style="{ backgroundColor: color }"
            :title="format === 'hex' ? color.toUpperCase() : `rgb(${hexToRgb(color).join(', ')})`"
          >
            <span class="color-index">{{ index + 1 }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { hexToRgb, getColorBrightness } from '../utils/colorUtils'

export default {
  name: 'PalettePreview',
  props: {
    colors: {
      type: Array,
      default: () => []
    },
    format: {
      type: String,
      default: 'hex'
    }
  },
  setup(props) {
    const previewBackground = ref('light')

    const getContrastColor = (hexColor) => {
      return getColorBrightness(hexColor) > 128 ? '#000000' : '#ffffff'
    }

    return {
      previewBackground,
      hexToRgb,
      getContrastColor
    }
  }
}
</script>

<style scoped>
.palette-preview {
  width: 100%;
}

.palette-preview h3 {
  margin-bottom: 20px;
  color: #333;
  display: flex;
  align-items: center;
  gap: 10px;
}

.preview-options {
  margin-bottom: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.background-toggle {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.background-toggle span {
  font-weight: 600;
  color: #555;
}

.bg-button {
  padding: 8px 16px;
  border: 2px solid #ddd;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.bg-button:hover {
  border-color: #667eea;
  color: #667eea;
}

.bg-button.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.preview-container {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.preview-container.light {
  background: #ffffff;
}

.preview-container.dark {
  background: #1a1a1a;
}

.preview-mockup {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.mockup-header {
  padding: 25px;
  color: white;
}

.mockup-title {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 20px;
}

.mockup-nav {
  display: flex;
  gap: 15px;
}

.mockup-nav-item {
  padding: 10px 20px;
  border-radius: 6px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.mockup-nav-item:hover {
  opacity: 0.9;
}

.mockup-content {
  padding: 30px;
  min-height: 200px;
}

.mockup-card {
  max-width: 400px;
  padding: 25px;
  border-radius: 12px;
  border-width: 2px;
  border-style: solid;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.mockup-card-title {
  font-size: 1.4rem;
  font-weight: bold;
  margin-bottom: 15px;
}

.mockup-card-text {
  line-height: 1.6;
  margin-bottom: 20px;
  color: #555;
}

.mockup-button {
  padding: 12px 25px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.mockup-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.mockup-footer {
  padding: 20px;
  color: white;
  text-align: center;
}

.mockup-footer-text {
  font-size: 0.9rem;
  opacity: 0.8;
}

.palette-info {
  padding: 20px;
  background: rgba(0, 0, 0, 0.05);
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.palette-info h4 {
  margin-bottom: 15px;
  color: #333;
}

.used-colors {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.used-color {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.color-index {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-weight: bold;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
  font-size: 0.9rem;
}

.dark .palette-info {
  background: rgba(255, 255, 255, 0.05);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.dark .palette-info h4 {
  color: #fff;
}

@media (max-width: 768px) {
  .preview-mockup {
    transform: scale(0.9);
    transform-origin: top left;
  }
  
  .background-toggle {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .bg-button {
    width: 100%;
    justify-content: center;
  }
}
</style>