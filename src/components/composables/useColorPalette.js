import { ref, computed } from 'vue'
import { generateHarmoniousColors, hexToRgb } from '../utils/colorUtils'

export function useColorPalette() {
  const currentPalette = ref([])
  const pinnedColors = ref([])
  const colorCount = ref(5)
  const colorFormat = ref('hex')

  const generatePalette = () => {
    // Генерируем новые цвета, сохраняя закрепленные
    const newColors = generateHarmoniousColors(colorCount.value)
    
    // Заменяем незакрепленные позиции
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
    } else {
      pinnedColors.value.splice(index, 1)
    }
  }

  const clearPinnedColors = () => {
    pinnedColors.value = []
    generatePalette()
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

  return {
    currentPalette,
    pinnedColors,
    colorCount,
    colorFormat,
    generatePalette,
    isColorPinned,
    toggleColorPin,
    clearPinnedColors,
    loadFromStorage,
    saveToStorage
  }
}