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
    const res = await fetch('/ejercicios');
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

function renderTable() {
  const filtroNombre = searchInput.value.toLowerCase();
  const filtroZona = zonaSelect.value;

  const filtered = ejercicios.filter(e => {
    const coincideNombre = e.nombre.toLowerCase().includes(filtroNombre);
    const coincideZona = filtroZona ? e.zona === filtroZona : true;
    return coincideNombre && coincideZona;
  });

  tbody.innerHTML = '';
  filtered.forEach(e => {
    const tr = document.createElement('tr');

    const tdNombre = document.createElement('td');
    tdNombre.textContent = e.nombre;

    const tdZona = document.createElement('td');
    tdZona.textContent = e.zona;

    const tdSecundarios = document.createElement('td');
    tdSecundarios.textContent = e.musculos_secundarios.join(', ');

    tr.appendChild(tdNombre);
    tr.appendChild(tdZona);
    tr.appendChild(tdSecundarios);

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

// Recargar datos cada 5 minutos (opcional)
setInterval(() => {
  fetch('/reload')
    .then(res => res.json())
    .then(data => {
      if (data.status === 'success') {
        console.log(`Datos recargados: ${data.count} ejercicios`);
      }
    })
    .catch(console.error);
}, 5 * 60 * 1000);

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
