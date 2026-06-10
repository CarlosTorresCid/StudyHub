// src/lib/examNotebookTemplates.js
//
// Plantillas de notebooks de resolución completa por modelo de examen.
// Cada función devuelve código Python autocontenido (asume que `df`,
// `pd`, `np` y los imports de scikit-learn ya están disponibles en el
// entorno de Pyodide, pero los reimporta igualmente para que el código
// también pueda copiarse y ejecutarse en Jupyter/Colab sin cambios).

// ════════════════════════════════════════════════════════════════════════════
// CONFIGURACIÓN POR MODELO (AAMD)
//
// Fuente única de verdad para generar los notebooks exportables (.ipynb) de
// cada modelo de AAMD: nombre del CSV (debe coincidir con publicLibrary.js),
// variable objetivo, clases, prefijo de variables y preguntas del test.
// ════════════════════════════════════════════════════════════════════════════
export const AAMD_NOTEBOOK_MODEL_CONFIG = {
  '2025-modelo-a': {
    title: '2025 Modelo A',
    csvFilename: 'injury_liver.csv',
    target: 'injury',
    variablePrefix: 'X',
    classes: ['None', 'Mild', 'Severe'],
    positiveClasses: ['Mild', 'Severe'],
    negativeClass: 'None',
    modelType: 'injury',
  },

  '2025-modelo-b-ext': {
    title: '2025 Modelo B ext',
    csvFilename: 'environmental_pollution.csv',
    target: 'pollution_level',
    variablePrefix: 'Sensor',
    classes: ['Low', 'Moderate', 'High'],
    positiveClasses: ['Moderate', 'High'],
    negativeClass: 'Low',
    modelType: 'pollution',
    testQuestions: [
      { numero: 1, tipo: 'outliers_iqr', columna: 'Sensor_11', texto: 'Outliers en Sensor_11 (mediana ± 1.5·IQR)' },
      { numero: 2, tipo: 'moda_variable', columna: 'Sensor_141', texto: 'Moda de Sensor_141' },
      { numero: 3, tipo: 'faltantes_dataset', texto: 'Datos faltantes en el dataset' },
      { numero: 4, tipo: 'info_dimensiones', texto: 'Número de variables independientes en entrenamiento' },
      { numero: 5, tipo: 'metrica_clase', clase: 'Moderate', metrica: 'precision', version: 'sin_podar', texto: 'Precision de la clase Moderate (árbol sin podar)' },
      { numero: 6, tipo: 'metrica_clase', clase: 'Low', metrica: 'recall', version: 'sin_podar', texto: 'Recall de la clase Low (árbol sin podar)' },
      { numero: 7, tipo: 'metrica_clase', clase: 'High', metrica: 'f1-score', version: 'sin_podar', texto: 'F1-score de la clase High (árbol sin podar)' },
      { numero: 8, tipo: 'mejora_trivial', texto: '¿Mejora el árbol sin podar al clasificador trivial?' },
      { numero: 9, tipo: 'mejor_max_depth', texto: 'Mejor max_depth (GridSearchCV, cv=5)' },
      { numero: 10, tipo: 'metrica_clase', clase: 'Moderate', metrica: 'precision', version: 'podado', texto: 'Precision de la clase Moderate (árbol podado)' },
      { numero: 11, tipo: 'metrica_clase', clase: 'Low', metrica: 'recall', version: 'podado', texto: 'Recall de la clase Low (árbol podado)' },
      { numero: 12, tipo: 'metrica_clase', clase: 'High', metrica: 'f1-score', version: 'podado', texto: 'F1-score de la clase High (árbol podado)' },
      { numero: 13, tipo: 'importancia_variable', columna: 'Sensor_1', texto: 'Importancia de Sensor_1 (árbol podado)' },
      { numero: 14, tipo: 'importancia_variable', columna: 'Sensor_122', texto: 'Importancia de Sensor_122 (árbol podado)' },
    ],
  },

  '2025-modelo-c': {
    title: '2025 Modelo C',
    csvFilename: 'workplace_stress_updated.csv',
    target: 'stress_level',
    variablePrefix: 'Indicator',
    classes: ['Negligible', 'Moderate', 'Critical'],
    positiveClasses: ['Moderate', 'Critical'],
    negativeClass: 'Negligible',
    modelType: 'stress',
    testQuestions: [
      { numero: 1, tipo: 'outliers_iqr', columna: 'Indicator_5', texto: 'Outliers en Indicator_5 (mediana ± 1.5·IQR)' },
      { numero: 2, tipo: 'num_outliers_iqr', columna: 'Indicator_5', texto: 'Número de outliers en Indicator_5' },
      { numero: 3, tipo: 'faltantes_variable', columna: 'Indicator_15', texto: 'Valores faltantes en Indicator_15' },
      { numero: 4, tipo: 'info_dimensiones', texto: 'Número de variables en el conjunto de test' },
      { numero: 5, tipo: 'metrica_clase', clase: 'Negligible', metrica: 'precision', version: 'sin_podar', texto: 'Precision de la clase Negligible (árbol sin podar)' },
      { numero: 6, tipo: 'metrica_clase', clase: 'Critical', metrica: 'recall', version: 'sin_podar', texto: 'Recall de la clase Critical (árbol sin podar)' },
      { numero: 7, tipo: 'metrica_clase', clase: 'Moderate', metrica: 'f1-score', version: 'sin_podar', texto: 'F1-score de la clase Moderate (árbol sin podar)' },
      { numero: 8, tipo: 'clase_trivial', texto: 'Clase predicha por el clasificador trivial' },
      { numero: 9, tipo: 'accuracy_trivial', texto: 'Accuracy del clasificador trivial' },
      { numero: 10, tipo: 'metrica_clase', clase: 'Negligible', metrica: 'precision', version: 'podado', texto: 'Precision de la clase Negligible (árbol podado)' },
      { numero: 11, tipo: 'metrica_clase', clase: 'Critical', metrica: 'recall', version: 'podado', texto: 'Recall de la clase Critical (árbol podado)' },
      { numero: 12, tipo: 'metrica_clase', clase: 'Moderate', metrica: 'f1-score', version: 'podado', texto: 'F1-score de la clase Moderate (árbol podado)' },
      { numero: 13, tipo: 'importancia_variable', columna: 'Indicator_73', texto: 'Importancia de Indicator_73 (árbol podado)' },
      { numero: 14, tipo: 'importancia_variable', columna: 'Indicator_28', texto: 'Importancia de Indicator_28 (árbol podado)' },
    ],
  },

  '2025-modelo-d-ext': {
    title: '2025 Modelo D ext',
    csvFilename: 'workplace_stress_updated.csv',
    target: 'stress_level',
    variablePrefix: 'Indicator',
    classes: ['Negligible', 'Moderate', 'Critical'],
    positiveClasses: ['Moderate', 'Critical'],
    negativeClass: 'Negligible',
    modelType: 'stress',
    testQuestions: [
      { numero: 1, tipo: 'outliers_iqr', columna: 'Indicator_81', texto: 'Outliers en Indicator_81 (mediana ± 1.5·IQR)' },
      { numero: 2, tipo: 'tipo_variables', texto: 'Tipos de variables del dataset' },
      { numero: 3, tipo: 'faltantes_dataset', texto: 'Datos faltantes en el dataset' },
      { numero: 4, tipo: 'info_dimensiones', texto: 'Número de observaciones de entrenamiento' },
      { numero: 5, tipo: 'metrica_clase', clase: 'Critical', metrica: 'precision', version: 'sin_podar', texto: 'Precision de la clase Critical (árbol sin podar)' },
      { numero: 6, tipo: 'metrica_clase', clase: 'Moderate', metrica: 'recall', version: 'sin_podar', texto: 'Recall de la clase Moderate (árbol sin podar)' },
      { numero: 7, tipo: 'metrica_clase', clase: 'Negligible', metrica: 'f1-score', version: 'sin_podar', texto: 'F1-score de la clase Negligible (árbol sin podar)' },
      { numero: 8, tipo: 'porcentaje_error', version: 'sin_podar', texto: 'Porcentaje de error del modelo sin podar' },
      { numero: 9, tipo: 'mejor_max_depth', texto: 'Mejor max_depth (GridSearchCV, cv=5)' },
      { numero: 10, tipo: 'metrica_clase', clase: 'Critical', metrica: 'precision', version: 'podado', texto: 'Precision de la clase Critical (árbol podado)' },
      { numero: 11, tipo: 'metrica_clase', clase: 'Moderate', metrica: 'recall', version: 'podado', texto: 'Recall de la clase Moderate (árbol podado)' },
      { numero: 12, tipo: 'metrica_clase', clase: 'Negligible', metrica: 'f1-score', version: 'podado', texto: 'F1-score de la clase Negligible (árbol podado)' },
      { numero: 13, tipo: 'importancia_variable', columna: 'Indicator_28', texto: 'Importancia de Indicator_28 (árbol podado)' },
      { numero: 14, tipo: 'importancia_variable', columna: 'Indicator_2', texto: 'Importancia de Indicator_2 (árbol podado)' },
    ],
  },

  '2025-modelo-d': {
    title: '2025 Modelo D',
    csvFilename: 'environmental_pollution.csv',
    target: 'pollution_level',
    variablePrefix: 'Sensor',
    classes: ['Low', 'Moderate', 'High'],
    positiveClasses: ['Moderate', 'High'],
    negativeClass: 'Low',
    modelType: 'pollution',
    testQuestions: [
      { numero: 1, tipo: 'outliers_iqr', columna: 'Sensor_5', texto: 'Outliers en Sensor_5 (mediana ± 1.5·IQR)' },
      { numero: 2, tipo: 'num_outliers_iqr', columna: 'Sensor_5', texto: 'Número de outliers en Sensor_5' },
      { numero: 3, tipo: 'faltantes_variable', columna: 'Sensor_15', texto: 'Valores faltantes en Sensor_15' },
      { numero: 4, tipo: 'info_dimensiones', texto: 'Número de variables en el conjunto de test' },
      { numero: 5, tipo: 'metrica_clase', clase: 'Low', metrica: 'precision', version: 'sin_podar', texto: 'Precision de la clase Low (árbol sin podar)' },
      { numero: 6, tipo: 'metrica_clase', clase: 'High', metrica: 'recall', version: 'sin_podar', texto: 'Recall de la clase High (árbol sin podar)' },
      { numero: 7, tipo: 'metrica_clase', clase: 'Moderate', metrica: 'f1-score', version: 'sin_podar', texto: 'F1-score de la clase Moderate (árbol sin podar)' },
      { numero: 8, tipo: 'clase_trivial', texto: 'Clase predicha por el clasificador trivial' },
      { numero: 9, tipo: 'accuracy_trivial', texto: 'Accuracy del clasificador trivial' },
      { numero: 10, tipo: 'metrica_clase', clase: 'Low', metrica: 'precision', version: 'podado', texto: 'Precision de la clase Low (árbol podado)' },
      { numero: 11, tipo: 'metrica_clase', clase: 'High', metrica: 'recall', version: 'podado', texto: 'Recall de la clase High (árbol podado)' },
      { numero: 12, tipo: 'metrica_clase', clase: 'Moderate', metrica: 'f1-score', version: 'podado', texto: 'F1-score de la clase Moderate (árbol podado)' },
      { numero: 13, tipo: 'importancia_variable', columna: 'Sensor_73', texto: 'Importancia de Sensor_73 (árbol podado)' },
      { numero: 14, tipo: 'importancia_variable', columna: 'Sensor_28', texto: 'Importancia de Sensor_28 (árbol podado)' },
    ],
  },

  simulacro: {
    title: 'Simulacro',
    csvFilename: 'workplace_stress_updated.csv',
    predictionsFilename: 'workplace_stress_predictions.csv',
    target: 'stress_level',
    variablePrefix: 'Indicator',
    classes: ['Negligible', 'Moderate', 'Critical'],
    positiveClasses: ['Moderate', 'Critical'],
    negativeClass: 'Negligible',
    modelType: 'stress',
    hasPredictionCsv: true,
    testQuestions: [
      { numero: 1, tipo: 'outliers_iqr', columna: 'Indicator_5', texto: 'Outliers en Indicator_5 (mediana ± 1.5·IQR)' },
      { numero: 2, tipo: 'num_outliers_iqr', columna: 'Indicator_5', texto: 'Número de outliers en Indicator_5' },
      { numero: 3, tipo: 'faltantes_variable', columna: 'Indicator_97', texto: 'Valores faltantes en Indicator_97' },
      { numero: 4, tipo: 'info_dimensiones', texto: 'Número de observaciones de entrenamiento' },
      { numero: 5, tipo: 'metrica_clase', clase: 'Negligible', metrica: 'precision', version: 'sin_podar', texto: 'Precision de la clase Negligible (árbol sin podar)' },
      { numero: 6, tipo: 'metrica_clase', clase: 'Critical', metrica: 'recall', version: 'sin_podar', texto: 'Recall de la clase Critical (árbol sin podar)' },
      { numero: 7, tipo: 'metrica_clase', clase: 'Moderate', metrica: 'f1-score', version: 'sin_podar', texto: 'F1-score de la clase Moderate (árbol sin podar)' },
      { numero: 8, tipo: 'clase_trivial', texto: 'Clase predicha por el clasificador trivial' },
      { numero: 9, tipo: 'accuracy_trivial', texto: 'Accuracy del clasificador trivial' },
      { numero: 10, tipo: 'metrica_clase', clase: 'Negligible', metrica: 'precision', version: 'podado', texto: 'Precision de la clase Negligible (árbol podado)' },
      { numero: 11, tipo: 'metrica_clase', clase: 'Critical', metrica: 'recall', version: 'podado', texto: 'Recall de la clase Critical (árbol podado)' },
      { numero: 12, tipo: 'metrica_clase', clase: 'Moderate', metrica: 'f1-score', version: 'podado', texto: 'F1-score de la clase Moderate (árbol podado)' },
      { numero: 13, tipo: 'importancia_variable', columna: 'Indicator_2', texto: 'Importancia de Indicator_2 (árbol podado)' },
      { numero: 14, tipo: 'importancia_variable', columna: 'Indicator_188', texto: 'Importancia de Indicator_188 (árbol podado)' },
    ],
  },
};

function getModeloANotebook() {
  return `import re
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import confusion_matrix, accuracy_score

# ════════════════════════════════════════════════════════════════
# FUNCIONES AUXILIARES
# ════════════════════════════════════════════════════════════════

def letra(indice):
    """Convierte un índice 0-3 en letra A-D (o '?' si no es válido)."""
    opciones = ["A", "B", "C", "D"]
    return opciones[indice] if indice is not None and 0 <= indice < len(opciones) else "?"

def parse_numeros(texto):
    """Extrae todos los números (enteros o decimales) de un texto."""
    return [float(n) for n in re.findall(r"-?\\d+\\.?\\d*", texto)]

def opcion_mas_cercana(valor, opciones):
    """Índice de la opción cuyo primer número está más cerca de 'valor'."""
    primeros = []
    for op in opciones:
        nums = parse_numeros(op)
        primeros.append(nums[0] if nums else float("inf"))
    diferencias = [abs(valor - n) for n in primeros]
    return int(np.argmin(diferencias))

def comparar_matriz(matriz_obtenida, opciones):
    """
    Compara una matriz de confusión (array/lista de listas) con opciones de
    texto del tipo 'Fila 1: [a, b, c] | Fila 2: [...] | Fila 3: [...]'.
    Devuelve el índice de la opción que coincide exactamente, o None.
    """
    obtenida = [int(v) for fila in matriz_obtenida for v in fila]
    for i, op in enumerate(opciones):
        bloques = re.findall(r"\\[([^\\]]*)\\]", op)
        nums = []
        for bloque in bloques:
            nums.extend(int(n) for n in re.findall(r"-?\\d+", bloque))
        if nums == obtenida:
            return i
    return None

respuestas = {}

# ════════════════════════════════════════════════════════════════
# PARTE 0 · CARGA Y PREPARACIÓN DE DATOS
# ════════════════════════════════════════════════════════════════

print("=" * 70)
print("MODELO A — injury_liver.csv")
print("=" * 70)

print("\\nDimensiones del dataset (filas, columnas):", df.shape)

print("\\nTipos de datos:")
print(df.dtypes.value_counts())

print("\\nValores nulos por columna (dataset original):")
nulos_originales = df.isnull().sum()
print(nulos_originales[nulos_originales > 0])

# IMPORTANTE: en injury_liver.csv la clase "None" de la variable objetivo
# se carga como NaN. Hay que rellenarla ANTES de separar X e y.
df["injury"] = df["injury"].fillna("None")

target = "injury"
X = df.drop(columns=[target])
y = df[target]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=1
)
print(f"\\nTrain: {len(X_train)} filas · Test: {len(X_test)} filas")

# ════════════════════════════════════════════════════════════════
# PARTE 1 · ÁRBOL DE DECISIÓN SIN PODAR (random_state=1)
# ════════════════════════════════════════════════════════════════

print("\\n" + "=" * 70)
print("ÁRBOL SIN PODAR")
print("=" * 70)

arbol = DecisionTreeClassifier(random_state=1)
arbol.fit(X_train, y_train)
y_pred = arbol.predict(X_test)

matriz = confusion_matrix(y_test, y_pred)
print("Clases:", list(arbol.classes_))
print("Matriz de confusión:")
print(matriz)
print("Profundidad:", arbol.get_depth())
print("Accuracy:", accuracy_score(y_test, y_pred))
print("Nodos terminales (hojas):", arbol.get_n_leaves())

# ════════════════════════════════════════════════════════════════
# PARTE 2 · VALIDACIÓN CRUZADA (GridSearchCV, cv=5, max_depth 1-20)
# ════════════════════════════════════════════════════════════════

print("\\n" + "=" * 70)
print("VALIDACIÓN CRUZADA (GridSearchCV)")
print("=" * 70)

param_grid = {"max_depth": range(1, 21)}
grid = GridSearchCV(
    DecisionTreeClassifier(random_state=1),
    param_grid,
    cv=5,
    scoring="accuracy",
)
grid.fit(X_train, y_train)
print("Mejor max_depth:", grid.best_params_["max_depth"])

# ════════════════════════════════════════════════════════════════
# PARTE 3 · ÁRBOL PODADO (mejor max_depth, random_state=1)
# ════════════════════════════════════════════════════════════════

print("\\n" + "=" * 70)
print("ÁRBOL PODADO")
print("=" * 70)

modelo_podado = grid.best_estimator_
y_pred_podado = modelo_podado.predict(X_test)

matriz_podado = confusion_matrix(y_test, y_pred_podado)
print("Clases:", list(modelo_podado.classes_))
print("Matriz de confusión:")
print(matriz_podado)
print("Accuracy:", accuracy_score(y_test, y_pred_podado))
print("Nodos terminales (hojas):", modelo_podado.get_n_leaves())

importancias = pd.DataFrame({
    "variable": X_train.columns,
    "importancia": modelo_podado.feature_importances_,
}).sort_values("importancia", ascending=False)

print("\\nVariables más importantes:")
print(importancias.head(10).to_string(index=False))

# ════════════════════════════════════════════════════════════════
# RESPUESTAS AL TEST (14 preguntas)
# ════════════════════════════════════════════════════════════════

print("\\n" + "=" * 70)
print("RESPUESTAS AL TEST")
print("=" * 70)

# --- Pregunta 1: outliers en X5 (mediana ± 1.5·IQR) ---
print("\\nPregunta 1 — Outliers en X5")
opciones_q1 = [
    "18, 59, 100 y 2.2",
    "6, 59, 100 y 2.2",
    "100, 44, 59 y 60",
    "18, 28, 100 y 60",
]
col = "X5"
q1_, q3_ = df[col].quantile(0.25), df[col].quantile(0.75)
iqr = q3_ - q1_
mediana = df[col].median()
lim_inf, lim_sup = mediana - 1.5 * iqr, mediana + 1.5 * iqr
outliers_x5 = sorted(df[(df[col] < lim_inf) | (df[col] > lim_sup)][col].tolist())
print(f"  Límites (mediana ± 1.5·IQR): [{lim_inf}, {lim_sup}]")
print(f"  Outliers detectados en X5: {outliers_x5}")

mejor_idx, mejor_n = None, -1
for i, op in enumerate(opciones_q1):
    valores = parse_numeros(op)
    n_coincide = sum(1 for v in valores if v in outliers_x5)
    print(f"    Opción {letra(i)} ({op}): {n_coincide}/{len(valores)} valores son outliers")
    if n_coincide > mejor_n:
        mejor_n, mejor_idx = n_coincide, i
respuestas[1] = mejor_idx
print(f"  → Respuesta 1: {letra(respuestas[1])}")

# --- Pregunta 2: tipos de variables ---
print("\\nPregunta 2 — Tipos de variables")
no_numericas = df.select_dtypes(exclude=[np.number]).columns.tolist()
print(f"  Columnas no numéricas: {no_numericas}")
if no_numericas == ["injury"]:
    respuestas[2] = 0
else:
    respuestas[2] = None
    print("  AVISO: no coincide con ninguna opción de forma directa, revisar manualmente.")
print(f"  → Respuesta 2: {letra(respuestas[2])}")

# --- Pregunta 3: datos faltantes ---
print("\\nPregunta 3 — Datos faltantes")
cols_con_nulos = nulos_originales[nulos_originales > 0]
print(f"  Columnas con valores nulos (dataset original): {dict(cols_con_nulos)}")
relevantes = set(cols_con_nulos.index) - {"injury"}
if not relevantes:
    # La única columna con nulos es la variable objetivo, cuya clase "None"
    # se carga como NaN (ya corregida más arriba). Las variables
    # predictoras no tienen datos faltantes.
    respuestas[3] = 0
elif relevantes == {"X149"}:
    respuestas[3] = 2
elif relevantes == {"X149", "X82"}:
    respuestas[3] = 3
elif relevantes == {"X1"}:
    respuestas[3] = 1
else:
    respuestas[3] = None
    print("  AVISO: ninguna opción describe exactamente los nulos detectados.")
    print("  (La variable 'injury' carga su clase \\"None\\" como NaN; por eso se aplica fillna más arriba.)")
print(f"  → Respuesta 3: {letra(respuestas[3]) if respuestas[3] is not None else '— (ver aviso)'}")

# --- Pregunta 4: tamaño del conjunto de test ---
print("\\nPregunta 4 — Tamaño del conjunto de test (70/30, random_state=1)")
opciones_q4 = ["95", "196", "85", "100"]
print(f"  Test: {len(X_test)} filas")
respuestas[4] = opcion_mas_cercana(len(X_test), opciones_q4)
print(f"  → Respuesta 4: {letra(respuestas[4])}")

# --- Pregunta 5: matriz de confusión (sin podar) ---
print("\\nPregunta 5 — Matriz de confusión del árbol sin podar")
opciones_q5 = [
    "Fila 1: [17, 20, 4] | Fila 2: [14, 17, 2] | Fila 3: [9, 2, 0]",
    "Fila 1: [15, 13, 4] | Fila 2: [16, 24, 2] | Fila 3: [9, 2, 0]",
    "Fila 1: [17, 10, 4] | Fila 2: [14, 27, 2] | Fila 3: [9, 2, 0]",
    "Fila 1: [17, 20, 4] | Fila 2: [14, 17, 1] | Fila 3: [9, 2, 1]",
]
print(f"  Matriz obtenida (clases {list(arbol.classes_)}):")
print(f"  {matriz.tolist()}")
idx5 = comparar_matriz(matriz, opciones_q5)
respuestas[5] = idx5
if idx5 is None:
    print("  AVISO: la matriz obtenida no coincide exactamente con ninguna opción.")
print(f"  → Respuesta 5: {letra(respuestas[5]) if idx5 is not None else '— (ver aviso)'}")

# --- Pregunta 6: profundidad (sin podar) ---
print("\\nPregunta 6 — Profundidad del árbol sin podar")
opciones_q6 = ["25", "5", "13", "22"]
print(f"  Profundidad obtenida: {arbol.get_depth()}")
respuestas[6] = opcion_mas_cercana(arbol.get_depth(), opciones_q6)
print(f"  → Respuesta 6: {letra(respuestas[6])}")

# --- Pregunta 7: accuracy (sin podar, en %) ---
print("\\nPregunta 7 — Accuracy del árbol sin podar")
opciones_q7 = ["41", "50", "61", "33"]
acc_sin_podar = accuracy_score(y_test, y_pred) * 100
print(f"  Accuracy obtenida: {acc_sin_podar:.2f}%")
respuestas[7] = opcion_mas_cercana(acc_sin_podar, opciones_q7)
print(f"  → Respuesta 7: {letra(respuestas[7])}")

# --- Pregunta 8: nodos terminales (sin podar) ---
print("\\nPregunta 8 — Nodos terminales del árbol sin podar")
opciones_q8 = ["13", "48", "96", "24"]
print(f"  Nodos terminales obtenidos: {arbol.get_n_leaves()}")
respuestas[8] = opcion_mas_cercana(arbol.get_n_leaves(), opciones_q8)
print(f"  → Respuesta 8: {letra(respuestas[8])}")

# --- Pregunta 9: mejor max_depth (GridSearchCV) ---
print("\\nPregunta 9 — Mejor nivel de poda (max_depth)")
opciones_q9 = ["7", "5", "3", "4"]
print(f"  Mejor max_depth obtenido: {grid.best_params_['max_depth']}")
respuestas[9] = opcion_mas_cercana(grid.best_params_["max_depth"], opciones_q9)
print(f"  → Respuesta 9: {letra(respuestas[9])}")

# --- Pregunta 10: matriz de confusión (podado) ---
print("\\nPregunta 10 — Matriz de confusión del árbol podado")
opciones_q10 = [
    "Fila 1: [32, 5, 4] | Fila 2: [15, 16, 1] | Fila 3: [10, 1, 1]",
    "Fila 1: [30, 5, 4] | Fila 2: [15, 14, 1] | Fila 3: [12, 3, 1]",
    "Fila 1: [30, 5, 4] | Fila 2: [65, 14, 1] | Fila 3: [12, 3, 1]",
    "Fila 1: [32, 5, 4] | Fila 2: [15, 14, 1] | Fila 3: [12, 3, 1]",
]
print(f"  Matriz obtenida (clases {list(modelo_podado.classes_)}):")
print(f"  {matriz_podado.tolist()}")
idx10 = comparar_matriz(matriz_podado, opciones_q10)
respuestas[10] = idx10
if idx10 is None:
    print("  AVISO: la matriz obtenida no coincide exactamente con ninguna opción.")
print(f"  → Respuesta 10: {letra(respuestas[10]) if idx10 is not None else '— (ver aviso)'}")

# --- Pregunta 11: accuracy (podado, en %) ---
print("\\nPregunta 11 — Accuracy del árbol podado")
opciones_q11 = ["72", "41", "61", "57"]
acc_podado = accuracy_score(y_test, y_pred_podado) * 100
print(f"  Accuracy obtenida: {acc_podado:.2f}%")
respuestas[11] = opcion_mas_cercana(acc_podado, opciones_q11)
print(f"  → Respuesta 11: {letra(respuestas[11])}")

# --- Pregunta 12: nodos terminales (podado) ---
print("\\nPregunta 12 — Nodos terminales del árbol podado")
opciones_q12 = ["7", "52", "31", "28"]
print(f"  Nodos terminales obtenidos: {modelo_podado.get_n_leaves()}")
respuestas[12] = opcion_mas_cercana(modelo_podado.get_n_leaves(), opciones_q12)
print(f"  → Respuesta 12: {letra(respuestas[12])}")

# --- Pregunta 13: importancia de X70 ---
print("\\nPregunta 13 — Importancia de la variable X70")
opciones_q13 = ["0.12", "0", "1", "0.06"]
fila_x70 = importancias[importancias["variable"] == "X70"]
imp_x70 = float(fila_x70["importancia"].iloc[0]) if not fila_x70.empty else 0.0
print(f"  Importancia de X70: {imp_x70}")
respuestas[13] = opcion_mas_cercana(imp_x70, opciones_q13)
print(f"  → Respuesta 13: {letra(respuestas[13])}")

# --- Pregunta 14: variable más importante ---
print("\\nPregunta 14 — Variable con mayor importancia")
opciones_q14 = ["X70", "X2", "X192", "X142"]
top_var = importancias.iloc[0]["variable"]
print(f"  Variable con mayor importancia: {top_var} ({importancias.iloc[0]['importancia']:.4f})")
if top_var in opciones_q14:
    respuestas[14] = opciones_q14.index(top_var)
else:
    respuestas[14] = None
    print(f"  AVISO: '{top_var}' no aparece entre las opciones.")
print(f"  → Respuesta 14: {letra(respuestas[14]) if respuestas[14] is not None else '— (ver aviso)'}")

# ════════════════════════════════════════════════════════════════
# RESUMEN FINAL
# ════════════════════════════════════════════════════════════════

print("\\n" + "=" * 70)
print("RESUMEN FINAL")
print("=" * 70)
for i in range(1, 15):
    r = respuestas.get(i)
    valor = letra(r) if r is not None else "— (ver aviso arriba)"
    print(f"  Pregunta {i:>2}: {valor}")
`;
}

// ── Notebook genérico de fallback ───────────────────────────────────────────
function getGenericNotebookCode(target) {
  const targetLine = target ? `"${target}"` : 'None';

  return `import pandas as pd

print("Primeras filas del dataset:")
print(df.head())

print("\\nDimensiones (filas, columnas):", df.shape)

print("\\nTipos de datos:")
print(df.dtypes)

print("\\nValores nulos por columna:")
print(df.isnull().sum())

target = ${targetLine}

if target and target in df.columns:
    print(f"\\nVariable objetivo: {target}")
    print(df[target].value_counts())

    from sklearn.model_selection import train_test_split

    X = df.drop(columns=[target])
    y = df[target]
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.3, random_state=1
    )
    print(f"\\nTrain: {len(X_train)} filas · Test: {len(X_test)} filas")
else:
    print("\\n(No se ha definido todavía una variable objetivo para este modelo.)")
`;
}

// ════════════════════════════════════════════════════════════════════════════
// NOTEBOOK EXPORTABLE (.ipynb)
//
// A diferencia del notebook web (que asume `df` ya cargado por StudyHub),
// el notebook exportable es autocontenido: incluye su propia celda de carga
// del CSV (que debe colocarse en la misma carpeta que el .ipynb) y reparte
// la resolución en varias celdas legibles en lugar de un único bloque.
// ════════════════════════════════════════════════════════════════════════════

function getModeloAExportableCells(csvFilename) {
  return [
    {
      type: 'markdown',
      source: `# AAMD — 2025 Modelo A

Notebook de resolución del test.

Dataset esperado en la misma carpeta:

\`${csvFilename}\`

Variable objetivo:

\`injury\`

> Coloca este notebook y el CSV (\`${csvFilename}\`) en la misma carpeta antes de ejecutar.`,
    },
    {
      type: 'code',
      source: `import re
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import confusion_matrix, accuracy_score`,
    },
    {
      type: 'code',
      source: `CSV_FILENAME = "${csvFilename}"
target = "injury"

df = pd.read_csv(CSV_FILENAME)

print("CSV cargado:", CSV_FILENAME)
print("Dimensiones:", df.shape)
df.head()`,
    },
    {
      type: 'markdown',
      source: `## Funciones auxiliares

Funciones de apoyo para identificar la opción correcta de cada pregunta del test.`,
    },
    {
      type: 'code',
      source: `def letra(indice):
    """Convierte un índice 0-3 en letra A-D (o '?' si no es válido)."""
    opciones = ["A", "B", "C", "D"]
    return opciones[indice] if indice is not None and 0 <= indice < len(opciones) else "?"


def parse_numeros(texto):
    """Extrae todos los números (enteros o decimales) de un texto."""
    return [float(n) for n in re.findall(r"-?\\d+\\.?\\d*", texto)]


def opcion_mas_cercana(valor, opciones):
    """Índice de la opción cuyo primer número está más cerca de 'valor'."""
    primeros = []
    for op in opciones:
        nums = parse_numeros(op)
        primeros.append(nums[0] if nums else float("inf"))
    diferencias = [abs(valor - n) for n in primeros]
    return int(np.argmin(diferencias))


def comparar_matriz(matriz_obtenida, opciones):
    """
    Compara una matriz de confusión (array/lista de listas) con opciones de
    texto del tipo 'Fila 1: [a, b, c] | Fila 2: [...] | Fila 3: [...]'.
    Devuelve el índice de la opción que coincide exactamente, o None.
    """
    obtenida = [int(v) for fila in matriz_obtenida for v in fila]
    for i, op in enumerate(opciones):
        bloques = re.findall(r"\\[([^\\]]*)\\]", op)
        nums = []
        for bloque in bloques:
            nums.extend(int(n) for n in re.findall(r"-?\\d+", bloque))
        if nums == obtenida:
            return i
    return None


respuestas = {}`,
    },
    {
      type: 'markdown',
      source: `## Preparación de los datos

En \`${csvFilename}\`, la clase \`"None"\` de la variable objetivo \`injury\` se
carga como \`NaN\`. Hay que convertirla a la cadena \`"None"\` antes de separar
\`X\` e \`y\`, y antes de hacer el split train/test.`,
    },
    {
      type: 'code',
      source: `nulos_originales = df.isnull().sum()
print("Valores nulos por columna (dataset original):")
print(nulos_originales[nulos_originales > 0])

# IMPORTANTE: la clase "None" de la variable objetivo se carga como NaN.
df[target] = df[target].fillna("None")

X = df.drop(columns=[target])
y = df[target]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=1
)

print("\\nTrain:", X_train.shape)
print("Test:", X_test.shape)
print(y_train.value_counts())
print(y_test.value_counts())`,
    },
    {
      type: 'markdown',
      source: `## Preguntas 1-4 · Exploración inicial`,
    },
    {
      type: 'code',
      source: `# --- Pregunta 1: outliers en X5 (mediana ± 1.5·IQR) ---
print("Pregunta 1 — Outliers en X5")
opciones_q1 = [
    "18, 59, 100 y 2.2",
    "6, 59, 100 y 2.2",
    "100, 44, 59 y 60",
    "18, 28, 100 y 60",
]
col = "X5"
q1_, q3_ = df[col].quantile(0.25), df[col].quantile(0.75)
iqr = q3_ - q1_
mediana = df[col].median()
lim_inf, lim_sup = mediana - 1.5 * iqr, mediana + 1.5 * iqr
outliers_x5 = sorted(df[(df[col] < lim_inf) | (df[col] > lim_sup)][col].tolist())
print(f"  Límites (mediana ± 1.5·IQR): [{lim_inf}, {lim_sup}]")
print(f"  Outliers detectados en X5: {outliers_x5}")

mejor_idx, mejor_n = None, -1
for i, op in enumerate(opciones_q1):
    valores = parse_numeros(op)
    n_coincide = sum(1 for v in valores if v in outliers_x5)
    print(f"    Opción {letra(i)} ({op}): {n_coincide}/{len(valores)} valores son outliers")
    if n_coincide > mejor_n:
        mejor_n, mejor_idx = n_coincide, i
respuestas[1] = mejor_idx
print(f"  → Respuesta 1: {letra(respuestas[1])}")

# --- Pregunta 2: tipos de variables ---
print("\\nPregunta 2 — Tipos de variables")
no_numericas = df.select_dtypes(exclude=[np.number]).columns.tolist()
print(f"  Columnas no numéricas: {no_numericas}")
if no_numericas == [target]:
    respuestas[2] = 0
else:
    respuestas[2] = None
    print("  AVISO: no coincide con ninguna opción de forma directa, revisar manualmente.")
print(f"  → Respuesta 2: {letra(respuestas[2])}")

# --- Pregunta 3: datos faltantes ---
print("\\nPregunta 3 — Datos faltantes")
cols_con_nulos = nulos_originales[nulos_originales > 0]
print(f"  Columnas con valores nulos (dataset original): {dict(cols_con_nulos)}")
relevantes = set(cols_con_nulos.index) - {target}
if not relevantes:
    # La única columna con nulos es la variable objetivo, cuya clase "None"
    # se carga como NaN (ya corregida más arriba). Las variables
    # predictoras no tienen datos faltantes.
    respuestas[3] = 0
elif relevantes == {"X149"}:
    respuestas[3] = 2
elif relevantes == {"X149", "X82"}:
    respuestas[3] = 3
elif relevantes == {"X1"}:
    respuestas[3] = 1
else:
    respuestas[3] = None
    print("  AVISO: ninguna opción describe exactamente los nulos detectados.")
print(f"  → Respuesta 3: {letra(respuestas[3]) if respuestas[3] is not None else '— (ver aviso)'}")

# --- Pregunta 4: tamaño del conjunto de test ---
print("\\nPregunta 4 — Tamaño del conjunto de test (70/30, random_state=1)")
opciones_q4 = ["95", "196", "85", "100"]
print(f"  Test: {len(X_test)} filas")
respuestas[4] = opcion_mas_cercana(len(X_test), opciones_q4)
print(f"  → Respuesta 4: {letra(respuestas[4])}")`,
    },
    {
      type: 'markdown',
      source: `## Árbol sin podar y preguntas 5-8

Árbol de decisión sin restricciones (\`random_state=1\`).`,
    },
    {
      type: 'code',
      source: `arbol = DecisionTreeClassifier(random_state=1)
arbol.fit(X_train, y_train)
y_pred = arbol.predict(X_test)

matriz = confusion_matrix(y_test, y_pred)
print("Clases:", list(arbol.classes_))
print("Matriz de confusión:")
print(matriz)
print("Profundidad:", arbol.get_depth())
print("Accuracy:", accuracy_score(y_test, y_pred))
print("Nodos terminales (hojas):", arbol.get_n_leaves())

# --- Pregunta 5: matriz de confusión (sin podar) ---
print("\\nPregunta 5 — Matriz de confusión del árbol sin podar")
opciones_q5 = [
    "Fila 1: [17, 20, 4] | Fila 2: [14, 17, 2] | Fila 3: [9, 2, 0]",
    "Fila 1: [15, 13, 4] | Fila 2: [16, 24, 2] | Fila 3: [9, 2, 0]",
    "Fila 1: [17, 10, 4] | Fila 2: [14, 27, 2] | Fila 3: [9, 2, 0]",
    "Fila 1: [17, 20, 4] | Fila 2: [14, 17, 1] | Fila 3: [9, 2, 1]",
]
print(f"  Matriz obtenida (clases {list(arbol.classes_)}):")
print(f"  {matriz.tolist()}")
idx5 = comparar_matriz(matriz, opciones_q5)
respuestas[5] = idx5
if idx5 is None:
    print("  AVISO: la matriz obtenida no coincide exactamente con ninguna opción.")
print(f"  → Respuesta 5: {letra(respuestas[5]) if idx5 is not None else '— (ver aviso)'}")

# --- Pregunta 6: profundidad (sin podar) ---
print("\\nPregunta 6 — Profundidad del árbol sin podar")
opciones_q6 = ["25", "5", "13", "22"]
print(f"  Profundidad obtenida: {arbol.get_depth()}")
respuestas[6] = opcion_mas_cercana(arbol.get_depth(), opciones_q6)
print(f"  → Respuesta 6: {letra(respuestas[6])}")

# --- Pregunta 7: accuracy (sin podar, en %) ---
print("\\nPregunta 7 — Accuracy del árbol sin podar")
opciones_q7 = ["41", "50", "61", "33"]
acc_sin_podar = accuracy_score(y_test, y_pred) * 100
print(f"  Accuracy obtenida: {acc_sin_podar:.2f}%")
respuestas[7] = opcion_mas_cercana(acc_sin_podar, opciones_q7)
print(f"  → Respuesta 7: {letra(respuestas[7])}")

# --- Pregunta 8: nodos terminales (sin podar) ---
print("\\nPregunta 8 — Nodos terminales del árbol sin podar")
opciones_q8 = ["13", "48", "96", "24"]
print(f"  Nodos terminales obtenidos: {arbol.get_n_leaves()}")
respuestas[8] = opcion_mas_cercana(arbol.get_n_leaves(), opciones_q8)
print(f"  → Respuesta 8: {letra(respuestas[8])}")`,
    },
    {
      type: 'markdown',
      source: `## GridSearchCV y pregunta 9

Validación cruzada (\`cv=5\`) para elegir el mejor \`max_depth\` entre 1 y 20.`,
    },
    {
      type: 'code',
      source: `param_grid = {"max_depth": range(1, 21)}
grid = GridSearchCV(
    DecisionTreeClassifier(random_state=1),
    param_grid,
    cv=5,
    scoring="accuracy",
)
grid.fit(X_train, y_train)
print("Mejor max_depth:", grid.best_params_["max_depth"])

# --- Pregunta 9: mejor max_depth (GridSearchCV) ---
print("\\nPregunta 9 — Mejor nivel de poda (max_depth)")
opciones_q9 = ["7", "5", "3", "4"]
print(f"  Mejor max_depth obtenido: {grid.best_params_['max_depth']}")
respuestas[9] = opcion_mas_cercana(grid.best_params_["max_depth"], opciones_q9)
print(f"  → Respuesta 9: {letra(respuestas[9])}")`,
    },
    {
      type: 'markdown',
      source: `## Árbol podado y preguntas 10-14

Árbol de decisión con el \`max_depth\` óptimo obtenido por validación cruzada.`,
    },
    {
      type: 'code',
      source: `modelo_podado = grid.best_estimator_
y_pred_podado = modelo_podado.predict(X_test)

matriz_podado = confusion_matrix(y_test, y_pred_podado)
print("Clases:", list(modelo_podado.classes_))
print("Matriz de confusión:")
print(matriz_podado)
print("Accuracy:", accuracy_score(y_test, y_pred_podado))
print("Nodos terminales (hojas):", modelo_podado.get_n_leaves())

importancias = pd.DataFrame({
    "variable": X_train.columns,
    "importancia": modelo_podado.feature_importances_,
}).sort_values("importancia", ascending=False)

print("\\nVariables más importantes:")
print(importancias.head(10).to_string(index=False))

# --- Pregunta 10: matriz de confusión (podado) ---
print("\\nPregunta 10 — Matriz de confusión del árbol podado")
opciones_q10 = [
    "Fila 1: [32, 5, 4] | Fila 2: [15, 16, 1] | Fila 3: [10, 1, 1]",
    "Fila 1: [30, 5, 4] | Fila 2: [15, 14, 1] | Fila 3: [12, 3, 1]",
    "Fila 1: [30, 5, 4] | Fila 2: [65, 14, 1] | Fila 3: [12, 3, 1]",
    "Fila 1: [32, 5, 4] | Fila 2: [15, 14, 1] | Fila 3: [12, 3, 1]",
]
print(f"  Matriz obtenida (clases {list(modelo_podado.classes_)}):")
print(f"  {matriz_podado.tolist()}")
idx10 = comparar_matriz(matriz_podado, opciones_q10)
respuestas[10] = idx10
if idx10 is None:
    print("  AVISO: la matriz obtenida no coincide exactamente con ninguna opción.")
print(f"  → Respuesta 10: {letra(respuestas[10]) if idx10 is not None else '— (ver aviso)'}")

# --- Pregunta 11: accuracy (podado, en %) ---
print("\\nPregunta 11 — Accuracy del árbol podado")
opciones_q11 = ["72", "41", "61", "57"]
acc_podado = accuracy_score(y_test, y_pred_podado) * 100
print(f"  Accuracy obtenida: {acc_podado:.2f}%")
respuestas[11] = opcion_mas_cercana(acc_podado, opciones_q11)
print(f"  → Respuesta 11: {letra(respuestas[11])}")

# --- Pregunta 12: nodos terminales (podado) ---
print("\\nPregunta 12 — Nodos terminales del árbol podado")
opciones_q12 = ["7", "52", "31", "28"]
print(f"  Nodos terminales obtenidos: {modelo_podado.get_n_leaves()}")
respuestas[12] = opcion_mas_cercana(modelo_podado.get_n_leaves(), opciones_q12)
print(f"  → Respuesta 12: {letra(respuestas[12])}")

# --- Pregunta 13: importancia de X70 ---
print("\\nPregunta 13 — Importancia de la variable X70")
opciones_q13 = ["0.12", "0", "1", "0.06"]
fila_x70 = importancias[importancias["variable"] == "X70"]
imp_x70 = float(fila_x70["importancia"].iloc[0]) if not fila_x70.empty else 0.0
print(f"  Importancia de X70: {imp_x70}")
respuestas[13] = opcion_mas_cercana(imp_x70, opciones_q13)
print(f"  → Respuesta 13: {letra(respuestas[13])}")

# --- Pregunta 14: variable más importante ---
print("\\nPregunta 14 — Variable con mayor importancia")
opciones_q14 = ["X70", "X2", "X192", "X142"]
top_var = importancias.iloc[0]["variable"]
print(f"  Variable con mayor importancia: {top_var} ({importancias.iloc[0]['importancia']:.4f})")
if top_var in opciones_q14:
    respuestas[14] = opciones_q14.index(top_var)
else:
    respuestas[14] = None
    print(f"  AVISO: '{top_var}' no aparece entre las opciones.")
print(f"  → Respuesta 14: {letra(respuestas[14]) if respuestas[14] is not None else '— (ver aviso)'}")`,
    },
    {
      type: 'markdown',
      source: `## Resumen final`,
    },
    {
      type: 'code',
      source: `print("=" * 70)
print("RESUMEN FINAL")
print("=" * 70)
for i in range(1, 15):
    r = respuestas.get(i)
    valor = letra(r) if r is not None else "— (ver aviso arriba)"
    print(f"  Pregunta {i:>2}: {valor}")`,
    },
  ];
}

// ── Notebook exportable genérico de fallback ────────────────────────────────
function getGenericExportableCells({ asignaturaId, modeloId, target, csvFilename }) {
  const targetLine = target ? `"${target}"` : 'None';
  const titulo = [asignaturaId?.toUpperCase(), modeloId].filter(Boolean).join(' — ') || 'Notebook';

  return [
    {
      type: 'markdown',
      source: `# ${titulo}

Notebook de exploración del dataset.

Dataset esperado en la misma carpeta:

\`${csvFilename}\`

> Coloca este notebook y el CSV (\`${csvFilename}\`) en la misma carpeta antes de ejecutar.`,
    },
    {
      type: 'code',
      source: `import pandas as pd

CSV_FILENAME = "${csvFilename}"

df = pd.read_csv(CSV_FILENAME)

print("CSV cargado:", CSV_FILENAME)
print("Dimensiones:", df.shape)
df.head()`,
    },
    {
      type: 'markdown',
      source: `## Exploración inicial`,
    },
    {
      type: 'code',
      source: `print("Tipos de datos:")
print(df.dtypes)

print("\\nValores nulos por columna:")
print(df.isnull().sum())

target = ${targetLine}

if target and target in df.columns:
    print(f"\\nVariable objetivo: {target}")
    print(df[target].value_counts())

    from sklearn.model_selection import train_test_split

    X = df.drop(columns=[target])
    y = df[target]
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.3, random_state=1
    )
    print(f"\\nTrain: {len(X_train)} filas · Test: {len(X_test)} filas")
else:
    print("\\n(No se ha definido todavía una variable objetivo para este modelo.)")`,
    },
  ];
}

// ════════════════════════════════════════════════════════════════════════════
// NOTEBOOKS EXPORTABLES CONFIGURADOS (resto de modelos AAMD)
//
// Generador genérico, dirigido por AAMD_NOTEBOOK_MODEL_CONFIG, para los
// modelos '2025-modelo-b-ext', '2025-modelo-c', '2025-modelo-d-ext',
// '2025-modelo-d' y 'simulacro'. El modelo '2025-modelo-a' conserva su
// notebook dedicado (getModeloAExportableCells), ya validado.
// ════════════════════════════════════════════════════════════════════════════

// Funciones auxiliares reutilizables (idénticas para todos los modelos
// configurados): outliers por IQR, resumen de nulos, métricas por clase,
// importancia de variables, clasificador trivial y reducción ROC binaria.
const CONFIGURED_MODEL_HELPERS_PY = `def calcular_outliers_iqr(df, col):
    """Valores de la columna fuera de mediana ± 1.5·IQR, ordenados."""
    q1, q3 = df[col].quantile(0.25), df[col].quantile(0.75)
    iqr = q3 - q1
    mediana = df[col].median()
    lim_inf, lim_sup = mediana - 1.5 * iqr, mediana + 1.5 * iqr
    return sorted(df[(df[col] < lim_inf) | (df[col] > lim_sup)][col].tolist())


def contar_faltantes_predictoras(df, target):
    """Nulos por columna en las variables predictoras (sin la columna target)."""
    nulos = df.drop(columns=[target]).isnull().sum()
    return nulos[nulos > 0]


def resumen_faltantes(df, target):
    """Resumen de nulos: dataset completo, variable objetivo y predictoras."""
    nulos_totales = df.isnull().sum()
    return {
        "totales": nulos_totales[nulos_totales > 0],
        "target": int(nulos_totales.get(target, 0)),
        "predictoras": contar_faltantes_predictoras(df, target),
    }


def metricas_por_clase(y_true, y_pred):
    """classification_report como diccionario (zero_division=0)."""
    return classification_report(y_true, y_pred, output_dict=True, zero_division=0)


def get_metric(report, clase, metrica):
    """Extrae una métrica (precision/recall/f1-score) de la clase indicada."""
    return report.get(str(clase), {}).get(metrica)


def importancia_variable(modelo, X_train, variable):
    """Importancia de 'variable' según feature_importances_ del modelo."""
    if variable not in X_train.columns:
        return None
    idx = list(X_train.columns).index(variable)
    return float(modelo.feature_importances_[idx])


def clase_trivial(y_train):
    """Clase mayoritaria de y_train (predicción del clasificador trivial)."""
    return y_train.value_counts().idxmax()


def accuracy_trivial(y_test, clase):
    """Accuracy de un clasificador que siempre predice 'clase'."""
    return float((y_test == clase).mean())


def matriz_confusion_df(y_true, y_pred, classes):
    """Matriz de confusión como DataFrame etiquetado con 'classes'."""
    matriz = confusion_matrix(y_true, y_pred, labels=classes)
    return pd.DataFrame(matriz, index=classes, columns=classes)


def roc_binario_desde_clases(y_true, y_pred, positive_classes, negative_class):
    """
    Reduce un problema multiclase a binario (positivo vs. negativo).
    Las clases que no están en positive_classes (incluida negative_class)
    se tratan como negativas. Devuelve TP/FP/FN/TN, TPR y FPR.
    """
    y_true_bin = y_true.isin(positive_classes).astype(int)
    y_pred_bin = pd.Series(y_pred, index=y_true.index).isin(positive_classes).astype(int)
    tp = int(((y_true_bin == 1) & (y_pred_bin == 1)).sum())
    fn = int(((y_true_bin == 1) & (y_pred_bin == 0)).sum())
    fp = int(((y_true_bin == 0) & (y_pred_bin == 1)).sum())
    tn = int(((y_true_bin == 0) & (y_pred_bin == 0)).sum())
    tpr = tp / (tp + fn) if (tp + fn) > 0 else None
    fpr = fp / (fp + tn) if (fp + tn) > 0 else None
    return {"TP": tp, "FN": fn, "FP": fp, "TN": tn, "TPR": tpr, "FPR": fpr, "negativa": negative_class}`;

// Despachador genérico de preguntas. Cada elemento de `preguntas` (definido
// en AAMD_NOTEBOOK_MODEL_CONFIG[...].testQuestions) se resuelve según su
// "tipo", usando las funciones auxiliares y las variables ya definidas en
// el notebook (df, target, X_train, X_test, y_train, y_test, arbol, y_pred,
// report_sin_podar, grid, modelo_podado, y_pred_podado, report_podado).
const RESOLVER_PREGUNTA_PY = `def resolver_pregunta(q):
    """Calcula y muestra el resultado de una pregunta del test según su tipo."""
    tipo = q["tipo"]
    print(f"\\nPregunta {q['numero']} — {q['texto']}")

    if tipo == "outliers_iqr":
        valores = calcular_outliers_iqr(df, q["columna"])
        print(f"  Outliers detectados en {q['columna']}: {valores}")
        resultado = valores

    elif tipo == "num_outliers_iqr":
        valores = calcular_outliers_iqr(df, q["columna"])
        print(f"  Outliers detectados en {q['columna']}: {valores}")
        print(f"  Número de outliers: {len(valores)}")
        resultado = len(valores)

    elif tipo == "moda_variable":
        resultado = df[q["columna"]].mode().iloc[0]
        print(f"  Moda de {q['columna']}: {resultado}")

    elif tipo == "tipo_variables":
        no_numericas = df.select_dtypes(exclude=[np.number]).columns.tolist()
        print(f"  Columnas no numéricas: {no_numericas}")
        print(f"  Columnas numéricas: {df.shape[1] - len(no_numericas)}")
        resultado = no_numericas

    elif tipo == "faltantes_dataset":
        resumen = resumen_faltantes(df, target)
        total_nulos = int(df.isnull().sum().sum())
        print(f"  Nulos totales en el dataset: {total_nulos}")
        print(f"  Nulos en variables predictoras: {dict(resumen['predictoras'])}")
        print(f"  Nulos en la variable objetivo ({target}): {resumen['target']}")
        resultado = total_nulos

    elif tipo == "faltantes_variable":
        resultado = int(df[q["columna"]].isnull().sum())
        print(f"  Valores nulos en {q['columna']}: {resultado}")

    elif tipo == "info_dimensiones":
        print(f"  X_train: {X_train.shape} (filas, columnas)")
        print(f"  X_test: {X_test.shape} (filas, columnas)")
        resultado = {
            "train_filas": X_train.shape[0],
            "train_columnas": X_train.shape[1],
            "test_filas": X_test.shape[0],
            "test_columnas": X_test.shape[1],
        }

    elif tipo == "metrica_clase":
        version = q.get("version", "sin_podar")
        report = report_podado if version == "podado" else report_sin_podar
        resultado = get_metric(report, q["clase"], q["metrica"])
        print(f"  {q['metrica']} de la clase '{q['clase']}' ({version}): {resultado}")

    elif tipo == "clase_trivial":
        resultado = clase_trivial(y_train)
        print(f"  Clase mayoritaria en y_train: {resultado}")

    elif tipo == "accuracy_trivial":
        clase = clase_trivial(y_train)
        resultado = accuracy_trivial(y_test, clase)
        print(f"  Clasificador trivial (predice siempre '{clase}')")
        print(f"  Accuracy: {resultado:.4f} ({resultado * 100:.2f}%)")

    elif tipo == "mejora_trivial":
        clase = clase_trivial(y_train)
        acc_trivial = accuracy_trivial(y_test, clase)
        acc_arbol = accuracy_score(y_test, y_pred)
        resultado = acc_arbol > acc_trivial
        print(f"  Accuracy clasificador trivial ('{clase}'): {acc_trivial:.4f}")
        print(f"  Accuracy árbol sin podar: {acc_arbol:.4f}")
        print(f"  ¿Mejora el árbol al clasificador trivial?: {'Sí' if resultado else 'No'}")

    elif tipo == "porcentaje_error":
        version = q.get("version", "sin_podar")
        preds = y_pred_podado if version == "podado" else y_pred
        resultado = (1 - accuracy_score(y_test, preds)) * 100
        print(f"  Porcentaje de error ({version}): {resultado:.2f}%")

    elif tipo == "mejor_max_depth":
        resultado = grid.best_params_["max_depth"]
        print(f"  Mejor max_depth (GridSearchCV, cv=5): {resultado}")

    elif tipo == "importancia_variable":
        resultado = importancia_variable(modelo_podado, X_train, q["columna"])
        print(f"  Importancia de {q['columna']} (árbol podado): {resultado}")

    else:
        resultado = None
        print("  AVISO: tipo de pregunta no reconocido.")

    print("  → Compara este resultado con las opciones del enunciado.")
    return resultado`;

// Genera las celdas de un notebook exportable para un modelo configurado en
// AAMD_NOTEBOOK_MODEL_CONFIG (todos salvo '2025-modelo-a').
function getConfiguredModelExportableCells(config) {
  const {
    title,
    csvFilename,
    predictionsFilename,
    target,
    classes,
    positiveClasses,
    negativeClass,
    hasPredictionCsv,
    testQuestions = [],
  } = config;

  const clasesLit = JSON.stringify(classes);
  const positiveLit = JSON.stringify(positiveClasses);
  const negativeLit = JSON.stringify(negativeClass);
  const preguntasLit = JSON.stringify(testQuestions, null, 4);

  const cells = [];

  // 1. Markdown: título e instrucciones
  const datasetsInfo = hasPredictionCsv
    ? `Datasets esperados en la misma carpeta:

- \`${csvFilename}\` (dataset principal, usado en las preguntas Q1-Q14)
- \`${predictionsFilename}\` (predicciones de 3 modelos candidatos, usado en el ejercicio de desarrollo)

> Coloca este notebook y ambos CSV en la misma carpeta antes de ejecutar.`
    : `Dataset esperado en la misma carpeta:

\`${csvFilename}\`

> Coloca este notebook y el CSV (\`${csvFilename}\`) en la misma carpeta antes de ejecutar.`;

  cells.push({
    type: 'markdown',
    source: `# AAMD — ${title}

Notebook de resolución del test.

${datasetsInfo}

Variable objetivo:

\`${target}\`

Clases: ${classes.map((c) => `\`${c}\``).join(', ')}

> Las preguntas Q1-Q14 se resuelven calculando los valores reales a partir
> de los datos y los modelos entrenados. Compara cada resultado con las
> opciones de tu enunciado para elegir la respuesta correcta.`,
  });

  // 2. Código: imports
  cells.push({
    type: 'code',
    source: `import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score`,
  });

  // 3. Código: carga de datos
  if (hasPredictionCsv) {
    cells.push({
      type: 'code',
      source: `CSV_FILENAME = "${csvFilename}"
PREDICTIONS_FILENAME = "${predictionsFilename}"
target = "${target}"

df = pd.read_csv(CSV_FILENAME)
df_pred = pd.read_csv(PREDICTIONS_FILENAME)

print("CSV principal cargado:", CSV_FILENAME)
print("Dimensiones:", df.shape)

print("\\nCSV de predicciones cargado:", PREDICTIONS_FILENAME)
print("Dimensiones:", df_pred.shape)

df.head()`,
    });
  } else {
    cells.push({
      type: 'code',
      source: `CSV_FILENAME = "${csvFilename}"
target = "${target}"

df = pd.read_csv(CSV_FILENAME)

print("CSV cargado:", CSV_FILENAME)
print("Dimensiones:", df.shape)
df.head()`,
    });
  }

  // 4. Markdown + código: funciones auxiliares
  cells.push({
    type: 'markdown',
    source: `## Funciones auxiliares

Funciones reutilizables para calcular outliers, valores faltantes, métricas
por clase, importancia de variables, el clasificador trivial y la reducción
a un problema binario.`,
  });
  cells.push({ type: 'code', source: CONFIGURED_MODEL_HELPERS_PY });

  // 5. Código: despachador de preguntas + lista de preguntas del test
  cells.push({
    type: 'code',
    source: `${RESOLVER_PREGUNTA_PY}


# Preguntas del test (Q1-Q14): cada una se resuelve más abajo, en el resumen final.
preguntas = ${preguntasLit}`,
  });

  // 6. Markdown + código: preparación de los datos
  cells.push({
    type: 'markdown',
    source: `## Preparación de los datos

\`${csvFilename}\` no tiene valores nulos en la variable objetivo, así que el
reparto en \`X\`/\`y\` y el split train/test (70/30, \`random_state=1\`) son
directos.`,
  });
  cells.push({
    type: 'code',
    source: `print("Dimensiones del dataset:", df.shape)
print("Valores nulos en el dataset (total):", int(df.isnull().sum().sum()))

print(f"\\nDistribución de la variable objetivo ({target}):")
print(df[target].value_counts())

clases = ${clasesLit}
positive_classes = ${positiveLit}
negative_class = ${negativeLit}

X = df.drop(columns=[target])
y = df[target]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=1
)

print(f"\\nTrain: {X_train.shape} · Test: {X_test.shape}")`,
  });

  // 7. Markdown + código: árbol sin podar
  cells.push({
    type: 'markdown',
    source: `## Árbol de decisión sin podar

Árbol de decisión sin restricciones (\`random_state=1\`).`,
  });
  cells.push({
    type: 'code',
    source: `arbol = DecisionTreeClassifier(random_state=1)
arbol.fit(X_train, y_train)
y_pred = arbol.predict(X_test)

print("Clases:", list(arbol.classes_))
print("\\nMatriz de confusión (sin podar):")
print(matriz_confusion_df(y_test, y_pred, clases))
print("\\nProfundidad:", arbol.get_depth())
print("Accuracy:", accuracy_score(y_test, y_pred))
print("Nodos terminales (hojas):", arbol.get_n_leaves())

report_sin_podar = metricas_por_clase(y_test, y_pred)
print("\\nInforme de clasificación (sin podar):")
print(pd.DataFrame(report_sin_podar).T)

roc_info = roc_binario_desde_clases(y_test, y_pred, positive_classes, negative_class)
print(f"\\nReducción a binario (positivas={positive_classes}, negativa='{negative_class}'):")
print(f"  TP={roc_info['TP']}  FN={roc_info['FN']}  FP={roc_info['FP']}  TN={roc_info['TN']}")
print(f"  TPR (sensibilidad): {roc_info['TPR']}")
print(f"  FPR: {roc_info['FPR']}")`,
  });

  // 8. Markdown + código: GridSearchCV y árbol podado
  cells.push({
    type: 'markdown',
    source: `## Validación cruzada (GridSearchCV) y árbol podado

Validación cruzada (\`cv=5\`) para elegir el mejor \`max_depth\` entre 1 y 20,
y árbol de decisión final con ese valor.`,
  });
  cells.push({
    type: 'code',
    source: `param_grid = {"max_depth": range(1, 21)}
grid = GridSearchCV(
    DecisionTreeClassifier(random_state=1),
    param_grid,
    cv=5,
    scoring="accuracy",
)
grid.fit(X_train, y_train)
print("Mejor max_depth:", grid.best_params_["max_depth"])

modelo_podado = grid.best_estimator_
y_pred_podado = modelo_podado.predict(X_test)

print("\\nMatriz de confusión (podado):")
print(matriz_confusion_df(y_test, y_pred_podado, clases))
print("Accuracy:", accuracy_score(y_test, y_pred_podado))
print("Nodos terminales (hojas):", modelo_podado.get_n_leaves())

report_podado = metricas_por_clase(y_test, y_pred_podado)
print("\\nInforme de clasificación (podado):")
print(pd.DataFrame(report_podado).T)

importancias = pd.DataFrame({
    "variable": X_train.columns,
    "importancia": modelo_podado.feature_importances_,
}).sort_values("importancia", ascending=False)

print("\\nVariables más importantes:")
print(importancias.head(10).to_string(index=False))`,
  });

  // 9. (Solo simulacro) Ejercicio de desarrollo con las predicciones precalculadas
  if (hasPredictionCsv) {
    cells.push({
      type: 'markdown',
      source: `## Ejercicio de desarrollo: comparación de modelos candidatos

\`${predictionsFilename}\` contiene la columna \`Real\` (valor verdadero de
\`${target}\` en el conjunto de test) y las predicciones de 3 modelos
candidatos (\`Model_1\`, \`Model_2\`, \`Model_3\`). Se calcula la accuracy y el
informe de clasificación de cada uno para decidir cuál es el mejor.`,
    });
    cells.push({
      type: 'code',
      source: `print("Comparación de modelos candidatos (${predictionsFilename})")
print(df_pred.head())

for modelo_col in ["Model_1", "Model_2", "Model_3"]:
    acc = accuracy_score(df_pred["Real"], df_pred[modelo_col])
    reporte = metricas_por_clase(df_pred["Real"], df_pred[modelo_col])
    print(f"\\n{modelo_col} — Accuracy: {acc:.4f} ({acc * 100:.2f}%)")
    print(pd.DataFrame(reporte).T)`,
    });
  }

  // 10. Markdown + código: resumen final
  cells.push({
    type: 'markdown',
    source: `## Resumen final`,
  });
  cells.push({
    type: 'code',
    source: `print("=" * 70)
print("RESUMEN FINAL - ${title}")
print("=" * 70)

resultados = {}
for q in preguntas:
    resultados[q["numero"]] = resolver_pregunta(q)

print("\\n" + "=" * 70)
print("Valores calculados (compara cada uno con las opciones del enunciado)")
print("=" * 70)
for q in preguntas:
    print(f"  Pregunta {q['numero']:>2} ({q['texto']}): {resultados[q['numero']]}")`,
  });

  // 11. Markdown: nota final
  cells.push({
    type: 'markdown',
    source: `## Notas finales

- Las preguntas Q1-Q14 se calculan automáticamente a partir de los datos
  cargados y de los modelos entrenados (\`random_state=1\`, \`test_size=0.3\`).
- Para las preguntas numéricas (outliers, métricas, importancias,
  porcentajes, etc.), compara el valor obtenido con las opciones del
  enunciado y elige la más cercana.
- Las funciones auxiliares (\`calcular_outliers_iqr\`, \`metricas_por_clase\`,
  \`importancia_variable\`, \`clase_trivial\`, etc.) son reutilizables para
  explorar cualquier otra pregunta no incluida en el resumen.`,
  });

  return cells;
}

// ── API pública ──────────────────────────────────────────────────────────────
export function getNotebookCodeForModel({ asignaturaId, modeloId, target }) {
  if (asignaturaId === 'aamd' && modeloId === '2025-modelo-a') {
    return getModeloANotebook();
  }

  // Modelos pendientes de resolver: '2025-modelo-b-ext', '2025-modelo-c',
  // '2025-modelo-d', '2025-modelo-d-ext', 'simulacro'. Mientras tanto se
  // ofrece el notebook genérico de exploración.
  return getGenericNotebookCode(target);
}

// Lista de celdas { type: 'markdown' | 'code', source } para generar un
// .ipynb autocontenido (carga el CSV desde archivo, no asume `df`).
export function getExportableNotebookCellsForModel({ asignaturaId, modeloId, target, csvFilename }) {
  const csv = csvFilename || 'dataset.csv';

  if (asignaturaId !== 'aamd') {
    return getGenericExportableCells({ asignaturaId, modeloId, target, csvFilename: csv });
  }

  if (modeloId === '2025-modelo-a') {
    return getModeloAExportableCells(csv);
  }

  const config = AAMD_NOTEBOOK_MODEL_CONFIG[modeloId];
  if (config && config.testQuestions) {
    return getConfiguredModelExportableCells(config);
  }

  return getGenericExportableCells({ asignaturaId, modeloId, target, csvFilename: csv });
}
