from flask import Flask, jsonify, send_from_directory, abort
import json
import os
from pathlib import Path

app = Flask(__name__, static_folder='static', static_url_path='')

# Configuración
DATA_FILE = Path(__file__).parent / 'static' / 'ejercicios.json'
ALLOWED_FILES = {'index.html', 'main.js', 'styles.css'}

# Cargar datos al inicio
try:
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        ejercicios = json.load(f)
except FileNotFoundError:
    print(f"Error: No se encontró el archivo {DATA_FILE}")
    ejercicios = []
    
# Función para recargar los datos
def reload_ejercicios():
    global ejercicios
    try:
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            ejercicios = json.load(f)
        return True
    except Exception as e:
        print(f"Error al recargar ejercicios: {e}")
        return False


@app.route('/ejercicios')
def get_ejercicios():
    """Devuelve la lista completa de ejercicios en formato JSON."""
    return jsonify(ejercicios)


# ---------- Rutas para servir el frontend ---------- #

@app.route('/')
def index():
    """Página principal."""
    return send_from_directory(app.static_folder, 'index.html')


@app.route('/<path:filename>')
def serve_static(filename):
    """Sirve archivos estáticos permitidos."""
    if filename not in ALLOWED_FILES and not filename.startswith('ejercicios.json'):
        abort(403, description="Acceso denegado")
    return send_from_directory(app.static_folder, filename)

@app.route('/reload')
def reload_data():
    """Ruta para recargar los datos manualmente."""
    if reload_ejercicios():
        return jsonify({"status": "success", "count": len(ejercicios)})
    return jsonify({"status": "error", "message": "Error al recargar datos"}), 500


if __name__ == '__main__':
    # Ejecutar en modo debug durante el desarrollo
    app.run(host='0.0.0.0', port=5000, debug=True)
