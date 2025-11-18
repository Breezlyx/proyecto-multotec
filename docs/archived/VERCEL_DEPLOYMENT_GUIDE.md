# 📋 Guía de Deployment en Vercel

## Fase Actual: Híbrida con Mock Data en Producción

Tu aplicación ahora funciona con:
- ✅ **Frontend:** Deployado en Vercel (sin cambios necesarios)
- ✅ **Mock Data:** Para producción (cliente ve UI completa)
- ⏳ **Backend:** Listo para deploying en Vercel (próximo paso)

---

## 🚀 PASO 1: Verificar que Frontend esté funcionando

```bash
# En tu máquina local, verifica que todo compile sin errores
npm run build

# Debería generar carpeta 'dist' sin problemas
```

---

## 🚀 PASO 2: Push a GitHub (si no lo hiciste)

```bash
cd e:\proyectos\proyecto-multotec

git add .
git commit -m "feat: Add Tasks/Risks CRUD and mock data for production"
git push origin main
```

---

## 🚀 PASO 3: Volver a Deployar Frontend en Vercel (AUTOMÁTICO)

### Si usaste Vercel CLI antes:
```bash
vercel deploy --prod
```

### Si usaste Git integration:
- El deploy es **automático** al hacer push a `main`
- Solo espera a que Vercel compile y publique
- Verifica en: https://proyecto-multotec.vercel.app/

---

## 🚀 PASO 4: Preparar Backend para Vercel

### 4.1. Crear `backend/vercel.json`:

```bash
cd backend
```

Crea el archivo `backend/vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### 4.2. Actualizar `backend/package.json`:

Asegúrate que tenga estas propiedades:

```json
{
  "name": "proyecto-multotec-backend",
  "version": "1.0.0",
  "type": "module",
  "main": "src/server.js",
  "scripts": {
    "dev": "node src/server.js",
    "start": "node src/server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "sqlite3": "^5.1.6",
    "cors": "^2.8.5",
    "axios": "^1.4.0"
  }
}
```

### 4.3. Verificar que Backend use variables de entorno:

En `backend/src/server.js`, actualiza el puerto:

```javascript
const PORT = process.env.PORT || 3000;
```

---

## 🚀 PASO 5: Crear Base de Datos en Vercel

### Opción A: Vercel Postgres (Recomendado)

1. Ve a https://vercel.com/dashboard
2. Abre tu proyecto
3. **Settings** → **Storage** → **Create Database**
4. Selecciona **Postgres**
5. Copia las variables de entorno que te proporciona

### Opción B: Usar SQLite en archivo (Temporal)

Actualmente está funcionando con SQLite local. En producción, Vercel lo eliminará cada deploy, así que:

**Usa Postgres para datos persistentes** (Opción A recomendada)

---

## 🚀 PASO 6: Deploy Backend en Vercel

### 6.1. Conectar Backend como segundo Proyecto:

```bash
# En terminal, desde la carpeta backend
cd backend

# Si no tienes Vercel CLI instalado:
npm install -g vercel

# Deploy
vercel --prod
```

O en GitHub:

1. Ve a https://vercel.com/new
2. Importa tu repositorio
3. En "Root Directory", selecciona `./backend`
4. Deploy

### 6.2. Configura Variables de Entorno en Vercel:

En Vercel Dashboard → Settings → Environment Variables:

```
VITE_API_BASE_URL=https://tu-backend.vercel.app/api
DATABASE_URL=tu_postgres_url_de_paso_5
NODE_ENV=production
```

---

## 🚀 PASO 7: Actualizar Frontend con URL del Backend

En `src/stores/projects.js` (y otros stores):

```javascript
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://tu-backend.vercel.app/api'
```

También actualiza `.env` o `.env.production`:

```
VITE_API_BASE_URL=https://tu-backend.vercel.app/api
```

---

## 📊 PASO 8: Migración de Datos (Cuando Cliente defina Modelo)

Cuando el cliente defina el modelo de BD:

```bash
# 1. Actualiza schema en backend/src/database/schema.js
# 2. Ejecuta migration
# 3. Deploy backend actualizado

vercel deploy --prod
```

---

## ✅ Checklist Final

- [ ] Frontend compilado sin errores (`npm run build`)
- [ ] Backend compila en local (`cd backend && npm run dev`)
- [ ] `backend/vercel.json` creado
- [ ] `backend/package.json` tiene scripts correctos
- [ ] Variables de entorno configuradas en Vercel
- [ ] URL del backend actualizada en frontend
- [ ] Tests básicos en local funcionan

---

## 🔗 URLs Finales

- **Frontend:** https://proyecto-multotec.vercel.app
- **Backend API:** https://tu-backend.vercel.app/api
  - GET /api/projects
  - POST /api/projects
  - GET /api/resources
  - etc.

---

## 📞 Troubleshooting

### "500 Backend no responde"
→ Verifica variables de entorno en Vercel Dashboard

### "CORS error"
→ Verifica que backend tenga `cors: true` en Vite config

### "Base de datos vacía en prod"
→ SQLite no persiste. Usa Postgres (Paso 5, Opción A)

### "Mock data no aparece"
→ Verifica que `import.meta.env.PROD` sea true en build
→ Revisa console del navegador (F12)

---

## 🎯 Próximos Pasos (Orden recomendado)

1. ✅ Implementar Tasks/Risks CRUD (YA HECHO)
2. ✅ Mock data en producción (YA HECHO)
3. → **Deploy Backend a Vercel** (Este documento)
4. → Agregar Postgres
5. → Autenticación JWT (cuando cliente lo defina)
6. → Gráficos dinámicos con Chart.js
7. → Búsqueda y filtros avanzados

---

## 💡 Notas

- El build actual usa mock data cuando `import.meta.env.PROD` es true
- Todos los datos de mock se resetean al recargar página (hasta que uses Postgres)
- Backend local sigue funcionando si ejecutas `npm run dev` local
- Puedes tener ambos corriendo: local para desarrollo, Vercel para producción
