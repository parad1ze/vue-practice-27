<template>
  <div class="library-view">
    <div class="view-header">
      <h1><i class="fas fa-book"></i> Библиотека палитр</h1>
      <p>Ваши сохранённые цветовые схемы и коллекции</p>
    </div>

    <div class="library-controls">
      <div class="search-control">
        <input 
          type="text" 
          v-model="searchQuery"
          placeholder="Поиск по названию или цветам..."
          class="search-input"
        >
        <i class="fas fa-search search-icon"></i>
      </div>

      <div class="filter-controls">
        <select v-model="filterType" class="filter-select">
          <option value="all">Все типы</option>
          <option value="basic">Базовые</option>
          <option value="advanced">Продвинутые</option>
          <option value="mood">По настроению</option>
        </select>

        <select v-model="sortBy" class="filter-select">
          <option value="newest">Сначала новые</option>
          <option value="oldest">Сначала старые</option>
          <option value="name">По названию</option>
          <option value="colors">По количеству цветов</option>
        </select>

        <button 
          class="filter-button"
          @click="showFavorites = !showFavorites"
          :class="{ active: showFavorites }"
        >
          <i :class="showFavorites ? 'fas fa-heart' : 'far fa-heart'"></i>
          Только избранные
        </button>
      </div>
    </div>

    <div class="collections-section" v-if="collections.length > 0">
      <h2><i class="fas fa-folder"></i> Коллекции</h2>
      <div class="collections-grid">
        <div 
          v-for="collection in collections" 
          :key="collection.id"
          class="collection-card"
          @click="openCollection(collection.id)"
        >
          <div class="collection-colors">
            <div 
              v-for="color in collection.previewColors" 
              :key="color"
              class="collection-color"
              :style="{ backgroundColor: color }"
            ></div>
          </div>
          <div class="collection-info">
            <h3>{{ collection.name }}</h3>
            <p>{{ collection.palettesCount }} палитр</p>
            <div class="collection-meta">
              <span><i class="fas fa-calendar"></i> {{ formatDate(collection.createdAt) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="palettes-section">
      <div class="section-header">
        <h2><i class="fas fa-palette"></i> Все палитры ({{ filteredPalettes.length }})</h2>
        <button class="create-collection" @click="showCreateCollection = true">
          <i class="fas fa-plus"></i> Создать коллекцию
        </button>
      </div>

      <div v-if="filteredPalettes.length === 0" class="empty-library">
        <i class="fas fa-inbox"></i>
        <h3>Библиотека пуста</h3>
        <p>Сохраняйте созданные палитры, чтобы они появились здесь</p>
        <router-link to="/generator" class="empty-action">
          <i class="fas fa-magic"></i> Создать первую палитру
        </router-link>
      </div>

      <div v-else class="palettes-grid">
        <div 
          v-for="palette in filteredPalettes" 
          :key="palette.id"
          class="palette-card"
          @click="viewPalette(palette.id)"
        >
          <div class="palette-header">
            <h3>{{ palette.name }}</h3>
            <div class="palette-actions">
              <button 
                class="favorite-button"
                @click.stop="toggleFavorite(palette.id)"
                :class="{ favorite: palette.favorite }"
              >
                <i :class="palette.favorite ? 'fas fa-heart' : 'far fa-heart'"></i>
              </button>
              <button 
                class="delete-button"
                @click.stop="deletePalette(palette.id)"
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
          
          <div class="palette-colors">
            <div 
              v-for="color in palette.colors.slice(0, 5)" 
              :key="color"
              class="palette-color"
              :style="{ backgroundColor: color }"
              :title="color"
            ></div>
            <div v-if="palette.colors.length > 5" class="more-colors">
              +{{ palette.colors.length - 5 }}
            </div>
          </div>
          
          <div class="palette-info">
            <div class="palette-meta">
              <span class="palette-type">
                <i :class="getTypeIcon(palette.type)"></i>
                {{ getTypeName(palette.type) }}
              </span>
              <span class="palette-date">
                <i class="fas fa-calendar"></i>
                {{ formatDate(palette.createdAt) }}
              </span>
            </div>
            <div class="palette-stats">
              <span class="color-count">
                <i class="fas fa-droplet"></i>
                {{ palette.colors.length }} цветов
              </span>
              <span v-if="palette.mood" class="palette-mood">
                <i class="fas fa-smile"></i>
                {{ getMoodName(palette.mood) }}
              </span>
            </div>
          </div>
          
          <div class="palette-tags">
            <span 
              v-for="tag in palette.tags || []" 
              :key="tag"
              class="palette-tag"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно создания коллекции -->
    <div v-if="showCreateCollection" class="modal-overlay" @click="showCreateCollection = false">
      <div class="modal-content" @click.stop>
        <h2><i class="fas fa-folder-plus"></i> Создать коллекцию</h2>
        
        <div class="form-group">
          <label for="collection-name">Название коллекции:</label>
          <input 
            type="text" 
            id="collection-name"
            v-model="newCollection.name"
            placeholder="Например: Веб-проекты"
            class="form-input"
          >
        </div>
        
        <div class="form-group">
          <label for="collection-description">Описание:</label>
          <textarea 
            id="collection-description"
            v-model="newCollection.description"
            placeholder="Описание коллекции..."
            rows="3"
            class="form-textarea"
          ></textarea>
        </div>
        
        <div class="form-group">
          <label>Выберите палитры:</label>
          <div class="palettes-selection">
            <div 
              v-for="palette in filteredPalettes" 
              :key="palette.id"
              class="palette-option"
              :class="{ selected: selectedPalettes.includes(palette.id) }"
              @click="togglePaletteSelection(palette.id)"
            >
              <div class="option-colors">
                <div 
                  v-for="color in palette.colors.slice(0, 3)" 
                  :key="color"
                  class="option-color"
                  :style="{ backgroundColor: color }"
                ></div>
              </div>
              <div class="option-info">
                <h4>{{ palette.name }}</h4>
                <p>{{ palette.colors.length }} цветов</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-actions">
          <button class="modal-button cancel" @click="showCreateCollection = false">
            Отмена
          </button>
          <button class="modal-button create" @click="createCollection">
            Создать коллекцию
          </button>
        </div>
      </div>
    </div>

    <!-- Модальное окно экспорта -->
    <div v-if="showExportModal" class="modal-overlay" @click="showExportModal = false">
      <div class="modal-content" @click.stop>
        <ExportPanel :initial-colors="exportPalette.colors" />
        <button class="modal-close" @click="showExportModal = false">
          <i class="fas fa-times"></i> Закрыть
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ExportPanel from '../components/ExportPanel.vue'

export default {
  name: 'LibraryView',
  components: {
    ExportPanel
  },
  setup() {
    const router = useRouter()
    
    const searchQuery = ref('')
    const filterType = ref('all')
    const sortBy = ref('newest')
    const showFavorites = ref(false)
    const palettes = ref([])
    const collections = ref([])
    const showCreateCollection = ref(false)
    const showExportModal = ref(false)
    const selectedPalettes = ref([])
    const exportPalette = ref({ colors: [] })
    
    const newCollection = ref({
      name: '',
      description: ''
    })

    const filteredPalettes = computed(() => {
      let result = [...palettes.value]
      
      // Поиск
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(palette => 
          palette.name.toLowerCase().includes(query) ||
          palette.colors.some(color => color.toLowerCase().includes(query)) ||
          (palette.tags && palette.tags.some(tag => tag.toLowerCase().includes(query)))
        )
      }
      
      // Фильтр по типу
      if (filterType.value !== 'all') {
        result = result.filter(palette => palette.type === filterType.value)
      }
      
      // Фильтр по избранным
      if (showFavorites.value) {
        result = result.filter(palette => palette.favorite)
      }
      
      // Сортировка
      result.sort((a, b) => {
        switch(sortBy.value) {
          case 'newest':
            return new Date(b.createdAt) - new Date(a.createdAt)
          case 'oldest':
            return new Date(a.createdAt) - new Date(b.createdAt)
          case 'name':
            return a.name.localeCompare(b.name)
          case 'colors':
            return b.colors.length - a.colors.length
          default:
            return 0
        }
      })
      
      return result
    })

    const loadPalettes = () => {
      const savedPalettes = localStorage.getItem('colorLibrary')
      if (savedPalettes) {
        palettes.value = JSON.parse(savedPalettes)
      }
      
      const savedCollections = localStorage.getItem('colorCollections')
      if (savedCollections) {
        collections.value = JSON.parse(savedCollections)
      }
    }

    const getTypeIcon = (type) => {
      switch(type) {
        case 'basic': return 'fas fa-star'
        case 'advanced': return 'fas fa-wand-magic-sparkles'
        case 'mood': return 'fas fa-smile'
        default: return 'fas fa-palette'
      }
    }

    const getTypeName = (type) => {
      switch(type) {
        case 'basic': return 'Базовая'
        case 'advanced': return 'Продвинутая'
        case 'mood': return 'По настроению'
        default: return 'Другая'
      }
    }

    const getMoodName = (moodId) => {
      const moods = {
        'calm': 'Спокойное',
        'energetic': 'Энергичное',
        'professional': 'Профессиональное',
        'creative': 'Креативное',
        'warm': 'Тёплое',
        'cool': 'Холодное'
      }
      return moods[moodId] || moodId
    }

    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('ru-RU')
    }

    const viewPalette = (id) => {
      router.push(`/library/${id}`)
    }

    const openCollection = (id) => {
      // Можно сделать отдельную страницу для коллекции
      const collection = collections.value.find(c => c.id === id)
      if (collection) {
        alert(`Открываем коллекцию: ${collection.name}`)
      }
    }

    const toggleFavorite = (id) => {
      const index = palettes.value.findIndex(p => p.id === id)
      if (index !== -1) {
        palettes.value[index].favorite = !palettes.value[index].favorite
        localStorage.setItem('colorLibrary', JSON.stringify(palettes.value))
      }
    }

    const deletePalette = (id) => {
      if (confirm('Удалить эту палитру?')) {
        palettes.value = palettes.value.filter(p => p.id !== id)
        localStorage.setItem('colorLibrary', JSON.stringify(palettes.value))
      }
    }

    const togglePaletteSelection = (id) => {
      const index = selectedPalettes.value.indexOf(id)
      if (index === -1) {
        selectedPalettes.value.push(id)
      } else {
        selectedPalettes.value.splice(index, 1)
      }
    }

    const createCollection = () => {
      if (!newCollection.value.name.trim()) {
        alert('Введите название коллекции')
        return
      }

      const selectedPaletteObjects = palettes.value.filter(p => 
        selectedPalettes.value.includes(p.id)
      )

      const collection = {
        id: Date.now(),
        name: newCollection.value.name,
        description: newCollection.value.description,
        palettesCount: selectedPaletteObjects.length,
        previewColors: selectedPaletteObjects.flatMap(p => p.colors).slice(0, 5),
        paletteIds: [...selectedPalettes.value],
        createdAt: new Date().toISOString()
      }

      collections.value.push(collection)
      localStorage.setItem('colorCollections', JSON.stringify(collections.value))
      
      // Сброс формы
      newCollection.value = { name: '', description: '' }
      selectedPalettes.value = []
      showCreateCollection.value = false
    }

    const exportPaletteModal = (palette) => {
      exportPalette.value = palette
      showExportModal.value = true
    }

    onMounted(() => {
      loadPalettes()
    })

    return {
      searchQuery,
      filterType,
      sortBy,
      showFavorites,
      palettes,
      collections,
      showCreateCollection,
      showExportModal,
      selectedPalettes,
      exportPalette,
      newCollection,
      filteredPalettes,
      getTypeIcon,
      getTypeName,
      getMoodName,
      formatDate,
      viewPalette,
      openCollection,
      toggleFavorite,
      deletePalette,
      togglePaletteSelection,
      createCollection,
      exportPaletteModal
    }
  }
}
</script>

<style scoped>
.library-view {
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

.library-controls {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.search-control {
  position: relative;
  margin-bottom: 1rem;
}

.search-input {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

.filter-controls {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-select {
  flex: 1;
  min-width: 200px;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 6px;
  background: white;
  font-size: 1rem;
}

.filter-button {
  padding: 0.75rem 1.5rem;
  border: 2px solid #ddd;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.filter-button:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.filter-button.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.collections-section {
  margin-bottom: 3rem;
}

.collections-section h2 {
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #333;
}

.collections-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.collection-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.collection-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.collection-colors {
  display: flex;
  height: 60px;
}

.collection-color {
  flex: 1;
}

.collection-info {
  padding: 1.5rem;
}

.collection-info h3 {
  margin-bottom: 0.5rem;
  color: #333;
}

.collection-info p {
  color: #666;
  margin-bottom: 0.5rem;
}

.collection-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #999;
}

.palettes-section {
  margin-bottom: 3rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #333;
}

.create-collection {
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

.create-collection:hover {
  background: var(--secondary-color);
  transform: translateY(-2px);
}

.empty-library {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.empty-library i {
  font-size: 4rem;
  color: #ddd;
  margin-bottom: 1rem;
}

.empty-library h3 {
  margin-bottom: 0.5rem;
  color: #666;
}

.empty-library p {
  color: #999;
  margin-bottom: 2rem;
}

.empty-action {
  padding: 1rem 2rem;
  background: var(--primary-color);
  color: white;
  text-decoration: none;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
}

.empty-action:hover {
  background: var(--secondary-color);
  transform: translateY(-2px);
}

.palettes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.palette-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.palette-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.palette-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: #f8f9fa;
}

.palette-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.1rem;
}

.palette-actions {
  display: flex;
  gap: 0.5rem;
}

.favorite-button,
.delete-button {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.favorite-button {
  color: #ffc107;
}

.favorite-button.favorite {
  color: #dc3545;
}

.delete-button {
  color: #dc3545;
}

.favorite-button:hover,
.delete-button:hover {
  background: rgba(0, 0, 0, 0.1);
}

.palette-colors {
  display: flex;
  height: 80px;
  position: relative;
}

.palette-color {
  flex: 1;
}

.more-colors {
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.palette-info {
  padding: 1rem 1.5rem;
}

.palette-meta,
.palette-stats {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
}

.palette-type,
.palette-date,
.color-count,
.palette-mood {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #666;
}

.palette-tags {
  padding: 0 1.5rem 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.palette-tag {
  background: #e9ecef;
  color: #495057;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-content h2 {
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #333;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #555;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--primary-color);
}

.palettes-selection {
  max-height: 200px;
  overflow-y: auto;
  border: 2px solid #ddd;
  border-radius: 6px;
  padding: 0.5rem;
}

.palette-option {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-bottom: 0.5rem;
}

.palette-option:hover {
  background: #f8f9fa;
}

.palette-option.selected {
  background: #e7f3ff;
  border: 1px solid var(--primary-color);
}

.option-colors {
  display: flex;
  gap: 2px;
}

.option-color {
  width: 20px;
  height: 20px;
  border-radius: 3px;
}

.option-info h4 {
  margin: 0;
  font-size: 0.9rem;
  color: #333;
}

.option-info p {
  margin: 0;
  font-size: 0.8rem;
  color: #666;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.modal-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.modal-button.cancel {
  background: #6c757d;
  color: white;
}

.modal-button.create {
  background: var(--primary-color);
  color: white;
}

.modal-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

.modal-close {
  margin-top: 1.5rem;
  padding: 0.75rem 1.5rem;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}

@media (max-width: 768px) {
  .view-header h1 {
    font-size: 2rem;
    flex-direction: column;
    gap: 10px;
  }
  
  .filter-controls {
    flex-direction: column;
  }
  
  .filter-select {
    min-width: auto;
  }
  
  .collections-grid {
    grid-template-columns: 1fr;
  }
  
  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .create-collection {
    width: 100%;
    justify-content: center;
  }
  
  .palettes-grid {
    grid-template-columns: 1fr;
  }
  
  .modal-content {
    padding: 1rem;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .modal-button {
    width: 100%;
  }
}
</style>