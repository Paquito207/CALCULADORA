# 🧮 Calculadora Web — Prueba Técnica

Aplicación web que implementa una calculadora funcional, construida con React + Vite.
Incluye una interfaz limpia, componentes reutilizables y manejo robusto de operaciones matemáticas.


## 🎯 Objetivo de la prueba técnica

Evaluar habilidades prácticas en:

* HTML
* CSS
* JavaScript
* Framework moderno (React, Vue o Angular — en este caso: React con Hooks)
* Arquitectura, modularidad y buenas prácticas

La prueba consiste en desarrollar una calculadora con operaciones básicas, soporte para decimales y controles esenciales.


## ✔️ Funcionalidades implementadas

### Operaciones

* Suma
* Resta
* Multiplicación
* División

### Soportes adicionales

* Números decimales
* Cambiar signo (+/-)
* Botón AC (limpiar todo)
* Botón ← para eliminar el último dígito
* División entre cero controlada (muestra "Error")


## 🛠️ Requisitos técnicos cumplidos

* UI y lógica implementadas con React + Hooks
* Proyecto creado con Vite (rápido y moderno)
* Código modular dividido en:

  * `components/` (UI)
  * `utils/` (lógica matemática)
* Estilos en un archivo central (`styles.css`)
* Separación limpia entre presentación y lógica
* Repositorio compatible con GitHub/GitLab
* Proyecto completamente ejecutable vía npm


## 📦 Requisitos previos

Asegúrate de tener instalado:

* Node.js LTS
* npm (incluido con Node)


# ▶️ Ejecución ordenada del proyecto (React + Vite)

1. **Abrir la terminal**
   PowerShell, CMD o terminal del editor (VS Code recomendado).

2. **Ir al directorio del proyecto**
   Ajusta la ruta según tu máquina:

   cd C:\Users\TuUsuario\Documentos\CALCULADORA


3. **Instalar dependencias**
   Esto descarga React, Vite y librerías necesarias:

   npm install

4. **Ejecutar en modo desarrollo**
   Inicia el servidor local con recarga automática:

   npm run dev

5. **Abrir la aplicación en el navegador**
   Por defecto Vite usa este puerto:

   http://localhost:5173


## 📦 Build de producción

npm run build


## 📁 Estructura del proyecto


CALCULADORA/
├─ src/
│  ├─ assets/
│  ├─ components/
│  │   ├─ Button.jsx
│  │   ├─ Display.jsx
│  │   └─ Keypad.jsx
│  ├─ utils/
│  │   └─ math.js
│  ├─ App.css
│  ├─ App.jsx
│  ├─ index.css
│  └─ main.jsx
├─ public/
├─ package.json
└─ README.md



## 🧩 Decisiones de diseño

* React + Vite para un entorno rápido y moderno.
* Componentes pequeños y reutilizables:

  * `Button` es genérico.
  * `Keypad` solo organiza botones.
  * `Display` recibe valores ya calculados.
* **Lógica matemática separada en `utils/math.js`**
  Facilita pruebas, reusabilidad y evita mezclar cálculo con la UI.
* **Manejo seguro de números flotantes**
  Se usa `toFixed(12)` y conversión controlada para evitar errores comunes de precisión.
* **Estado controlado**
  Se gestionan:

  * número actual
  * número previo
  * operador
  * modo de sobrescritura
* **Diseño minimalista** optimizado para claridad y legibilidad.


## 🧪 Cobertura funcional

* Entrada controlada para evitar errores de digitación.
* Limpieza, retroceso, decimales y cambio de signo.
* Cálculos encadenados (ej: 5 + 3 × 2).
* Manejo explícito de errores (división por cero).
