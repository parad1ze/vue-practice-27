<template>
  <div class="generator-view">
    <div class="view-header">
      <h1><i class="fas fa-magic"></i> Генератор цветовых палитр</h1>
      <p>Создавайте гармоничные цветовые схемы различными методами</p>
    </div>

    <div class="view-tabs">
      <button 
        class="tab-button" 
        :class="{ active: activeTab === 'basic' }"
        @click="activeTab = 'basic'"
      >
        <i class="fas fa-star"></i> Базовый (Практика 27)
      </button>
      <button 
        class="tab-button" 
        :class="{ active: activeTab === 'advanced' }"
        @click="activeTab = 'advanced'"
      >
        <i class="fas fa-wand-magic-sparkles"></i> Продвинутый (Практика 28)
      </button>
      <button 
        class="tab-button" 
        :class="{ active: activeTab === 'mood' }"
        @click="activeTab = 'mood'"
      >
        <i class="fas fa-smile"></i> По настроению
      </button>
    </div>

    <div class="tab-content">
      <div v-if="activeTab === 'basic'" class="basic-generator">
        <ColorPalette />
      </div>

      <div v-if="activeTab === 'advanced'" class="advanced-generator">
        <AdvancedGenerator 
          @save="saveToLibrary"
          @export="handleExport"
        />
      </div>

      <div v-if="activeTab === 'mood'" class="mood-generator">
        <div class="mood-selection">
          <h2><i class="fas fa-heart"></i> Выберите настроение палитры</h2>
          <div class="mood-grid">
            <div 
              v-for="mood in moods" 
              :key="mood.id"
              class="mood-card"
              :class="{ active: selectedMood === mood.id }"
              @click="selectMood(mood.id)"
            >
              <div class="mood-icon" :style="{ color: mood.color }">
                <i :class="mood.icon"></i>
              </div>
              <h3>{{ mood.name }}</h3>
              <p>{{ mood.description }}</p>
              <div class="mood-preview">
                <div 
                  v-for="color in mood.preview" 
                  :key="color"
                  class="preview-color"
                  :style="{ backgroundColor: color }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div class="mood-palette" v-if="selectedMood">
          <h3>Сгенерированная палитра</h3>
          <div class="palette-display">
            <div
              v-for="(color, index) in moodPalette"
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
          
          <div class="palette-actions">
            <button class="action-button generate" @click="generateMoodPalette">
              <i class="fas fa-sync-alt"></i> Сгенерировать заново
            </button>
            <button class="action-button save" @click="saveMoodPalette">
              <i class="fas fa-save"></i> Сохранить палитру
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="generator-stats">
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-palette"></i>
        </div>
        <div class="stat-info">
          <h3>{{ stats.palettesGenerated }}</h3>
          <p>Сгенерировано палитр</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-save"></i>
        </div>
        <div class="stat-info">
          <h3>{{ stats.palettesSaved }}</h3>
          <p>Сохранено в библиотеку</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-favorite"></i>
        </div>
        <div class="stat-info">
          <h3>{{ stats.favorites }}</h3>
          <p>Избранных палитр</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import ColorPalette from '../components/ColorPalette.vue'
import AdvancedGenerator from '../components/AdvancedGenerator.vue'

export default {
  name: 'GeneratorView',
  components: {
    ColorPalette,
    AdvancedGenerator
  },
  setup() {
    const router = useRouter()
    const activeTab = ref('basic')
    const selectedMood = ref('calm')
    const moodPalette = ref([])
    const stats = ref({
      palettesGenerated: 0,
      palettesSaved: 0,
      favorites: 0
    })

    const moods = [
      {
        id: 'calm',
        name: 'Спокойное',
        description: 'Мягкие и умиротворяющие тона',
        icon: 'fas fa-spa',
        color: '#4ECDC4',
        preview: ['#B5EAD7', '#C7CEEA', '#FFDAC1', '#FFB7B2', '#FF9AA2']
      },
      {
        id: 'energetic',
        name: 'Энергичное',
        description: 'Яркие и динамичные цвета',
        icon: 'fas fa-bolt',
        color: '#FF6B6B',
        preview: ['#FF6B6B', '#FFD166', '#06D6A0', '#118AB2', '#EF476F']
      },
      {
        id: 'professional',
        name: 'Профессиональное',
        description: 'Сдержанные и деловые оттенки',
        icon: 'fas fa-briefcase',
        color: '#2D3748',
        preview: ['#2D3748', '#4A5568', '#718096', '#CBD5E0', '#EDF2F7']
      },
      {
        id: 'creative',
        name: 'Креативное',
        description: 'Необычные и вдохновляющие сочетания',
        icon: 'fas fa-paint-brush',
        color: '#9F7AEA',
        preview: ['#9F7AEA', '#D53F8C', '#38B2AC', '#ED8936', '#48BB78']
      },
      {
        id: 'warm',
        name: 'Тёплое',
        description: 'Уютные и приятные тона',
        icon: 'fas fa-sun',
        color: '#ED8936',
        preview: ['#ED8936', '#DD6B20', '#C05621', '#9C4221', '#7B341E']
      },
      {
        id: 'cool',
        name: 'Холодное',
        description: 'Свежие и современные цвета',
        icon: 'fas fa-snowflake',
        color: '#4299E1',
        preview: ['#4299E1', '#3182CE', '#2B6CB0', '#2C5282', '#2A4365']
      }
    ]

    const selectMood = (moodId) => {
      selectedMood.value = moodId
      generateMoodPalette()
    }

    const generateMoodPalette = () => {
      const mood = moods.find(m => m.id === selectedMood.value)
      if (!mood) return

      // Генерируем 5 гармоничных цветов на основе цвета настроения
      const baseColor = mood.color
      const colors = []
      
      for (let i = 0; i < 5; i++) {
        const color = generateColorVariation(baseColor, i)
        colors.push(color)
      }
      
      moodPalette.value = colors
      stats.value.palettesGenerated++
      saveStats()
    }

    const generateColorVariation = (baseHex, index) => {
      // Преобразуем HEX в HSL для удобства манипуляций
      const [h, s, l] = hexToHsl(baseHex)
      
      // Создаем вариации
      const newH = (h + (index * 30)) % 360
      const newS = Math.min(100, s + (index * 5))
      const newL = Math.min(90, l + (index * 10))
      
      return hslToHex(newH, newS, newL)
    }

    const hexToHsl = (hex) => {
      const r = parseInt(hex.substr(1, 2), 16) / 255
      const g = parseInt(hex.substr(3, 2), 16) / 255
      const b = parseInt(hex.substr(5, 2), 16) / 255
      
      const max = Math.max(r, g, b)
      const min = Math.min(r, g, b)
      let h, s, l = (max + min) / 2
      
      if (max === min) {
        h = s = 0
      } else {
        const d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break
          case g: h = (b - r) / d + 2; break
          case b: h = (r - g) / d + 4; break
        }
        
        h /= 6
      }
      
      return [h * 360, s * 100, l * 100]
    }

    const hslToHex = (h, s, l) => {
      h /= 360
      s /= 100
      l /= 100
      
      let r, g, b
      
      if (s === 0) {
        r = g = b = l
      } else {
        const hue2rgb = (p, q, t) => {
          if (t < 0) t += 1
          if (t > 1) t -= 1
          if (t < 1/6) return p + (q - p) * 6 * t
          if (t < 1/2) return q
          if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
          return p
        }
        
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s
        const p = 2 * l - q
        
        r = hue2rgb(p, q, h + 1/3)
        g = hue2rgb(p, q, h)
        b = hue2rgb(p, q, h - 1/3)
      }
      
      const toHex = x => {
        const hex = Math.round(x * 255).toString(16)
        return hex.length === 1 ? '0' + hex : hex
      }
      
      return `#${toHex(r)}${toHex(g)}${toHex(b)}`
    }

    const getBrightness = (hex) => {
      const r = parseInt(hex.substr(1, 2), 16)
      const g = parseInt(hex.substr(3, 2), 16)
      const b = parseInt(hex.substr(5, 2), 16)
      return (r * 299 + g * 587 + b * 114) / 1000
    }

    const copyColor = (color) => {
      navigator.clipboard.writeText(color.toUpperCase())
    }

    const saveMoodPalette = () => {
      const paletteData = {
        id: Date.now(),
        name: `Палитра "${moods.find(m => m.id === selectedMood.value)?.name}"`,
        type: 'mood',
        mood: selectedMood.value,
        colors: [...moodPalette.value],
        createdAt: new Date().toISOString()
      }
      
      saveToLibrary(paletteData)
    }

    const saveToLibrary = (paletteData) => {
      const library = JSON.parse(localStorage.getItem('colorLibrary') || '[]')
      library.unshift(paletteData)
      localStorage.setItem('colorLibrary', JSON.stringify(library))
      
      stats.value.palettesSaved++
      saveStats()
    }

    const handleExport = (palette) => {
      router.push({
        path: '/export',
        query: { colors: palette.join(',') }
      })
    }

    const loadStats = () => {
      const savedStats = localStorage.getItem('generatorStats')
      if (savedStats) {
        stats.value = JSON.parse(savedStats)
      }
    }

    const saveStats = () => {
      localStorage.setItem('generatorStats', JSON.stringify(stats.value))
    }

    onMounted(() => {
      loadStats()
      // Генерируем начальную палитру для выбранного настроения
      generateMoodPalette()
    })

    watch(activeTab, (newTab) => {
      if (newTab === 'mood' && !moodPalette.value.length) {
        generateMoodPalette()
      }
    })

    return {
      activeTab,
      selectedMood,
      moodPalette,
      stats,
      moods,
      selectMood,
      generateMoodPalette,
      getBrightness,
      copyColor,
      saveMoodPalette,
      saveToLibrary,
      handleExport
    }
  }
}
</script>

<style scoped>
.generator-view {
  max-width: 1200px;
  margin: 0 auto;
}

.view-header {
  text-align: center;
  margin-bottom: 2rem;
}

.view-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  color: #333;
}

.view-header p {
  color: #666;
  font-size: 1.1rem;
}

.view-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  justify-content: center;
  flex-wrap: wrap;
}

.tab-button {
  padding: 1rem 2rem;
  border: 2px solid #ddd;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.tab-button:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
  transform: translateY(-2px);
}

.tab-button.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.tab-content {
  margin-bottom: 3rem;
}

.basic-generator {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.advanced-generator {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.mood-generator {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.mood-selection h2 {
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #333;
}

.mood-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.mood-card {
  padding: 1.5rem;
  border: 2px solid #ddd;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.mood-card:hover {
  border-color: var(--primary-color);
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.mood-card.active {
  border-color: var(--primary-color);
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  color: white;
}

.mood-card.active h3,
.mood-card.active p {
  color: white;
}

.mood-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.mood-card h3 {
  margin-bottom: 0.5rem;
  color: #333;
}

.mood-card p {
  color: #666;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.mood-preview {
  display: flex;
  height: 30px;
  border-radius: 6px;
  overflow: hidden;
}

.preview-color {
  flex: 1;
}

.mood-palette h3 {
  margin-bottom: 1rem;
  color: #333;
}

.palette-display {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
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

.action-button.generate {
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

.generator-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.stat-card {
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  font-size: 2rem;
  color: var(--primary-color);
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  color: white;
  border-radius: 50%;
}

.stat-info h3 {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.25rem;
}

.stat-info p {
  color: #666;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .view-header h1 {
    font-size: 2rem;
    flex-direction: column;
    gap: 10px;
  }
  
  .view-tabs {
    flex-direction: column;
  }
  
  .tab-button {
    width: 100%;
    justify-content: center;
  }
  
  .mood-grid {
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
  
  .generator-stats {
    grid-template-columns: 1fr;
  }
}
</style>