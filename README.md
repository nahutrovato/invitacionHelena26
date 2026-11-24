# Bautismo y cumple de Helena · 19-12-2026

Sistema de webs para un evento familiar, gratis y sin servidor. Sirve de base para próximos eventos.

| Pieza | Dónde | Para qué |
|---|---|---|
| Invitación | este repo → https://nahutrovato.github.io/invitacionHelena26/ | Datos del día, mapas, agendar y confirmación de asistencia |
| Web de fotos | repo `cumple_helena26` → https://nahutrovato.github.io/cumple_helena26/ | Subir/ver fotos (Cloudinary) y pared de mensajes |
| Planilla de Google | Google Drive del dueño | Guarda confirmaciones y mensajes |
| Script de la planilla | `google-apps-script.gs` (pegado en Extensiones → Apps Script) | Puente entre las webs y la planilla |

## Cómo funciona
- **Invitación** (`index.html`, `style.css`, `app.js`): todo el contenido sale de `config.js` (fechas, lugares con GPS, nombres, regalos, URL del script). Con `borrador: true` muestra una franja de borrador; sin `sheetUrl` el formulario funciona en modo demo.
- **Confirmación**: el modal envía `POST` (con `Content-Type: text/plain` para evitar el preflight) al script, que agrega una fila en la hoja **Confirmaciones**.
- **Mensajes**: la web de fotos lee `GET …/exec?accion=mensajes` cada 15 s. Junta los mensajes de **Confirmaciones** y de **Mensajes** (lo que dejan con el botón "Dejar un mensaje"). Solo expone nombre y mensaje. Para ocultar uno: escribir algo en su columna **Ocultar**.
- **Fotos**: Cloudinary con *upload preset* sin firma; la clave de invitados se guarda como hash SHA-256 en `config.js` de la web de fotos y viaja en el QR después del `#`.

## Para un evento nuevo
1. Crear repos nuevos copiando estos y activar GitHub Pages (Settings → Pages → main / root).
2. Cambiar `config.js` de cada web (textos, fechas, GPS de OpenStreetMap/Google Maps, `fotosUrl`).
3. Crear una planilla nueva, pegar `google-apps-script.gs`, implementar como **Aplicación web** (Ejecutar como: Yo · Acceso: Cualquier usuario) y poner la URL `/exec` en `sheetUrl` (invitación) y `mensajesUrl` (fotos, con `?accion=mensajes`).
4. Al modificar el script: **Implementar → Administrar implementaciones → ✏️ → Nueva versión**, así la URL no cambia. Si se crea una implementación nueva, actualizar la URL en ambos `config.js`.

Ver también `INSTRUCCIONES.md`.
