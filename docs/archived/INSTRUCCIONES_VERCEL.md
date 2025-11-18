# 📱 INSTRUCCIONES PASO A PASO PARA VERCEL

## ✅ LO QUE YA ESTÁ HECHO

```
✓ Frontend con Tasks/Risks CRUD
✓ Mock data configurado para producción
✓ Build sin errores (186.65 kB)
✓ Vercel.json creado
✓ Variables de entorno documentadas
```

---

## 🎯 OPCIÓN 1: DEPLOY AUTOMÁTICO (Recomendado - 2 clicks)

### Paso 1: Commit y Push a GitHub

```bash
cd e:\proyectos\proyecto-multotec

git add .
git commit -m "feat: Add Tasks/Risks CRUD with mock data for production"
git push origin main
```

**Resultado esperado:**
```
[main xxxxxxx] feat: Add Tasks/Risks CRUD with mock data for production
 9 files changed, 2000+ insertions(+)
 create mode 100644  src/stores/mockData.js
 create mode 100644  src/stores/tasks.js
 create mode 100644  src/stores/risks.js
 create mode 100644  src/views/Tasks.vue
 create mode 100644  src/views/Risks.vue
 create mode 100644  VERCEL_DEPLOYMENT_GUIDE.md
 create mode 100644  VERCEL_QUICK_DEPLOY.md
```

### Paso 2: Vercel Deploy Automático

1. Ve a: https://vercel.com/dashboard
2. Selecciona proyecto: `proyecto-multotec`
3. **Vercel detectará el push automáticamente**
4. Espera 2-3 minutos mientras compila
5. ¡Listo! Nueva versión en https://proyecto-multotec.vercel.app/

**Verificar que esté funcionando:**
- Abre https://proyecto-multotec.vercel.app/tasks
- Deberías ver 4 tareas de mock
- Haz clic en "Tareas" → nueva tarjeta debe crear tarea
- Abre DevTools (F12) → Console → sin errores CORS

---

## 🎯 OPCIÓN 2: DEPLOY MANUAL CON VERCEL CLI

### Paso 1: Instalar Vercel CLI (si no lo hiciste)

```bash
npm install -g vercel
```

### Paso 2: Login a Vercel

```bash
vercel login
# Abre el link que aparece, autoriza, vuelve a terminal
```

### Paso 3: Deploy

```bash
cd e:\proyectos\proyecto-multotec
vercel deploy --prod
```

**Resultado esperado:**
```
✓ Confirmed project name
✓ Connected to tu-cuenta/proyecto-multotec
✓ Analyzed 186.65 kB
✓ Deploy completed to proyecto-multotec.vercel.app [in 12s]

Production: https://proyecto-multotec.vercel.app [v1.2.3]
```

---

## 🎯 OPCIÓN 3: DEPLOY CON VERCEL UI (Sin CLI)

### Paso 1: Github Integration

Si no configuraste:
1. Ve a https://vercel.com/new
2. "Import Git Repository"
3. Conecta tu GitHub
4. Selecciona `proyecto-multotec`
5. Click "Deploy"

**Resultado:**
- Cada push a `main` deployará automáticamente
- Vercel crea una URL de preview para cada rama

---

## 🔄 MIGRACIÓN A BACKEND EN VERCEL (Próximo: Esta Semana)

Una vez que hayas deployado frontend, sigue estos pasos para backend:

### Paso 1: Crear proyecto backend en Vercel

```bash
cd backend
vercel deploy --prod
```

Esto te dará una URL como: `https://proyecto-multotec-backend.vercel.app`

### Paso 2: Actualizar variables de entorno

En Vercel Dashboard → Settings → Environment Variables:

```
VITE_API_BASE_URL=https://proyecto-multotec-backend.vercel.app/api
```

### Paso 3: Deploy frontend actualizado

```bash
# Vuelve a frontend
cd ..

# Commit
git add .
git commit -m "chore: Update backend API URL"
git push origin main

# Vercel deployará automáticamente
```

---

## 📊 VERIFICAR QUE TODO FUNCIONA

Después de cada deploy, verifica:

```bash
# 1. ¿Frontend carga?
# https://proyecto-multotec.vercel.app
# ✓ Dashboard debe mostrar datos

# 2. ¿Mock data funciona?
# https://proyecto-multotec.vercel.app/tasks
# ✓ Debe mostrar 4 tareas

# 3. ¿Puedes crear recursos?
# https://proyecto-multotec.vercel.app/resources
# ✓ Click "+ Nuevo Recurso"

# 4. ¿Console limpio?
# F12 → Console
# ✓ Cero errores en rojo
```

---

## ⚠️ TROUBLESHOOTING

### Problema: "Cannot find module 'mockData.js'"

**Solución:**
```bash
# Verifica que mockData.js esté en stores
ls src/stores/

# Si falta:
git add src/stores/mockData.js
git commit -m "fix: Add missing mockData"
git push origin main
```

### Problema: "Module not found: Tasks.vue"

**Solución:**
```bash
# Verifica que exista
ls src/views/Tasks.vue
ls src/views/Risks.vue

# Si falta, añade a router:
# src/router/index.js debe importarlos
```

### Problema: "Vercel sigue mostrando versión vieja"

**Solución:**
```bash
# Fuerza rebuild
vercel redeploy

# O en Vercel Dashboard:
# Settings → Deployments → Redeploy Latest
```

### Problema: "404 en /tasks"

**Solución:**
1. Verifica que `/tasks` esté en router
2. Verifica que Task.vue esté en Header.vue nav
3. Recarga con Ctrl+Shift+R (fuerza refresh)

---

## 📈 QUÉ ESPERAR DESPUÉS

1. **Hoy:** Frontend con mock data en Vercel ✓
2. **Mañana:** Backend deployado en Vercel
3. **Esta semana:** Postgres en Vercel integrado
4. **Próxima semana:** Datos persistentes en producción
5. **Cuando cliente:** Migración modelo BD sin downtime

---

## 🎯 RESUMEN FINAL

| Paso | Comando | Tiempo |
|------|---------|--------|
| 1. Commit | `git add . && git commit -m "..."` | 1 min |
| 2. Push | `git push origin main` | 30 seg |
| 3. Deploy | Automático en Vercel | 2-3 min |
| **Total** | | **~5 min** |

**¡Eso es todo! Tu aplicación estará en producción**

---

## 📞 SOPORTE RÁPIDO

Problemas comunes y soluciones:

- **"Module not found"** → Revisa que archivo esté en git
- **"404 /tasks"** → Verifica router.js imports
- **"Vercel outdated"** → Clear cache del navegador
- **"CORS error"** → Backend no deployado aún (usar mock data por ahora)

---

## 🔗 PRÓXIMAS FUNCIONES

Una vez deployado, puedes agregar:

- [ ] Autenticación con JWT
- [ ] Gráficos en Dashboard con Chart.js
- [ ] Búsqueda y filtros avanzados
- [ ] Exportar datos a PDF/Excel
- [ ] Notificaciones en tiempo real

Cada feature funciona igual: código local → push → Vercel automático

