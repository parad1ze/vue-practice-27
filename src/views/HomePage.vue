<template>
  <div class="home-page">
    <div class="hero-section">
      <h1><i class="fas fa-palette"></i> Добро пожаловать!</h1>
      <p class="hero-description">
        Создавайте красивые и гармоничные цветовые палитры для ваших проектов
      </p>
      
      <div class="hero-actions">
        <router-link to="/generator" class="hero-button primary">
          <i class="fas fa-magic"></i> Начать создание
        </router-link>
        <router-link to="/library" class="hero-button secondary">
          <i class="fas fa-book"></i> Моя библиотека
        </router-link>
      </div>
    </div>

    <div class="features-grid">
      <div class="feature-card">
        <div class="feature-icon">
          <i class="fas fa-bolt"></i>
        </div>
        <h3>Быстрая генерация</h3>
        <p>Создавайте палитры одним кликом или на основе выбранного цвета</p>
      </div>
      
      <div class="feature-card">
        <div class="feature-icon">
          <i class="fas fa-universal-access"></i>
        </div>
        <h3>Проверка доступности</h3>
        <p>Анализируйте контрастность цветов по стандарту WCAG</p>
      </div>
      
      <div class="feature-card">
        <div class="feature-icon">
          <i class="fas fa-save"></i>
        </div>
        <h3>Сохранение палитр</h3>
        <p>Храните свои любимые палитры в организованной библиотеке</p>
      </div>
      
      <div class="feature-card">
        <div class="feature-icon">
          <i class="fas fa-download"></i>
        </div>
        <h3>Множество форматов</h3>
        <p>Экспортируйте цвета в CSS, SCSS, JSON и другие форматы</p>
      </div>
    </div>

    <div class="quick-palettes">
      <h2><i class="fas fa-star"></i> Популярные палитры</h2>
      <div class="palettes-grid">
        <div 
          v-for="palette in popularPalettes" 
          :key="palette.id"
          class="palette-card"
          @click="viewPalette(palette.id)"
        >
          <div class="palette-colors">
            <div 
              v-for="color in palette.colors" 
              :key="color"
              class="palette-color"
              :style="{ backgroundColor: color }"
              :title="color"
            ></div>
          </div>
          <div class="palette-info">
            <h4>{{ palette.name }}</h4>
            <p>{{ palette.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="stats-section">
      <h2><i class="fas fa-chart-bar"></i> Статистика</h2>
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-value">{{ savedPalettesCount }}</div>
          <div class="stat-label">Сохранённых палитр</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ generatedColorsCount }}</div>
          <div class="stat-label">Сгенерированных цветов</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ favoritePalettesCount }}</div>
          <div class="stat-label">Избранных палитр</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'HomePage',
  setup() {
    const router = useRouter()
    
    const popularPalettes = ref([
      {
        id: 1,
        name: 'Пастельная',
        description: 'Мягкие и спокойные тона',
        colors: ['#FFB6C1', '#FFDAC1', '#E2F0CB', '#B5EAD7', '#C7CEEA']
      },
      {
        id: 2,
        name: 'Тёмная тема',
        description: 'Для ночного режима',
        colors: ['#121212', '#1E1E1E', '#2D2D2D', '#3D3D3D', '#4D4D4D']
      },
      {
        id: 3,
        name: 'Яркая',
        description: 'Энергичные цвета',
        colors: ['#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0', '#118AB2']
      }
    ])
    
    const savedPalettesCount = ref(12)
    const generatedColorsCount = ref(156)
    const favoritePalettesCount = ref(8)
    
    const viewPalette = (id) => {
      router.push(`/library/${id}`)
    }
    
    onMounted(() => {
      // Загружаем статистику из localStorage
      const stats = JSON.parse(localStorage.getItem('paletteStats') || '{}')
      savedPalettesCount.value = stats.savedCount || savedPalettesCount.value
      generatedColorsCount.value = stats.generatedCount || generatedColorsCount.value
      favoritePalettesCount.value = stats.favoriteCount || favoritePalettesCount.value
    })
    
    return {
      popularPalettes,
      savedPalettesCount,
      generatedColorsCount,
      favoritePalettesCount,
      viewPalette
    }
  }
}
</script>

<style scoped>
.home-page {
  max-width: 1200px;
  margin: 0 auto;
}

.hero-section {
  text-align: center;
  padding: 3rem 2rem;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  color: white;
  border-radius: 16px;
  margin-bottom: 3rem;
}

.hero-section h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.hero-description {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.hero-button {
  padding: 1rem 2rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: var(--transition);
}

.hero-button.primary {
  background-color: white;
  color: var(--primary-color);
}

.hero-button.primary:hover {
  background-color: #f8f9fa;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.hero-button.secondary {
  background-color: transparent;
  color: white;
  border: 2px solid white;
}

.hero-button.secondary:hover {
  background-color: white;
  color: var(--primary-color);
  transform: translateY(-2px);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.feature-card {
  padding: 2rem;
  background-color: var(--bg-color);
  border-radius: 12px;
  text-align: center;
  transition: var(--transition);
  border: 1px solid var(--border-color);
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow);
}

.feature-icon {
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.feature-card h3 {
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.feature-card p {
  color: var(--text-color);
  opacity: 0.8;
}

.quick-palettes {
  margin-bottom: 3rem;
}

.quick-palettes h2 {
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-color);
}

.palettes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.palette-card {
  background-color: var(--bg-color);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: var(--transition);
  border: 1px solid var(--border-color);
}

.palette-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow);
}

.palette-colors {
  display: flex;
  height: 80px;
}

.palette-color {
  flex: 1;
}

.palette-info {
  padding: 1rem;
}

.palette-info h4 {
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.palette-info p {
  color: var(--text-color);
  opacity: 0.7;
  font-size: 0.9rem;
}

.stats-section {
  background-color: var(--light-color);
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
}

.stats-section h2 {
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-color);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;
}

.stat-item {
  text-align: center;
  padding: 1rem;
  background-color: var(--bg-color);
  border-radius: 8px;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.stat-label {
  color: var(--text-color);
  opacity: 0.8;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .hero-section h1 {
    font-size: 2rem;
    flex-direction: column;
    gap: 10px;
  }
  
  .hero-button {
    width: 100%;
    justify-content: center;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .palettes-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>