from flask import Flask, jsonify, send_from_directory
import json
import os

app = Flask(__name__, static_folder='static', static_url_path='')

DATA_FILE = os.path.join(app.root_path, 'data', 'ejercicios.json')

# Cargar datos una sola vez al iniciar la app
with open(DATA_FILE, 'r', encoding='utf-8') as f:
    ejercicios = json.load(f)


@app.route('/ejercicios')
def get_ejercicios():
    """Devuelve la lista completa de ejercicios en formato JSON."""
    return jsonify(ejercicios)


# ---------- Rutas para servir el frontend ---------- #

@app.route('/')
def index():
    """Página principal."""
    return send_from_directory(app.static_folder, 'index.html')


@app.route('/<path:path>')
def static_proxy(path):
    """Sirve archivos estáticos como JS y CSS."""
    return send_from_directory(app.static_folder, path)


if __name__ == '__main__':
    # Ejecutar en modo debug durante el desarrollo
    app.run(host='0.0.0.0', port=5000, debug=True)
