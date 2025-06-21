#!/usr/bin/env python
"""
Genera el archivo static/ejercicios.json a partir de data/Ejercicios-base.xlsx.

Uso:
    python generate_json.py

Requisitos: pandas, openpyxl (ya incluidos en requirements.txt)

El Excel puede tener encabezados en español con mayúsculas o espacios,
por ejemplo:
    - "Nombre (ES)"
    - "Zona principal"
    - "Músculos secundarios"
Se normalizan y renombran automáticamente para generar las claves
``nombre``, ``zona`` y ``musculos_secundarios`` en el JSON. Si
``musculos_secundarios`` está en texto separado por comas se convierte a
lista automáticamente.
"""
from __future__ import annotations

import json
from pathlib import Path

import pandas as pd

EXCEL_PATH = Path(__file__).with_name("data") / "Ejercicios-base.xlsx"
OUTPUT_PATH = Path(__file__).with_name("static") / "ejercicios.json"


def main() -> None:
    if not EXCEL_PATH.exists():
        print(f"⚠️  Archivo {EXCEL_PATH} no encontrado.")
        return

    # Leer Excel
    df = pd.read_excel(EXCEL_PATH)

    # Normalizar nombres de columnas y mapearlas a claves estándar
    # Quitar tildes y espacios para una normalizacion robusta
    def normalize(col: str) -> str:
        replacements = {
            "á": "a",
            "é": "e",
            "í": "i",
            "ó": "o",
            "ú": "u",
            "ñ": "n",
        }
        col = col.strip().lower()
        for a, b in replacements.items():
            col = col.replace(a, b)
        return col

    df.columns = [normalize(c) for c in df.columns]

    rename_map = {
        "nombre (es)": "nombre",
        "zona principal": "zona",
        "musculos secundarios": "musculos_secundarios",
        "detalle/descripcion": "descripcion",
        "nivel de dificultad": "nivel",
    }
    df.rename(columns=rename_map, inplace=True)

    expected_base = {"nombre", "zona", "musculos_secundarios"}
    missing = expected_base - set(df.columns)
    if missing:
        raise ValueError(
            f"Columnas faltantes en el Excel: {', '.join(sorted(missing))}"
        )

    # Convertir "musculos_secundarios" a lista
    def to_list(value):
        if isinstance(value, list):
            return value
        if pd.isna(value):
            return []
        return [m.strip() for m in str(value).split(",") if m.strip()]

    df["musculos_secundarios"] = df["musculos_secundarios"].apply(to_list)

    # Mantener todas las columnas originales
    records = df.to_dict(orient="records")

    # Si existe columna 'id', generar ruta de imagen automática
    for rec in records:
        if 'id' in rec and pd.notna(rec['id']):
            rec['imagen'] = f"img/{rec['id']}.png"

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with OUTPUT_PATH.open("w", encoding="utf-8") as fp:
        json.dump(records, fp, ensure_ascii=False, indent=2)

    print(f"✅ Generado {OUTPUT_PATH} con {len(records)} ejercicios.")


if __name__ == "__main__":
    main()
