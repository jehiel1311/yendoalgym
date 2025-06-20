// Obtener referencias a elementos del DOM
const searchInput = document.getElementById('searchInput');
const zonaSelect = document.getElementById('zonaSelect');
const tbody = document.querySelector('#ejerciciosTable tbody');
const controls = document.querySelector('.controls');

let ejercicios = [];
let isLoading = false;

// Mostrar estado de carga
function setLoading(state) {
  isLoading = state;
  controls.style.opacity = state ? 0.5 : 1;
  controls.style.pointerEvents = state ? 'none' : 'all';
  
  if (state) {
    tbody.innerHTML = '<tr><td colspan="3" class="loading">Cargando ejercicios...</td></tr>';
  }
}

// Mostrar mensaje de error
function showError(message) {
  tbody.innerHTML = `<tr><td colspan="3" class="error">${message}</td></tr>`;
}

// Obtener datos del backend
async function fetchEjercicios() {
  setLoading(true);
  try {
    const res = await fetch('ejercicios.json');
    if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
    ejercicios = await res.json();
    if (ejercicios.length === 0) {
      showError('No se encontraron ejercicios.');
    } else {
      poblarZonaSelect();
      renderTable();
    }
  } catch (err) {
    console.error('Error al obtener ejercicios:', err);
    showError('Error al cargar los ejercicios. Por favor, recarga la página.');
  } finally {
    setLoading(false);
  }
}

function poblarZonaSelect() {
  const zonas = [...new Set(ejercicios.map(e => e.zona))];
  zonas.forEach(z => {
    const option = document.createElement('option');
    option.value = z;
    option.textContent = z;
    zonaSelect.appendChild(option);
  });
}

function createHeader(keys) {
  const thead = document.querySelector('#ejerciciosTable thead');
  thead.innerHTML = '';
  const tr = document.createElement('tr');
  keys.forEach(k => {
    const th = document.createElement('th');
    th.textContent = k.charAt(0).toUpperCase() + k.slice(1).replace('_', ' ');
    tr.appendChild(th);
  });
  thead.appendChild(tr);
}

function renderTable() {
  const filtroNombre = searchInput.value.toLowerCase();
  const filtroZona = zonaSelect.value;

  // Determinar columnas dinámicamente (solo en la primera llamada)
  if (ejercicios.length && !document.querySelector('#ejerciciosTable thead').children.length) {
    const cols = Object.keys(ejercicios[0]);
    createHeader(cols);
  }

  const filtered = ejercicios.filter(e => {
    const coincideNombre = e.nombre.toLowerCase().includes(filtroNombre);
    const coincideZona = filtroZona ? e.zona === filtroZona : true;
    return coincideNombre && coincideZona;
  });

  tbody.innerHTML = '';
  filtered.forEach(e => {
    const tr = document.createElement('tr');

    Object.entries(e).forEach(([key, value]) => {
      const td = document.createElement('td');
      if (key === 'imagen') {
        const img = document.createElement('img');
        img.src = value;
        img.alt = e.nombre;
        img.width = 124;
        img.height = 124;
        td.appendChild(img);
      } else if (Array.isArray(value)) {
        td.textContent = value.join(', ');
      } else {
        td.textContent = value;
      }
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });
}

// Función para manejar búsquedas con debounce
let searchTimeout;
function handleSearch() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(renderTable, 300);
}

// Eventos
searchInput.addEventListener('input', handleSearch);
zonaSelect.addEventListener('change', renderTable);

// Recarga automática solo cuando se ejecuta en localhost (Flask)
if (location.hostname === '127.0.0.1' || location.hostname === 'localhost') {
  setInterval(() => {
    fetch('/reload')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          console.log(`Datos recargados: ${data.count} ejercicios`);
        }
      })
      .catch(() => {});
  }, 5 * 60 * 1000);
}

// Helper para compatibilidad (IE no soportado pero por si acaso)
function afterEvent(element, event, handler) {
  if (element.addEventListener) {
    element.addEventListener(event, handler);
  } else if (element.attachEvent) {
    element.attachEvent('on' + event, handler);
  }
}

// Inicializar
document.addEventListener('DOMContentLoaded', fetchEjercicios);
