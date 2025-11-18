# 🚀 DEPLOYMENT RÁPIDO A VERCEL

## Implementación completada:
✅ Tasks CRUD (Vista + Store)
✅ Risks CRUD (Vista + Store)
✅ Mock data para producción
✅ Rutas actualizadas
✅ Build sin errores

---

## 3 COMANDOS PARA VERCEL

### 1️⃣ OPCIÓN A: Deploy Frontend AUTOMÁTICO (Recomendado)

Si tu proyecto está en GitHub y Vercel está conectado:

```bash
git add .
git commit -m "feat: Add Tasks/Risks CRUD with mock data"
git push origin main
```

**Vercel deployará automáticamente en 2-3 minutos**

---

### 2️⃣ OPCIÓN B: Deploy Manual con Vercel CLI

```bash
npm install -g vercel

# Desde raíz del proyecto
vercel deploy --prod
```

---

### 3️⃣ OPCIÓN C: Deploy Backend + Frontend (Cuando decidas migrar)

**Backend:**
```bash
cd backend
vercel deploy --prod
```

**Frontend:**
```bash
# Actualiza .env.production
VITE_API_BASE_URL=https://[tu-backend-url].vercel.app/api

# Deploy
vercel deploy --prod
```

---

## 📍 Verificar Status

1. Ve a: https://proyecto-multotec.vercel.app
2. Haz clic en "Tareas" o "Riesgos" en el menú
3. Deberías ver datos de mock funcionando

---

## 🔄 Próximos Pasos (En orden)

1. **YA:** Hacer commit y push a GitHub
2. **INMEDIATO:** Vercel deploy automático (espera 2-3 min)
3. **ESTA SEMANA:** Deploy Backend en Vercel + Postgres
4. **MIENTRAS:** Agregar gráficos en Dashboard
5. **CUANDO CLIENTE:** Actualizar modelo BD

---

## ℹ️ Detalles Técnicos

- Mock data se activa automáticamente en `import.meta.env.PROD`
- Fallback automático si backend no responde
- Cero cambios necesarios en frontend (compatibility 100%)
- Datos persistirán cuando agregues Postgres

---

## 📖 Documentación Completa

Para guía detallada de todos los pasos:
→ Lee `VERCEL_DEPLOYMENT_GUIDE.md`

