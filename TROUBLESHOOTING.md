# 🔧 Troubleshooting - Si la Página No Carga

## ❌ Error: "No se puede acceder a ngrok"

### Causa Más Común
El servidor Vite se detuvieron accidentalmente.

### ✅ Solución

Abre **PowerShell** y ejecuta:

```powershell
cd e:\proyectos\proyecto-multotec
npm run dev
```

Deberías ver:
```
VITE v7.2.2  ready in 275 ms

➜  Local:   http://localhost:5173/
➜  Network: http://192.168.100.6:5173/
```

---

## 📋 Checklist de Verificación

### 1️⃣ ¿El servidor Vite está corriendo?

Verifica que veas en una terminal:
```
➜  Local:   http://localhost:5173/
```

Si NO lo ves, ejecuta:
```powershell
npm run dev
```

### 2️⃣ ¿Ngrok está corriendo?

Deberías tener otra terminal con:
```
Forwarding   https://nonfactually-heathy-jaqueline.ngrok-free.dev -> http://localhost:5173
```

Si NO lo ves, ejecuta en otra terminal:
```powershell
ngrok http 5173
```

### 3️⃣ Prueba Local Primero

Antes de intentar la URL de ngrok, prueba en tu PC:
- http://localhost:5173/

¿Funciona? Entonces el problema es ngrok.
¿No funciona? Entonces el problema es Vite.

### 4️⃣ Prueba en tu Red Local

Si local funciona, intenta desde tu celular en WiFi:
- http://192.168.100.6:5173/

¿Funciona? El firewall de ngrok puede ser el problema.

### 5️⃣ Acceso Remoto (ngrok)

Intenta la URL de ngrok:
- https://nonfactually-heathy-jaqueline.ngrok-free.dev

Si alguno de los anteriores funciona pero ngrok no, es un problema de ngrok.

---

## 🚀 Soluciones Rápidas

### Si Nada Funciona

```powershell
# 1. Detener todo
Get-Process node | Stop-Process -Force

# 2. Limpiar node_modules (si hay error de dependencias)
Remove-Item node_modules -Recurse
npm install

# 3. Reiniciar Vite
cd e:\proyectos\proyecto-multotec
npm run dev
```

### Si Solo Ngrok Falla

```powershell
# En nueva terminal
ngrok http 5173 --pooling-enabled
```

---

## 📊 Diagnóstico Rápido

| Prueba | URL | Resultado Esperado |
|--------|-----|-------------------|
| **Local** | http://localhost:5173 | ✅ Debe funcionar |
| **Red Local** | http://192.168.100.6:5173 | ✅ Debe funcionar (desde otro dispositivo) |
| **Ngrok** | https://nonfactually-heathy-jaqueline.ngrok-free.dev | ✅ Debe funcionar |

Si falla alguna, ve la solución correspondiente arriba.

---

## 🔍 Debug: Ver Logs

### Ver logs de Vite
La terminal donde corre `npm run dev` muestra todos los logs.

### Ver logs de Ngrok
La terminal donde corre `ngrok http 5173` muestra todas las conexiones.

### Ver si hay errores JavaScript
Abre DevTools en el navegador:
- Presiona: `F12`
- Ve a: "Console"
- ¿Hay errores rojos? Reporta el error

---

## 📞 Resumen

**Si la página no carga:**

1. Abre PowerShell
2. Ve a la carpeta: `cd e:\proyectos\proyecto-multotec`
3. Ejecuta: `npm run dev`
4. Espera a que diga "ready"
5. Intenta acceder de nuevo

**¿Sigue sin funcionar?**
- Prueba: `http://localhost:5173/` (local)
- Verifica en otra terminal que ngrok esté corriendo
- Si ngrok no inicia, ejecuta en nueva terminal: `ngrok http 5173`

---

## 💡 Prevención Futura

Para no detener Vite accidentalmente:

**Opción 1: Minimizar en lugar de cerrar**
- Minimiza la terminal de Vite
- NO la cierres

**Opción 2: Usar dos ventanas**
- Terminal 1: Vite (siempre abierta)
- Terminal 2: Cambios/Ngrok
- Nunca cierres Terminal 1

**Opción 3: PM2 (Avanzado)**
Si quieres que se reinicie automáticamente:
```powershell
npm install -g pm2
pm2 start "npm run dev"
pm2 save
```

---

**¡Ahora debería funcionar! 🚀**
