<template>
  <div class="home-view">
    <div class="hero-section">
      <h1><i class="fas fa-palette"></i> Добро пожаловать в генератор палитр!</h1>
      <p class="hero-description">
        Создавайте, анализируйте и сохраняйте красивые цветовые схемы для ваших проектов
      </p>
      
      <div class="hero-actions">
        <router-link to="/generator" class="hero-button primary">
          <i class="fas fa-magic"></i> Создать палитру
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
        <h3>Продвинутая генерация</h3>
        <p>Создавайте палитры на основе базового цвета или типа (аналогичная, монохромная, триада)</p>
      </div>
      
      <div class="feature-card">
        <div class="feature-icon">
          <i class="fas fa-universal-access"></i>
        </div>
        <h3>Проверка доступности</h3>
        <p>Анализируйте контрастность цветов по стандарту WCAG AA/AAA</p>
      </div>
      
      <div class="feature-card">
        <div class="feature-icon">
          <i class="fas fa-save"></i>
        </div>
        <h3>Управление библиотекой</h3>
        <p>Сохраняйте палитры, создавайте коллекции и организуйте их по категориям</p>
      </div>
      
      <div class="feature-card">
        <div class="feature-icon">
          <i class="fas fa-download"></i>
        </div>
        <h3>Экспорт в форматы</h3>
        <p>Экспортируйте цвета в CSS, SCSS, Tailwind config и другие форматы</p>
      </div>
    </div>

    <div class="quick-stats">
      <h2><i class="fas fa-chart-bar"></i> Быстрый доступ</h2>
      <div class="stats-grid">
        <router-link to="/generator?type=analogous" class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-paint-brush"></i>
          </div>
          <div class="stat-info">
            <h3>Аналогичные цвета</h3>
            <p>Создать гармоничную палитру</p>
          </div>
        </router-link>
        
        <router-link to="/generator?type=monochromatic" class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-layer-group"></i>
          </div>
          <div class="stat-info">
            <h3>Монохромная</h3>
            <p>Оттенки одного цвета</p>
          </div>
        </router-link>
        
        <router-link to="/accessibility" class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-eye"></i>
          </div>
          <div class="stat-info">
            <h3>Проверить доступность</h3>
            <p>Анализ контрастности</p>
          </div>
        </router-link>
        
        <router-link to="/export" class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-file-export"></i>
          </div>
          <div class="stat-info">
            <h3>Экспорт</h3>
            <p>В различные форматы</p>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
  setup() {
    return {}
  }
}
</script>

<style scoped>
.home-view {
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
  font-size: 2.5rem;
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
  transition: all 0.3s ease;
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
  background: white;
  border-radius: 12px;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.feature-card h3 {
  margin-bottom: 0.5rem;
  color: #333;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
}

.quick-stats {
  margin-bottom: 3rem;
}

.quick-stats h2 {
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #333;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  background-color: var(--primary-color);
  color: white;
}

.stat-card:hover h3,
.stat-card:hover p {
  color: white;
}

.stat-icon {
  font-size: 2rem;
  color: var(--primary-color);
}

.stat-card:hover .stat-icon {
  color: white;
}

.stat-info h3 {
  margin-bottom: 0.25rem;
  color: #333;
  font-size: 1.1rem;
}

.stat-info p {
  color: #666;
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
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>