<template>
  <div id="app">
    <header class="app-header">
      <div class="header-content">
        <h1><i class="fas fa-palette"></i> Генератор цветовых палитр</h1>
        <p>Практика 28: Vue Router и продвинутые компоненты</p>
      </div>
    </header>

    <nav class="main-nav">
      <router-link to="/" class="nav-link" exact-active-class="active">
        <i class="fas fa-home"></i> Главная
      </router-link>
      <router-link to="/generator" class="nav-link" active-class="active">
        <i class="fas fa-magic"></i> Генератор
      </router-link>
      <router-link to="/library" class="nav-link" active-class="active">
        <i class="fas fa-book"></i> Библиотека
      </router-link>
      <router-link to="/accessibility" class="nav-link" active-class="active">
        <i class="fas fa-universal-access"></i> Доступность
      </router-link>
      <router-link to="/export" class="nav-link" active-class="active">
        <i class="fas fa-download"></i> Экспорт
      </router-link>
    </nav>

    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

   

    <!-- Уведомления -->
    <div v-if="notification.show" class="notification" :class="notification.type">
      <i :class="notification.icon"></i>
      <span>{{ notification.message }}</span>
      <button class="notification-close" @click="hideNotification">&times;</button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'App',
  setup() {
    const notification = ref({
      show: false,
      message: '',
      type: 'info',
      icon: 'fas fa-info-circle'
    })

    const showNotification = (message, type = 'info') => {
      const icons = {
        info: 'fas fa-info-circle',
        success: 'fas fa-check-circle',
        warning: 'fas fa-exclamation-triangle',
        error: 'fas fa-times-circle'
      }
      
      notification.value = {
        show: true,
        message,
        type,
        icon: icons[type] || icons.info
      }
      
      setTimeout(hideNotification, 5000)
    }

    const hideNotification = () => {
      notification.value.show = false
    }

    return {
      notification,
      showNotification,
      hideNotification
    }
  }
}
</script>

<style>
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --success-color: #28a745;
  --warning-color: #ffc107;
  --danger-color: #dc3545;
  --light-color: #f8f9fa;
  --dark-color: #343a40;
}

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
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  color: white;
  padding: 2rem;
  text-align: center;
}

.header-content h1 {
  margin-bottom: 0.5rem;
  font-size: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
}

.header-content p {
  opacity: 0.9;
  font-size: 1.1rem;
}

.main-nav {
  background-color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.nav-link {
  color: #333;
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.nav-link:hover {
  background-color: var(--primary-color);
  color: white;
  transform: translateY(-2px);
}

.nav-link.active {
  background-color: var(--primary-color);
  color: white;
}

.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.app-footer {
  background-color: var(--dark-color);
  color: white;
  text-align: center;
  padding: 1rem;
  margin-top: auto;
  font-size: 0.9rem;
}

.app-footer p {
  margin: 0.3rem 0;
}

.notification {
  position: fixed;
  bottom: 30px;
  right: 30px;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  z-index: 1001;
  animation: slideInRight 0.3s ease;
}

.notification.info {
  background-color: var(--primary-color);
  color: white;
}

.notification.success {
  background-color: var(--success-color);
  color: white;
}

.notification.warning {
  background-color: var(--warning-color);
  color: black;
}

.notification.error {
  background-color: var(--danger-color);
  color: white;
}

.notification-close {
  background: none;
  border: none;
  color: inherit;
  font-size: 1.5rem;
  cursor: pointer;
  margin-left: 10px;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@media (max-width: 768px) {
  .header-content h1 {
    font-size: 2rem;
    flex-direction: column;
    gap: 10px;
  }
  
  .main-nav {
    gap: 1rem;
    padding: 1rem;
  }
  
  .nav-link {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
  
  .main-content {
    padding: 1rem;
  }
  
  .notification {
    bottom: 20px;
    right: 20px;
    left: 20px;
  }
}
</style>