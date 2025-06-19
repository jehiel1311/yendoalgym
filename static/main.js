// Obtener referencias a elementos del DOM
const searchInput = document.getElementById('searchInput');
const zonaSelect = document.getElementById('zonaSelect');
const tbody = document.querySelector('#ejerciciosTable tbody');

let ejercicios = [];

// Obtener datos del backend
async function fetchEjercicios() {
  try {
    const res = await fetch('ejercicios.json');
    ejercicios = await res.json();
    poblarZonaSelect();
    renderTable();
  } catch (err) {
    console.error('Error al obtener ejercicios:', err);
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

// Eventos
afterEvent(searchInput, 'input', renderTable);
afterEvent(zonaSelect, 'change', renderTable);

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
