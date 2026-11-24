# Web del bautismo de Helena

## Cambiar datos
Todo el contenido está en `config.js`: fecha, horarios, lugares, nombres, regalos, etc.
Lo marcado **A CONFIRMAR** todavía es de ejemplo. Al publicar, poner `borrador: false`.

## Planilla de confirmaciones (una sola vez, ~10 minutos)

1. Entrá a https://sheets.new con tu cuenta de Google. Ponele de nombre "Confirmaciones bautismo Helena".
2. Menú **Extensiones → Apps Script**.
3. Borrá lo que aparece y pegá todo el contenido de `google-apps-script.gs`. Guardá (ícono del disquete).
4. Arriba a la derecha: **Implementar → Nueva implementación**.
   - Tipo (engranaje): **Aplicación web**.
   - Ejecutar como: **Yo**.
   - Quién tiene acceso: **Cualquier usuario**. Esto permite que la web *agregue* filas; nadie puede *leer* la planilla.
   - **Implementar**. Google pide autorizar: elegí tu cuenta → "Configuración avanzada" → "Ir a … (no seguro)" → Permitir. El aviso aparece porque el script es tuyo y no está verificado por Google.
5. Copiá la **URL de la aplicación web** (termina en `/exec`) y pegala en `config.js`, en `sheetUrl`.

Las respuestas aparecen en la pestaña **Confirmaciones** de la planilla. Para compartirla con tu señora: botón Compartir de la planilla. Para bajarla en Excel: Archivo → Descargar → .xlsx.

Si después cambiás el script, hay que hacer **Implementar → Administrar implementaciones → Editar → Nueva versión**, así la URL sigue siendo la misma.
