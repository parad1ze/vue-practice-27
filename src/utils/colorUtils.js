// Генерация случайного цвета в HEX формате
export function generateRandomColor() {
  const hex = Math.floor(Math.random() * 16777215).toString(16)
  return '#' + hex.padStart(6, '0')
}

// Генерация гармоничной палитры
export function generateHarmoniousColors(count) {
  const colors = []
  
  // Генерируем базовый цвет
  const baseHue = Math.floor(Math.random() * 360)
  
  for (let i = 0; i < count; i++) {
    // Создаем гармоничные цвета на основе цветового круга
    const hue = (baseHue + (i * 360 / count)) % 360
    
    // Используем разные насыщенность и яркость для разнообразия
    const saturation = 70 + Math.random() * 20  // 70-90%
    const lightness = 40 + Math.random() * 30   // 40-70%
    
    colors.push(hslToHex(hue, saturation, lightness))
  }
  
  return colors
}

// Конвертация HSL в HEX
export function hslToHex(h, s, l) {
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

// Конвертация HEX в RGB
export function hexToRgb(hex) {
  // Убираем # если есть
  hex = hex.replace('#', '')
  
  // Разбиваем на компоненты
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  
  return [r, g, b]
}

// Расчет яркости цвета
export function getColorBrightness(hex) {
  const [r, g, b] = hexToRgb(hex)
  // Формула для расчета воспринимаемой яркости
  return (r * 299 + g * 587 + b * 114) / 1000
}

// Проверка контрастности (WCAG)
export function getContrastRatio(color1, color2) {
  const luminance1 = getRelativeLuminance(color1)
  const luminance2 = getRelativeLuminance(color2)
  
  const lighter = Math.max(luminance1, luminance2)
  const darker = Math.min(luminance1, luminance2)
  
  return (lighter + 0.05) / (darker + 0.05)
}

// Относительная яркость для WCAG
function getRelativeLuminance(hex) {
  const [r, g, b] = hexToRgb(hex)
  
  const sRGB = [r, g, b].map(val => {
    val /= 255
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4)
  })
  
  return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2]
}

// Упрощенная версия для немедленного исправления
export function simpleGenerateColors(count) {
  const colors = []
  for (let i = 0; i < count; i++) {
    colors.push(generateRandomColor())
  }
  return colors
}