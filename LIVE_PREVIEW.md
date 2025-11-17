# Live Preview - Acceso Remoto

## Opción 1: Acceso en tu Red Local (Recomendado para ahora)

El servidor Vite está configurado para escuchar en `0.0.0.0:5173`, lo que significa que es accesible desde cualquier dispositivo en tu red local.

### Para acceder desde otro dispositivo en tu red:

1. En tu computadora, obtén tu dirección IP local:
   ```powershell
   ipconfig
   # Busca "IPv4 Address" bajo tu adaptador de red activo
   ```

2. Desde otro dispositivo en la misma red, accede a:
   ```
   http://<TU_IP_LOCAL>:5173
   ```

   Ejemplo:
   ```
   http://192.168.100.6:5173
   ```

---

## Opción 2: Acceso desde Internet (Ngrok)

Para compartir desde fuera de tu red, necesitas:

### A. Instalar Ngrok

1. Descargar desde: https://ngrok.com/download
2. Extraer y agregar a tu PATH, o ejecutar desde la carpeta del archivo

### B. Configurar Ngrok (una sola vez)

1. Crear cuenta gratuita en https://ngrok.com
2. Obtener tu authtoken desde tu dashboard
3. En PowerShell:
   ```powershell
   ngrok config add-authtoken <TU_TOKEN>
   ```

### C. Ejecutar Ngrok

Abre una **nueva terminal** (sin detener Vite) y ejecuta:

```powershell
ngrok http 5173
```

Verás un output como:
```
Forwarding   https://xxxx-xx-xxx-xx-xx.ngrok.io -> http://localhost:5173
```

Comparte esa URL (https://xxxx-xx-xxx-xx-xx.ngrok.io) con quien quiera ver tu proyecto.

---

## Opción 3: Alternativa a Ngrok (Localtunnel)

Si no quieres registrarse en Ngrok:

```powershell
npm install -g localtunnel
lt --port 5173 --subdomain mi-proyecto
```

Accesible en: `https://mi-proyecto.loca.lt`

---

## Status Actual

- ✅ Servidor Vite corriendo en: `http://localhost:5173`
- ✅ Accesible en red local: `http://192.168.100.6:5173`
- ✅ Ngrok activo: https://nonfactually-heathy-jaqueline.ngrok-free.dev
- ⚠️ **IMPORTANTE**: Ambas terminales (Vite + Ngrok) deben estar abiertas

---

## Si No Funciona

Ver: `TROUBLESHOOTING.md` para diagnóstico y soluciones

---

## Próximos Pasos

1. Verifica que todo funciona correctamente visitando el servidor
2. Cuando el backend esté listo, actualiza `VITE_API_BASE_URL` en `.env.local`
3. Considera usar Ngrok si necesitas compartir con alguien fuera de tu red
