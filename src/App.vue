<template>
  <div id="app">
    <header class="app-header">
      <h1><i class="fas fa-palette"></i> Генератор цветовых палитр</h1>
      <p>Практика 27: Vue 3 + Vite • Основы реактивности и компоненты</p>
    </header>

    <main class="main-content">
      <ColorPalette />
    </main>


  </div>
</template>

<script>
import ColorPalette from './components/ColorPalette.vue'

export default {
  name: 'App',
  components: {
    ColorPalette
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f5f5f5;
  color: #333;
  line-height: 1.6;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  text-align: center;
}

.app-header h1 {
  margin-bottom: 0.5rem;
  font-size: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
}

.app-header p {
  opacity: 0.9;
  font-size: 1.1rem;
}

.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.app-footer {
  background-color: #333;
  color: white;
  text-align: center;
  padding: 1rem;
  margin-top: auto;
  font-size: 0.9rem;
}

.app-footer p {
  margin: 0.3rem 0;
}

@media (max-width: 768px) {
  .app-header h1 {
    font-size: 2rem;
    flex-direction: column;
    gap: 10px;
  }
  
  .main-content {
    padding: 1rem;
  }
}
</style>