<template>
  <div class="palette-controls">
    <div class="controls-grid">
      <div class="control-group">
        <h3><i class="fas fa-sliders-h"></i> Настройки палитры</h3>
        
        <div class="control-item">
          <label for="color-count">Количество цветов:</label>
          <select id="color-count" v-model="localColorCount" @change="$emit('update-count', parseInt(localColorCount))">
            <option value="3">3 цвета</option>
            <option value="5">5 цветов</option>
            <option value="7">7 цветов</option>
          </select>
        </div>
        
        <div class="control-item">
          <label>Формат отображения:</label>
          <div class="format-buttons">
            <button
              class="format-button"
              :class="{ active: localColorFormat === 'hex' }"
              @click="updateFormat('hex')"
            >
              HEX
            </button>
            <button
              class="format-button"
              :class="{ active: localColorFormat === 'rgb' }"
              @click="updateFormat('rgb')"
            >
              RGB
            </button>
          </div>
        </div>
        
        <div class="control-item">
          <button class="generate-button" @click="$emit('generate')">
            <i class="fas fa-random"></i> Сгенерировать палитру
          </button>
        </div>
      </div>
      
      <div class="control-group">
        <h3><i class="fas fa-thumbtack"></i> Закрепленные цвета</h3>
        
        <div v-if="pinnedColors.length > 0" class="pinned-colors">
          <div class="pinned-color-grid">
            <div
              v-for="(color, index) in pinnedColors"
              :key="index"
              class="pinned-color"
              :style="{ backgroundColor: color }"
              :title="color"
              @click="$emit('toggle-pin', color)"
            >
              <button class="remove-pin" @click.stop="$emit('toggle-pin', color)">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
          <button class="clear-button" @click="$emit('clear-pinned')">
            <i class="fas fa-trash"></i> Очистить закрепленные
          </button>
        </div>
        
        <div v-else class="no-pinned-colors">
          <p>Нет закрепленных цветов. Нажмите значок 📌 на цветовой карточке, чтобы закрепить цвет.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'

export default {
  name: 'PaletteControls',
  props: {
    colorCount: {
      type: Number,
      default: 5
    },
    colorFormat: {
      type: String,
      default: 'hex'
    },
    pinnedColors: {
      type: Array,
      default: () => []
    }
  },
  emits: ['generate', 'update-count', 'update-format', 'toggle-pin', 'clear-pinned'],
  setup(props, { emit }) {
    const localColorCount = ref(props.colorCount)
    const localColorFormat = ref(props.colorFormat)

    watch(() => props.colorCount, (newVal) => {
      localColorCount.value = newVal
    })

    watch(() => props.colorFormat, (newVal) => {
      localColorFormat.value = newVal
    })

    const updateFormat = (format) => {
      localColorFormat.value = format
      emit('update-format', format)
    }

    return {
      localColorCount,
      localColorFormat,
      updateFormat
    }
  }
}
</script>

<style scoped>
.palette-controls {
  width: 100%;
}

.controls-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.control-group {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.control-group h3 {
  margin-bottom: 20px;
  color: #333;
  display: flex;
  align-items: center;
  gap: 10px;
}

.control-item {
  margin-bottom: 20px;
}

.control-item label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #555;
}

select {
  width: 100%;
  padding: 10px 15px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  background: white;
  cursor: pointer;
  transition: border-color 0.3s ease;
}

select:focus {
  outline: none;
  border-color: #667eea;
}

.format-buttons {
  display: flex;
  gap: 10px;
}

.format-button {
  flex: 1;
  padding: 10px 20px;
  border: 2px solid #ddd;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.format-button:hover {
  border-color: #667eea;
  color: #667eea;
}

.format-button.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.generate-button {
  width: 100%;
  padding: 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.generate-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
}

.pinned-colors {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.pinned-color-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
  gap: 10px;
}

.pinned-color {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  position: relative;
  cursor: pointer;
  transition: transform 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.pinned-color:hover {
  transform: scale(1.1);
}

.pinned-color:hover .remove-pin {
  opacity: 1;
}

.remove-pin {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 0.8rem;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-button {
  padding: 10px 20px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: background-color 0.3s ease;
}

.clear-button:hover {
  background: #c82333;
}

.no-pinned-colors {
  padding: 20px;
  text-align: center;
  color: #666;
  font-style: italic;
  background: #e9ecef;
  border-radius: 6px;
}

@media (max-width: 768px) {
  .controls-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .pinned-color-grid {
    grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
  }
  
  .pinned-color {
    width: 40px;
    height: 40px;
  }
}
</style>