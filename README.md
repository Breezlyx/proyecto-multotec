# 🚀 Multotec Project Management - PMBOK 6ª Edición

## ✅ Fase 2: Backend + Integración Frontend Completada

```
┌────────────────────────────────────────────────────────────┐
│              APLICACIÓN FUNCIONAL COMPLETA                │
│                                                            │
│  Frontend: http://localhost:5174                         │
│  Backend:  http://localhost:3000                         │
│  DB:       SQLite (data/database.sqlite)                 │
│                                                            │
│  ✅ Backend Express + SQLite funcionando                 │
│  ✅ CRUD Proyectos y Recursos integrado                 │
│  ✅ Notificaciones Toast con iconos                      │
│  ✅ Modal de confirmación reutilizable                   │
│  ✅ Persistencia de datos en BD                          │
│  ✅ Manejo de errores mejorado                           │
└────────────────────────────────────────────────────────────┘
```

---

## 📊 Funcionalidades Actuales

| Módulo | Estado | Detalles |
|--------|--------|----------|
| **Dashboard** | ✅ Funcional | Métricas en tiempo real desde BD |
| **Proyectos** | ✅ Completo | CRUD + edición modal + persistencia |
| **Recursos** | ✅ Completo | CRUD equipo + edición modal + persistencia |
| **Reportes** | ✅ Funcional | Generación y descarga de reportes |
| **Configuración** | ✅ Funcional | Preferencias del sistema |
| **Backend API** | ✅ Funcional | Express + SQLite con CRUD endpoints |
| **Notificaciones** | ✅ Mejorado | Toasts con iconos y títulos por defecto |
| **Confirmaciones** | ✅ Mejorado | Modal reutilizable de confirmación |

---

## 🏗️ Arquitectura Actual

```
Frontend (Vue 3 + Vite + Pinia)
├── Stores
│   ├── projects.js       [CRUD + Axios]
│   ├── resources.js      [CRUD + Axios]
│   ├── notifications.js  [Toast management]
│   └── modals.js         [Confirm dialogs]
├── Componentes
│   ├── Toast.vue         [Notificaciones]
│   ├── ConfirmDialog.vue [Confirmación modal]
│   └── Reutilizables
├── 5 Vistas + Edición Modal
└── Transformación snake_case ↔ camelCase

Backend (Express + SQLite)
├── Routes
│   ├── /api/projects     [CRUD completo]
│   ├── /api/resources    [CRUD equipo]
│   ├── /api/tasks        [CRUD tareas]
│   └── /api/risks        [CRUD riesgos]
├── Database
│   └── SQLite con 5 tablas
└── CORS habilitado
```

---

## 📈 Roadmap

### ✅ COMPLETADO (Fase 1 & 2)
- ✅ Frontend Vue 3 con Vite
- ✅ State management con Pinia
- ✅ Backend Node.js + Express
- ✅ Database SQLite con persistencia
- ✅ CRUD completo Proyectos y Recursos
- ✅ Integración Frontend ↔ Backend
- ✅ Sistema de notificaciones mejorado
- ✅ Modal de confirmación reutilizable
- ✅ Manejo de errores y validaciones
- ✅ Transformación automática de campos

### ⏳ PRÓXIMO (Fase 3)
- [ ] Tasks y Risks CRUD en frontend
- [ ] Autenticación con JWT
- [ ] Validaciones avanzadas
- [ ] Gráficos dinámicos (Chart.js)
- [ ] Búsqueda y filtros avanzados

---

## 🌐 Acceso Actual

| Tipo | URL | Estado |
|------|-----|--------|
| **Local Frontend** | http://localhost:5174 | ✅ En desarrollo |
| **Local Backend** | http://localhost:3000 | ✅ En desarrollo |
| **Red Local Frontend** | http://192.168.100.6:5174 | ✅ Accesible |
| **API Base** | http://localhost:3000/api | ✅ CORS habilitado |

---

## 🔧 Comandos - Cómo Levantar la Aplicación

### 1️⃣ Instalación de Dependencias (primera vez)

```bash
# Frontend
npm install

# Backend
cd backend
npm install
cd ..
```

### 2️⃣ Levantar el Servidor (Terminal 1)

```bash
npm run dev
```

Verás:
```
  VITE v7.2.2  ready in XXX ms
  ➜  Local:   http://localhost:5174/
  ➜  Network: http://192.168.100.6:5174/
```

### 3️⃣ Levantar el Backend (Terminal 2)

```bash
cd backend
npm run dev
```

Verás:
```
╔════════════════════════════════════════╗
║   🚀 Multotec Backend en Vivo          ║
║   Puerto: 3000                         ║
║   Ambiente: development                ║
║   URL: http://localhost:3000           ║
╚════════════════════════════════════════╝
✅ Base de datos SQLite conectada
✅ Tablas de base de datos inicializadas
```

### 📋 Comandos Adicionales

```bash
# Build para producción (frontend)
npm run build

# Preview del build
npm run preview

# Ver dependencias instaladas
npm list

# Reinstalar dependencias si hay conflictos
rm -r node_modules
npm install

# Reinstalar backend
cd backend
rm -r node_modules
npm install
cd ..
```

---

## 🧪 Verificación de Funcionamiento

Después de levantar ambos servidores:

1. **Abre en el navegador:** http://localhost:5174
2. **Ve a Proyectos** → Crea un nuevo proyecto
3. **Deberías ver:**
   - Toast verde ✓ "¡Éxito!" (notificación)
   - El proyecto aparece en la tabla
   - Los datos se persisten en la BD

4. **Para verificar el backend:**
   ```bash
   # En otra terminal, prueba la API
   curl http://localhost:3000/api/projects
   ```

---

## 📁 Estructura de Carpetas

```
proyecto-multotec/
├── src/
│   ├── stores/
│   │   ├── projects.js          [Pinia store + Axios]
│   │   ├── resources.js         [Pinia store + Axios]
│   │   ├── notifications.js     [Toast management]
│   │   └── modals.js            [Confirm dialogs]
│   ├── components/
│   │   ├── common/
│   │   │   ├── Toast.vue        [Notificaciones con iconos]
│   │   │   ├── ConfirmDialog.vue [Modal confirmación]
│   │   │   ├── StatusBadge.vue
│   │   │   └── TabsComponent.vue
│   │   └── layout/
│   ├── views/
│   │   ├── Dashboard.vue
│   │   ├── Projects.vue         [CRUD + Modal]
│   │   ├── Resources.vue        [CRUD + Modal]
│   │   ├── Reports.vue
│   │   └── Settings.vue
│   ├── utils/
│   │   └── transform.js         [snake_case ↔ camelCase]
│   ├── App.vue
│   ├── main.js
│   └── style.css
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── projects.js      [GET, POST, PUT, DELETE]
│   │   │   ├── resources.js     [GET, POST, PUT, DELETE]
│   │   │   ├── tasks.js         [GET, POST, PUT, DELETE]
│   │   │   └── risks.js         [GET, POST, PUT, DELETE]
│   │   ├── database/
│   │   │   └── index.js         [SQLite setup + seed]
│   │   └── server.js
│   ├── data/
│   │   └── database.sqlite      [BD SQLite]
│   └── package.json
│
├── .env.local                   [Frontend API base]
├── package.json
├── vite.config.js
└── README.md
```

---

## 🚀 Flujo de Datos

```
Usuario interactúa con Vue Component
         ↓
Click dispara método en vista (ej: saveNewProject)
         ↓
Llama a acción del store Pinia (ej: projectsStore.addProject)
         ↓
Store ejecuta Axios POST a /api/projects
         ↓
Interceptor transforma camelCase → snake_case
         ↓
Backend recibe en /api/projects (Express route)
         ↓
Guarda en SQLite database.sqlite
         ↓
Retorna JSON transformado
         ↓
Interceptor transforma snake_case → camelCase
         ↓
Store actualiza estado reactivo
         ↓
Vue re-renderiza componente
         ↓
Toast notifica "¡Éxito!" ✓
```

---

## 🌐 Acceso Remoto (Opcional)

---

## 🌐 Acceso Remoto (Opcional)

Para compartir con personas fuera de tu red local:

### Opción 1: Ngrok (Rápido)

```bash
# Terminal 3: Exponer frontend
ngrok http 5174

# Terminal 4: Exponer backend (opcional, si necesitas API remota)
ngrok http 3000
```

Compartir la URL que te da ngrok en la Terminal 3.

**Limitaciones del plan gratuito:**
- URL cambia cada vez que reinicies ngrok
- 20 conexiones simultáneas máximo
- Velocidad limitada

### Opción 2: Vercel (Permanente)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy (en carpeta del proyecto)
vercel
```

---

## 📝 Stack Tecnológico

**Frontend:**
- Vue 3 (Composition API)
- Vite (dev server + build)
- Pinia (state management)
- Axios (HTTP client)
- Vue Router (routing)

**Backend:**
- Node.js (v24+)
- Express.js (framework)
- SQLite3 (database)
- CORS (cross-origin)
- Body Parser (middleware)

**Herramientas:**
- npm (package manager)
- ESLint/Prettier (code quality)
- ngrok (tunneling, optional)

---

## 🔐 Variables de Entorno

### Frontend (.env.local)

```env
VITE_API_BASE_URL=/api
VITE_APP_NAME=Multotec Project Management
VITE_APP_VERSION=1.0.0
```

### Backend (.env)

```env
NODE_ENV=development
PORT=3000
DATABASE_PATH=./data/database.sqlite
FRONTEND_URL=http://localhost:5174
```

---

## ⚙️ Configuración Vite

El frontend usa proxy en `vite.config.js`:

```javascript
proxy: {
  '/api': {
    target: 'http://localhost:3000',
    changeOrigin: true,
    rewrite: (path) => path
  }
}
```

Esto permite que las llamadas `/api/*` se redirijan automáticamente al backend.

---

## 🐛 Troubleshooting

### "Puerto 5174/3000 ya está en uso"
```bash
# Encontrar qué proceso usa el puerto
netstat -ano | findstr :5174

# Matar el proceso (Windows)
taskkill /PID <PID> /F
```

### "Los datos no se guardan"
1. Verifica que el backend esté corriendo: `http://localhost:3000/api/projects`
2. Abre DevTools → Red → Verifica que POST devuelva 201
3. Revisa la consola del backend para errores SQL

### "Toast o Modal no aparecen"
1. Verifica que `Toast.vue` y `ConfirmDialog.vue` estén en `App.vue`
2. Comprueba que los stores se importan correctamente
3. Abre DevTools → Consola para ver errores

### "Base de datos no se inicializa"
```bash
# Eliminar BD y recrear
cd backend
rm data/database.sqlite
npm run dev
```

---

## 📚 Documentación Adicional

- `FASE_1_COMPLETADA.md` - Detalles técnicos del frontend
- `LIVE_PREVIEW.md` - Opciones de acceso remoto
- `URL_PUBLICA.md` - URLs públicas
- `COMO_COMPARTIR.md` - Guía para mostrar a otros
- `TROUBLESHOOTING.md` - Solución de problemas

---

## 📊 Desarrollo Actual

**Última actualización:** Noviembre 17, 2025

**Cambios recientes (Fase 2):**
- ✅ Backend Express + SQLite implementado
- ✅ CRUD completo con persistencia en BD
- ✅ Sistema de notificaciones Toast mejorado (iconos + títulos)
- ✅ Modal de confirmación reutilizable
- ✅ Edición de proyectos y recursos con modales
- ✅ Manejo de errores en formularios
- ✅ Validaciones de campos requeridos
- ✅ Transformación automática snake_case ↔ camelCase
- ✅ API endpoints con CORS habilitado

**Próximos (Fase 3):**
- [ ] Tasks CRUD en frontend
- [ ] Risks CRUD en frontend
- [ ] Autenticación JWT
- [ ] Búsqueda y filtros avanzados
- [ ] Gráficos dinámicos (Chart.js)
- [ ] Exportación de datos (CSV, Excel)

---

## 👥 Stack & Equipo

**Multotec Project Management - PMBOK 6ª Edición**

Sistema moderno de gestión de proyectos con:
- Interfaz responsive y moderna
- Backend robusto y escalable
- Base de datos persistente
- Notificaciones en tiempo real
- Experiencia de usuario mejorada

---

**¡Tu aplicación está lista para producción! 🚀**

### Quickstart:

```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
cd backend && npm run dev

# Abre en el navegador
http://localhost:5174
```

---

*Desarrollado con Vue 3, Node.js y SQLite*
