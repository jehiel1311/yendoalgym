# 🏋️ Buscador de Ejercicios de Gym

Aplicación web para buscar y filtrar ejercicios de gimnasio por nombre y zona muscular. Desarrollada con Python (Flask) en el backend y JavaScript vanilla en el frontend.

## 🌟 Características

- Búsqueda en tiempo real por nombre de ejercicio
- Filtrado por zona muscular principal
- Interfaz limpia y responsiva
- Carga dinámica de datos
- Actualización automática de datos cada 5 minutos
- Manejo de errores mejorado

## 🗂️ Estructura del Proyecto

```
buscador-ejercicios/
├── app.py               # Aplicación Flask (backend)
├── generate_json.py     # Script para generar el JSON desde Excel
├── data/               
│   └── ejercicios.json  # Datos de los ejercicios (generado)
├── static/             # Archivos estáticos
│   ├── index.html      # Página principal
│   ├── styles.css      # Estilos CSS
│   ├── main.js         # Lógica del frontend
│   └── ejercicios.json # Datos para el frontend
├── requirements.txt     # Dependencias de Python
└── README.md           # Este archivo
```

## 🚀 Instalación

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/tu-usuario/buscador-ejercicios.git
   cd buscador-ejercicios
   ```

2. **Crear y activar entorno virtual (recomendado)**:
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate
   
   # Linux/Mac
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Instalar dependencias**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Generar datos de ejemplo (opcional)**:
   ```bash
   # Coloca tu archivo Ejercicios-base.xlsx en la raíz del proyecto
   python generate_json.py
   ```

5. **Iniciar la aplicación**:
   ```bash
   python app.py
   ```

6. **Abrir en el navegador**:
   Abre tu navegador y visita [http://localhost:5000](http://localhost:5000)

## 🛠️ Uso

1. **Buscar ejercicios**:
   - Escribe en el campo de búsqueda para filtrar por nombre
   - Usa el menú desplegable para filtrar por zona muscular
   
2. **Recargar datos manualmente**:
   - Los datos se recargan automáticamente cada 5 minutos
   - También puedes recargar la página para obtener los últimos cambios

## 📝 Notas

- Los datos se cargan desde `static/ejercicios.json`
- Para actualizar los datos, modifica el archivo Excel y ejecuta `generate_json.py`
- La aplicación incluye manejo de errores para casos como archivos faltantes o errores de red

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

Desarrollado con ❤️ por [Tu Nombre]
