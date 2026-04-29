# /simulador/ — Frontend del simulador

Sprint 1 · Fundación · DigitalMKT Arena · VISORIA Intelligence

## Estructura

```
simulador/
├── index.html         # Landing del simulador
├── registro.html      # Formulario de creación de equipo
├── acceso.html        # Login con código de acceso
├── panel.html         # Panel del equipo autenticado
├── css/
│   └── main.css       # Sistema de diseño completo
└── js/
    ├── api-client.js  # Wrapper de llamadas al Web App de Apps Script
    └── auth.js        # Sesión persistente en localStorage + helpers UI
```

## Cómo funciona

1. **`index.html`** — bienvenida con metadatos en vivo (cohorte, marcas libres, presupuesto). Dos accesos: registrar equipo o ingresar con código.

2. **`registro.html`** — crea el equipo vía `POST crearEquipo`. Al éxito, modal con el código de acceso para copiar.

3. **`acceso.html`** — login con código vía `GET autenticarEquipo`. Si es válido, guarda sesión y redirige al panel.

4. **`panel.html`** — dashboard del equipo: marca asignada, reto estratégico, KPIs iniciales, links EMIS/Legiscomex, datos del equipo y cohorte.

## Backend

URL del Apps Script Web App está hardcodeada en `js/api-client.js` constante `API_URL`. Si la URL cambia (nuevo despliegue), actualízala ahí.

## Sesión

Cada equipo tiene un código de acceso único formato `NOMBRE-XXXX`. Al autenticarse, código y objeto equipo se guardan en `localStorage`. La sesión persiste hasta cerrar sesión manualmente.

## Sistema de diseño

- **Tipografías:** Fraunces (display) + Geist (sans) + Geist Mono — Google Fonts
- **Paleta:** Navy `#0B2545` · Teal `#137DC5` · Gold `#C8963E`
- **Estética:** corporate-clean editorial

## Despliegue

Sube esta carpeta como `/simulador/` a la raíz del repo `jfrubiano72/digitalmkt-arena`. GitHub Pages la servirá en:

```
https://jfrubiano72.github.io/digitalmkt-arena/simulador/
```

## Próximos sprints

- **Sprint 2:** formulario de jugada (10 categorías) + motor individual
- **Sprint 3:** mercado dinámico (SOV relativo, saturación, guerra de precios)
- **Sprint 4:** ranking dinámico + panel docente
- **Sprint 5:** integraciones IA + manuales finales
