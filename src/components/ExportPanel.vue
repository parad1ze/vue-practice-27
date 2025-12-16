<template>
  <div class="export-panel">
    <div class="panel-header">
      <h2><i class="fas fa-download"></i> Экспорт палитр</h2>
      <p>Экспортируйте цвета в различные форматы для использования в проектах</p>
    </div>

    <div class="export-controls">
      <div class="control-group">
        <label for="export-format">Формат экспорта:</label>
        <select id="export-format" v-model="selectedFormat" @change="generateExportCode">
          <option value="css">CSS Variables</option>
          <option value="scss">SCSS Variables</option>
          <option value="tailwind">Tailwind Config</option>
          <option value="json">JSON</option>
          <option value="swift">Swift (iOS)</option>
          <option value="kotlin">Kotlin (Android)</option>
        </select>
      </div>

      <div class="control-group">
        <label for="color-naming">Стиль именования:</label>
        <select id="color-naming" v-model="namingStyle" @change="generateExportCode">
          <option value="descriptive">Описательный (primary, secondary)</option>
          <option value="functional">Функциональный (text, background)</option>
          <option value="numbered">Нумерованный (color-1, color-2)</option>
          <option value="hex">По HEX значениям</option>
        </select>
      </div>

      <div class="control-group">
        <label for="prefix">Префикс:</label>
        <input 
          type="text" 
          id="prefix" 
          v-model="prefix" 
          @input="generateExportCode"
          placeholder="например: theme-"
          class="prefix-input"
        >
      </div>
    </div>

    <div class="colors-to-export">
      <h3>Цвета для экспорта</h3>
      <div class="colors-list">
        <div 
          v-for="(color, index) in colors" 
          :key="index"
          class="color-item"
        >
          <div 
            class="color-preview" 
            :style="{ backgroundColor: color }"
          ></div>
          <input 
            type="text" 
            v-model="colorNames[index]"
            @input="updateColorName(index, $event)"
            class="color-name-input"
            :placeholder="getDefaultName(index)"
          >
          <div class="color-value">{{ color.toUpperCase() }}</div>
          <button 
            class="remove-color"
            @click="removeColor(index)"
            title="Удалить цвет"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
      
      <div class="add-color-section">
        <input 
          type="color" 
          v-model="newColor"
          class="add-color-input"
        >
        <input 
          type="text" 
          v-model="newColor"
          @keyup.enter="addColor"
          placeholder="#000000"
          class="add-color-text"
        >
        <button @click="addColor" class="add-color-button">
          <i class="fas fa-plus"></i> Добавить цвет
        </button>
      </div>
    </div>

    <div class="export-preview">
      <h3>Результат экспорта</h3>
      <div class="preview-header">
        <div class="format-info">
          <span class="format-name">{{ formatNames[selectedFormat] }}</span>
          <span class="code-size">{{ exportCode.length }} символов</span>
        </div>
        <div class="preview-actions">
          <button @click="copyToClipboard" class="copy-button">
            <i class="fas fa-copy"></i> Копировать
          </button>
          <button @click="downloadFile" class="download-button">
            <i class="fas fa-download"></i> Скачать файл
          </button>
        </div>
      </div>
      
      <pre class="export-code"><code>{{ exportCode }}</code></pre>
    </div>

    <div class="export-presets">
      <h3>Быстрые шаблоны</h3>
      <div class="presets-grid">
        <button 
          v-for="preset in presets" 
          :key="preset.id"
          class="preset-button"
          @click="applyPreset(preset)"
        >
          <div class="preset-colors">
            <div 
              v-for="color in preset.colors" 
              :key="color"
              class="preset-color"
              :style="{ backgroundColor: color }"
            ></div>
          </div>
          <div class="preset-info">
            <strong>{{ preset.name }}</strong>
            <span>{{ preset.description }}</span>
          </div>
        </button>
      </div>
    </div>

    <div class="export-actions">
      <button class="action-button share" @click="sharePalette">
        <i class="fas fa-share-alt"></i> Поделиться ссылкой
      </button>
      <button class="action-button save" @click="saveExportTemplate">
        <i class="fas fa-save"></i> Сохранить шаблон
      </button>
      <button class="action-button reset" @click="resetExport">
        <i class="fas fa-redo"></i> Сбросить
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'

export default {
  name: 'ExportPanel',
  props: {
    initialColors: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    const selectedFormat = ref('css')
    const namingStyle = ref('descriptive')
    const prefix = ref('')
    const colors = ref([...props.initialColors])
    const colorNames = ref([])
    const newColor = ref('#667eea')
    const exportCode = ref('')
    const exportHistory = ref([])

    const formatNames = {
      css: 'CSS Variables',
      scss: 'SCSS Variables',
      tailwind: 'Tailwind Config',
      json: 'JSON',
      swift: 'Swift (iOS)',
      kotlin: 'Kotlin (Android)'
    }

    const presets = [
      {
        id: 1,
        name: 'Material Design',
        description: 'Цветовая палитра от Google',
        colors: ['#6200EE', '#03DAC6', '#018786', '#3700B3', '#000000']
      },
      {
        id: 2,
        name: 'Пастельная',
        description: 'Мягкие пастельные тона',
        colors: ['#FFB6C1', '#FFDAC1', '#E2F0CB', '#B5EAD7', '#C7CEEA']
      },
      {
        id: 3,
        name: 'Тёмная тема',
        description: 'Для ночного режима',
        colors: ['#121212', '#1E1E1E', '#2D2D2D', '#3D3D3D', '#4D4D4D']
      },
      {
        id: 4,
        name: 'Яркая палитра',
        description: 'Энергичные цвета',
        colors: ['#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0', '#118AB2']
      }
    ]

    const nameGenerators = {
      descriptive: (index) => {
        const names = ['primary', 'secondary', 'accent', 'background', 'text', 'success', 'warning', 'error', 'info']
        return names[index] || `color-${index + 1}`
      },
      functional: (index) => {
        const names = ['text-primary', 'text-secondary', 'background-primary', 'background-secondary', 'accent', 'border', 'link']
        return names[index] || `color-${index + 1}`
      },
      numbered: (index) => `color-${index + 1}`,
      hex: (index) => colors.value[index].replace('#', 'color-').toLowerCase()
    }

    const getDefaultName = (index) => {
      return nameGenerators[namingStyle.value](index)
    }

    const updateColorName = (index, event) => {
      colorNames.value[index] = event.target.value
      generateExportCode()
    }

    const addColor = () => {
      if (/^#[0-9A-F]{6}$/i.test(newColor.value)) {
        colors.value.push(newColor.value.toUpperCase())
        colorNames.value.push(getDefaultName(colors.value.length - 1))
        generateExportCode()
      }
    }

    const removeColor = (index) => {
      colors.value.splice(index, 1)
      colorNames.value.splice(index, 1)
      generateExportCode()
    }

    const generateExportCode = () => {
      const formatGenerators = {
        css: () => {
          let code = ':root {\n'
          colors.value.forEach((color, index) => {
            const name = colorNames.value[index] || getDefaultName(index)
            const variableName = prefix.value ? `--${prefix.value}${name}` : `--${name}`
            code += `  ${variableName}: ${color};\n`
          })
          code += '}'
          return code
        },
        
        scss: () => {
          let code = ''
          colors.value.forEach((color, index) => {
            const name = colorNames.value[index] || getDefaultName(index)
            const variableName = prefix.value ? `$${prefix.value}${name}` : `$${name}`
            code += `${variableName}: ${color};\n`
          })
          return code.trim()
        },
        
        tailwind: () => {
          let code = 'module.exports = {\n  theme: {\n    extend: {\n      colors: {\n'
          colors.value.forEach((color, index) => {
            const name = colorNames.value[index] || getDefaultName(index)
            code += `        '${name}': '${color}',\n`
          })
          code += '      }\n    }\n  }\n}'
          return code
        },
        
        json: () => {
          const obj = {}
          colors.value.forEach((color, index) => {
            const name = colorNames.value[index] || getDefaultName(index)
            obj[name] = color
          })
          return JSON.stringify(obj, null, 2)
        },
        
        swift: () => {
          let code = 'import UIKit\n\n'
          code += 'extension UIColor {\n'
          colors.value.forEach((color, index) => {
            const name = colorNames.value[index] || getDefaultName(index)
            const swiftName = name.replace(/-/g, '_')
            const rgb = hexToRgb(color)
            code += `    static let ${swiftName} = UIColor(\n`
            code += `        red: ${(rgb[0]/255).toFixed(3)},\n`
            code += `        green: ${(rgb[1]/255).toFixed(3)},\n`
            code += `        blue: ${(rgb[2]/255).toFixed(3)},\n`
            code += `        alpha: 1.0\n`
            code += `    )\n`
          })
          code += '}'
          return code
        },
        
        kotlin: () => {
          let code = 'package com.example.app\n\n'
          code += 'object AppColors {\n'
          colors.value.forEach((color, index) => {
            const name = colorNames.value[index] || getDefaultName(index)
            const kotlinName = toCamelCase(name)
            code += `    val ${kotlinName} = Color(0xFF${color.replace('#', '')})\n`
          })
          code += '}'
          return code
        }
      }

      exportCode.value = formatGenerators[selectedFormat.value]?.() || ''
    }

    const hexToRgb = (hex) => {
      const r = parseInt(hex.substr(1, 2), 16)
      const g = parseInt(hex.substr(3, 2), 16)
      const b = parseInt(hex.substr(5, 2), 16)
      return [r, g, b]
    }

    const toCamelCase = (str) => {
      return str.replace(/[-_](.)/g, (_, c) => c.toUpperCase())
    }

    const copyToClipboard = () => {
      navigator.clipboard.writeText(exportCode.value)
    }

    const downloadFile = () => {
      let extension = ''
      let mimeType = ''
      
      switch(selectedFormat.value) {
        case 'css': extension = '.css'; mimeType = 'text/css'; break
        case 'scss': extension = '.scss'; mimeType = 'text/scss'; break
        case 'json': extension = '.json'; mimeType = 'application/json'; break
        case 'swift': extension = '.swift'; mimeType = 'text/x-swift'; break
        case 'kotlin': extension = '.kt'; mimeType = 'text/x-kotlin'; break
        default: extension = '.js'; mimeType = 'text/javascript'
      }
      
      const filename = `palette-${Date.now()}${extension}`
      const blob = new Blob([exportCode.value], { type: mimeType })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }

    const applyPreset = (preset) => {
      colors.value = [...preset.colors]
      colorNames.value = colors.value.map((_, index) => getDefaultName(index))
      generateExportCode()
    }

    const sharePalette = () => {
      const data = {
        colors: colors.value,
        names: colorNames.value,
        format: selectedFormat.value,
        prefix: prefix.value
      }
      
      const encoded = btoa(JSON.stringify(data))
      const url = `${window.location.origin}${window.location.pathname}#palette=${encoded}`
      
      navigator.clipboard.writeText(url)
    }

    const saveExportTemplate = () => {
      const template = {
        id: Date.now(),
        name: `Шаблон ${new Date().toLocaleDateString('ru-RU')}`,
        colors: [...colors.value],
        colorNames: [...colorNames.value],
        format: selectedFormat.value,
        namingStyle: namingStyle.value,
        prefix: prefix.value,
        createdAt: new Date().toISOString()
      }
      
      exportHistory.value.unshift(template)
      localStorage.setItem('exportTemplates', JSON.stringify(exportHistory.value))
    }

    const resetExport = () => {
      colors.value = [...props.initialColors]
      colorNames.value = colors.value.map((_, index) => getDefaultName(index))
      generateExportCode()
    }

    onMounted(() => {
      // Инициализируем имена цветов
      colorNames.value = colors.value.map((_, index) => getDefaultName(index))
      
      // Загружаем сохраненные шаблоны
      const savedTemplates = localStorage.getItem('exportTemplates')
      if (savedTemplates) {
        exportHistory.value = JSON.parse(savedTemplates)
      }
      
      generateExportCode()
    })

    watch([selectedFormat, namingStyle, prefix, colors, colorNames], () => {
      generateExportCode()
    })

    return {
      selectedFormat,
      namingStyle,
      prefix,
      colors,
      colorNames,
      newColor,
      exportCode,
      presets,
      formatNames,
      getDefaultName,
      updateColorName,
      addColor,
      removeColor,
      copyToClipboard,
      downloadFile,
      applyPreset,
      sharePalette,
      saveExportTemplate,
      resetExport
    }
  }
}
</script>

<style scoped>
.export-panel {
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

.export-controls {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
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

select, .prefix-input {
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  background: white;
  transition: border-color 0.3s ease;
}

select:focus, .prefix-input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.colors-to-export {
  margin-bottom: 2rem;
}

.colors-to-export h3 {
  margin-bottom: 1rem;
  color: #333;
}

.colors-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.color-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.color-preview {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  border: 2px solid #ddd;
}

.color-name-input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
}

.color-value {
  font-family: 'Consolas', monospace;
  font-size: 0.9rem;
  font-weight: bold;
  min-width: 80px;
}

.remove-color {
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.remove-color:hover {
  background: #f8d7da;
}

.add-color-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.add-color-input {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.add-color-text {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-family: 'Consolas', monospace;
}

.add-color-button {
  padding: 0.75rem 1.5rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.add-color-button:hover {
  background: var(--secondary-color);
  transform: translateY(-2px);
}

.export-preview {
  margin-bottom: 2rem;
}

.export-preview h3 {
  margin-bottom: 1rem;
  color: #333;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.format-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.format-name {
  font-weight: bold;
  font-size: 1.1rem;
}

.code-size {
  font-size: 0.9rem;
  color: #666;
}

.preview-actions {
  display: flex;
  gap: 1rem;
}

.copy-button, .download-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.copy-button {
  background: var(--primary-color);
  color: white;
}

.download-button {
  background: var(--success-color);
  color: white;
}

.copy-button:hover, .download-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

.export-code {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 1.5rem;
  border-radius: 8px;
  overflow-x: auto;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 0.9rem;
  line-height: 1.5;
  max-height: 400px;
  overflow-y: auto;
}

.export-presets {
  margin-bottom: 2rem;
}

.export-presets h3 {
  margin-bottom: 1rem;
  color: #333;
}

.presets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.preset-button {
  padding: 1rem;
  background: #f8f9fa;
  border: 2px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.preset-button:hover {
  border-color: var(--primary-color);
  transform: translateY(-3px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.preset-colors {
  display: flex;
  height: 30px;
  border-radius: 4px;
  overflow: hidden;
}

.preset-color {
  flex: 1;
}

.preset-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.preset-info strong {
  color: #333;
}

.preset-info span {
  font-size: 0.9rem;
  color: #666;
}

.export-actions {
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

.action-button.share {
  background: var(--primary-color);
  color: white;
}

.action-button.save {
  background: var(--success-color);
  color: white;
}

.action-button.reset {
  background: #6c757d;
  color: white;
}

.action-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

@media (max-width: 768px) {
  .export-controls {
    grid-template-columns: 1fr;
  }
  
  .colors-list {
    grid-template-columns: 1fr;
  }
  
  .add-color-section {
    flex-direction: column;
  }
  
  .add-color-button {
    width: 100%;
    justify-content: center;
  }
  
  .preview-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .presets-grid {
    grid-template-columns: 1fr;
  }
  
  .export-actions {
    flex-direction: column;
  }
  
  .action-button {
    width: 100%;
    justify-content: center;
  }
}
</style>