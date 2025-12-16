<template>
  <div class="advanced-generator">
    <div class="generator-header">
      <h2><i class="fas fa-magic"></i> Продвинутая генерация</h2>
      <p>Создавайте палитры различными методами</p>
    </div>

    <div class="generator-controls">
      <div class="control-group">
        <label for="generation-method">Метод генерации:</label>
        <select id="generation-method" v-model="selectedMethod" @change="generatePalette">
          <option value="analogous">Аналогичные цвета</option>
          <option value="monochromatic">Монохромная</option>
          <option value="triadic">Триада</option>
          <option value="complementary">Комплементарная</option>
          <option value="split-complementary">Раздельно-комплементарная</option>
        </select>
      </div>

      <div class="control-group">
        <label>Базовый цвет:</label>
        <div class="color-picker-container">
          <input 
            type="color" 
            v-model="baseColor" 
            @change="generatePalette"
            class="color-input"
          >
          <span class="color-value">{{ baseColor.toUpperCase() }}</span>
        </div>
      </div>

      <div class="control-group">
        <label for="color-count">Количество цветов:</label>
        <input 
          type="range" 
          id="color-count" 
          v-model="colorCount" 
          min="3" 
          max="9" 
          @input="generatePalette"
          class="range-input"
        >
        <div class="range-value">{{ colorCount }} цветов</div>
      </div>

      <div class="control-group">
        <label>Настроение палитры:</label>
        <div class="mood-buttons">
          <button
            v-for="mood in moods"
            :key="mood.id"
            class="mood-button"
            :class="{ active: selectedMood === mood.id }"
            @click="selectMood(mood.id)"
          >
            <i :class="mood.icon"></i>
            {{ mood.name }}
          </button>
        </div>
      </div>
    </div>

    <div class="generated-palette">
      <h3>Сгенерированная палитра</h3>
      <div class="palette-display">
        <div
          v-for="(color, index) in palette"
          :key="index"
          class="palette-color"
          :style="{ backgroundColor: color }"
          @click="copyColor(color)"
        >
          <div class="color-info" :class="{ 'light-text': getBrightness(color) < 128 }">
            <span class="color-hex">{{ color.toUpperCase() }}</span>
            <span class="color-copy"><i class="fas fa-copy"></i></span>
          </div>
        </div>
      </div>
    </div>

    <div class="palette-actions">
      <button class="action-button save" @click="savePalette">
        <i class="fas fa-save"></i> Сохранить в библиотеку
      </button>
      <button class="action-button generate" @click="generateRandom">
        <i class="fas fa-random"></i> Случайная генерация
      </button>
      <button class="action-button export" @click="$emit('export', palette)">
        <i class="fas fa-download"></i> Экспортировать
      </button>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'

export default {
  name: 'AdvancedGenerator',
  emits: ['save', 'export'],
  setup(props, { emit }) {
    const selectedMethod = ref('analogous')
    const baseColor = ref('#667eea')
    const colorCount = ref(5)
    const selectedMood = ref('calm')
    const palette = ref([])

    const moods = [
      { id: 'calm', name: 'Спокойное', icon: 'fas fa-spa' },
      { id: 'energetic', name: 'Энергичное', icon: 'fas fa-bolt' },
      { id: 'professional', name: 'Профессиональное', icon: 'fas fa-briefcase' },
      { id: 'creative', name: 'Креативное', icon: 'fas fa-paint-brush' }
    ]

    const generatePalette = () => {
      // Здесь будет логика генерации на основе выбранного метода
      const colors = []
      for (let i = 0; i < colorCount.value; i++) {
        colors.push(generateColorByMethod(i))
      }
      palette.value = colors
    }

    const generateColorByMethod = (index) => {
      // Упрощенная логика генерации
      const baseHex = baseColor.value.replace('#', '')
      const r = parseInt(baseHex.substr(0, 2), 16)
      const g = parseInt(baseHex.substr(2, 2), 16)
      const b = parseInt(baseHex.substr(4, 2), 16)
      
      // Изменяем цвет в зависимости от метода
      let newR = r, newG = g, newB = b
      
      switch(selectedMethod.value) {
        case 'analogous':
          newR = Math.min(255, r + (index * 20))
          break
        case 'monochromatic':
          const factor = 0.8 + (index * 0.1)
          newR = Math.floor(r * factor)
          newG = Math.floor(g * factor)
          newB = Math.floor(b * factor)
          break
        case 'triadic':
          newR = (r + (index * 85)) % 256
          newG = (g + (index * 85)) % 256
          newB = (b + (index * 85)) % 256
          break
        default:
          newR = (r + (index * 30)) % 256
          newG = (g + (index * 30)) % 256
          newB = (b + (index * 30)) % 256
      }
      
      return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`
    }

    const generateRandom = () => {
      baseColor.value = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`
      generatePalette()
    }

    const selectMood = (moodId) => {
      selectedMood.value = moodId
      // Здесь можно добавить логику для изменения палитры по настроению
      generatePalette()
    }

    const savePalette = () => {
      const paletteData = {
        id: Date.now(),
        name: `Палитра ${new Date().toLocaleDateString('ru-RU')}`,
        method: selectedMethod.value,
        colors: palette.value,
        baseColor: baseColor.value,
        mood: selectedMood.value,
        createdAt: new Date().toISOString()
      }
      emit('save', paletteData)
    }

    const copyColor = (color) => {
      navigator.clipboard.writeText(color.toUpperCase())
    }

    const getBrightness = (hex) => {
      const r = parseInt(hex.substr(1, 2), 16)
      const g = parseInt(hex.substr(3, 2), 16)
      const b = parseInt(hex.substr(5, 2), 16)
      return (r * 299 + g * 587 + b * 114) / 1000
    }

    // Генерируем начальную палитру
    generatePalette()

    watch([baseColor, selectedMethod, colorCount], () => {
      generatePalette()
    })

    return {
      selectedMethod,
      baseColor,
      colorCount,
      selectedMood,
      palette,
      moods,
      generatePalette,
      generateRandom,
      selectMood,
      savePalette,
      copyColor,
      getBrightness
    }
  }
}
</script>

<style scoped>
.advanced-generator {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.generator-header {
  margin-bottom: 2rem;
}

.generator-header h2 {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #333;
  margin-bottom: 0.5rem;
}

.generator-header p {
  color: #666;
}

.generator-controls {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.control-group label {
  font-weight: 600;
  color: #555;
}

select, input[type="range"] {
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  background: white;
  transition: border-color 0.3s ease;
}

select:focus, input[type="range"]:focus {
  outline: none;
  border-color: var(--primary-color);
}

.color-picker-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.color-input {
  width: 60px;
  height: 60px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.color-value {
  font-family: 'Consolas', monospace;
  font-weight: bold;
}

.range-input {
  width: 100%;
}

.range-value {
  text-align: center;
  font-weight: 600;
  color: var(--primary-color);
}

.mood-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.mood-button {
  flex: 1;
  min-width: 120px;
  padding: 0.75rem;
  border: 2px solid #ddd;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
  transition: all 0.3s ease;
}

.mood-button:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.mood-button.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.generated-palette {
  margin-bottom: 2rem;
}

.generated-palette h3 {
  margin-bottom: 1rem;
  color: #333;
}

.palette-display {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.palette-color {
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.palette-color:hover {
  transform: translateY(-5px);
}

.color-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  padding: 0.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.color-info.light-text {
  background: rgba(255, 255, 255, 0.9);
}

.color-hex {
  font-family: 'Consolas', monospace;
  font-weight: bold;
  font-size: 0.9rem;
}

.light-text .color-hex {
  color: #333;
}

.color-copy {
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.palette-color:hover .color-copy {
  opacity: 1;
}

.palette-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
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

.action-button.save {
  background: var(--success-color);
  color: white;
}

.action-button.generate {
  background: var(--primary-color);
  color: white;
}

.action-button.export {
  background: var(--secondary-color);
  color: white;
}

.action-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

@media (max-width: 768px) {
  .generator-controls {
    grid-template-columns: 1fr;
  }
  
  .palette-display {
    grid-template-columns: 1fr;
  }
  
  .palette-actions {
    flex-direction: column;
  }
  
  .action-button {
    width: 100%;
    justify-content: center;
  }
}
</style>