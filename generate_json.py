#!/usr/bin/env python
"""
Genera el archivo docs/ejercicios.json a partir de Ejercicios-base.xlsx.

Uso:
    python generate_json.py

Requisitos: pandas, openpyxl (ya incluidos en requirements.txt)

El Excel debe contener las columnas:
    - nombre
    - zona
    - musculos_secundarios
Si "musculos_secundarios" está en texto separado por comas, se convierte
a lista automáticamente.
"""
from __future__ import annotations

import json
from pathlib import Path

import pandas as pd

EXCEL_PATH = Path(__file__).with_name("Ejercicios-base.xlsx")
OUTPUT_PATH = Path(__file__).with_name("docs") / "ejercicios.json"


def main() -> None:
    if not EXCEL_PATH.exists():
        print(f"⚠️  Archivo {EXCEL_PATH} no encontrado.")
        return

    # Leer Excel
    df = pd.read_excel(EXCEL_PATH)

    # Normalizar nombres de columnas a minúsculas sin espacios
    df.columns = [c.strip().lower() for c in df.columns]

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
