// Variables globales
let chiliesData = [];
let originalChiliesData = []; // Guardaremos una copia de los datos originales
let currentLang = 'es';

// Cargar datos iniciales desde el archivo JSON
document.addEventListener("DOMContentLoaded", () => {
  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      chiliesData = data;
      originalChiliesData = [...data]; // Guardamos copia de los datos originales
      console.log('Datos cargados correctamente:', chiliesData);
      populateRegionFilter();
      renderChilies();
    })
    .catch(error => console.error('Error al cargar los ajíes:', error));

  // Configuración de los eventos
  document.getElementById('searchInput').addEventListener('input', filterChilies);
  document.getElementById('regionFilter').addEventListener('change', filterChilies);
  document.getElementById('langToggle').addEventListener('click', toggleLanguage);
  document.getElementById('darkModeToggle').addEventListener('click', toggleDarkMode);
  document.getElementById('closeModal').addEventListener('click', closeModal);
});

// Renderizar todos los ajíes
function renderChilies() {
  renderFilteredChilies(chiliesData);
}

// Renderizar ajíes filtrados
function renderFilteredChilies(filteredChilies) {
  const container = document.getElementById('chili-container');
  container.innerHTML = '';

  filteredChilies.forEach(aji => {
    const card = document.createElement('div');
    card.className = 'chili-card';

    card.innerHTML = `
      <img src="${aji.imagen}" alt="${aji.nombre}" loading="lazy">
      <div class="chili-info">
        <h3>${aji.nombre}</h3>
        <p><strong>${getText('region')}: </strong>${aji.region}</p>
        <p><strong>${getText('scoville')}: </strong>${aji.picor}</p>
        <button class="more-info-btn" onclick="openModal(${aji.id})">${getText('verMas')}</button>
      </div>
    `;

    container.appendChild(card);
  });

  // Animar la aparición de las cards
  setTimeout(() => {
    document.querySelectorAll('.chili-card').forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`;
    });
  }, 100);
}

// Filtrar ajíes según búsqueda y región
function filterChilies() {
  const searchInput = document.getElementById('searchInput').value.toLowerCase();
  const regionFilter = document.getElementById('regionFilter').value;
  
  const filteredChilies = originalChiliesData.filter(aji => {
    const matchesSearch = aji.nombre.toLowerCase().includes(searchInput) || 
                         aji.descripcion.toLowerCase().includes(searchInput);
    const matchesRegion = regionFilter === 'all' || aji.region === regionFilter;
    return matchesSearch && matchesRegion;
  });

  chiliesData = filteredChilies;
  renderChilies();
}

// Rellenar las opciones del filtro de región
function populateRegionFilter() {
  const regions = [...new Set(originalChiliesData.map(aji => aji.region))];
  const regionFilter = document.getElementById('regionFilter');

  // Limpiar opciones existentes (excepto la primera)
  while (regionFilter.options.length > 1) {
    regionFilter.remove(1);
  }

  // Añadir nuevas opciones
  regions.forEach(region => {
    const option = document.createElement('option');
    option.value = region;
    option.textContent = region;
    regionFilter.appendChild(option);
  });
}

// Mostrar modal con más detalles del ají
function openModal(ajiId) {
  const aji = originalChiliesData.find(a => a.id === ajiId);
  if (!aji) return;

  document.getElementById('modal').classList.remove('hidden');
  document.getElementById('modalImage').src = aji.imagen;
  document.getElementById('modalImage').alt = aji.nombre;
  document.getElementById('modalName').textContent = aji.nombre;
  document.getElementById('modalSciName').textContent = aji.nombreCientifico;
  document.getElementById('modalRegion').textContent = aji.region;
  document.getElementById('modalScoville').textContent = aji.picor;
  document.getElementById('modalUse').textContent = aji.usoCulinario;
  document.getElementById('modalSeason').textContent = aji.temporada;
  document.getElementById('modalDescription').textContent = aji.descripcion;
}

// Cerrar el modal
function closeModal() {
  document.getElementById('modal').classList.add('hidden');
}

// Cambiar idioma entre español e inglés
function toggleLanguage() {
  currentLang = currentLang === 'es' ? 'en' : 'es';
  loadLanguage();
  renderChilies();
}

// Cargar los textos del idioma seleccionado
function loadLanguage() {
  const langData = getLanguageData();
  document.getElementById('title').textContent = langData.title;
  document.getElementById('subtitle').textContent = langData.subtitle;
  document.getElementById('langToggle').textContent = langData.langToggle;
  document.getElementById('footerText').textContent = langData.footerText;
  
  // Actualizar etiquetas del modal
  document.getElementById('sciNameLabel').textContent = getText('sciName');
  document.getElementById('regionLabel').textContent = getText('region');
  document.getElementById('scovilleLabel').textContent = getText('scoville');
  document.getElementById('useLabel').textContent = getText('use');
  document.getElementById('seasonLabel').textContent = getText('season');
  document.getElementById('descriptionLabel').textContent = getText('description');
}

// Obtener texto traducido
function getText(key) {
  const langData = getLanguageData();
  return langData[key] || key;
}

// Obtener los textos del idioma correspondiente
function getLanguageData() {
  const languages = {
    es: {
      title: '🌶 Ajíes del Perú',
      subtitle: 'Descubre la diversidad picante de nuestro país',
      langToggle: 'EN',
      darkModeToggle: '🌙',
      footerText: 'Hecho con ❤️ en Perú',
      region: 'Región',
      scoville: 'Nivel de picor',
      verMas: 'Ver más',
      sciName: 'Nombre científico',
      use: 'Uso culinario',
      season: 'Temporada',
      description: 'Descripción'
    },
    en: {
      title: '🌶 Chili Peppers of Peru',
      subtitle: 'Discover the spicy diversity of our country',
      langToggle: 'ES',
      darkModeToggle: '🌑',
      footerText: 'Made with ❤️ in Peru',
      region: 'Region',
      scoville: 'Spiciness Level',
      verMas: 'See More',
      sciName: 'Scientific Name',
      use: 'Culinary Use',
      season: 'Season',
      description: 'Description'
    }
  };

  return languages[currentLang];
}

// Activar o desactivar el modo oscuro
function toggleDarkMode() {
  document.body.classList.toggle('dark');
  // Guardar preferencia
  const isDarkMode = document.body.classList.contains('dark');
  localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
}

// Aplicar modo oscuro al cargar si estaba activado
function applySavedDarkMode() {
  const darkMode = localStorage.getItem('darkMode');
  if (darkMode === 'enabled') {
    document.body.classList.add('dark');
  }
}

// Aplicar configuración guardada al cargar
applySavedDarkMode();