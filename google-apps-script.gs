/**
 * Recibe las confirmaciones de la web del bautismo y las agrega a esta planilla.
 * Se pega en: Planilla → Extensiones → Apps Script. Ver INSTRUCCIONES.md.
 */
var HOJA = "Confirmaciones";
var COLUMNAS = ["Fecha", "Nombre", "Cantidad", "Asiste a", "Mensaje para Helena"];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var d = JSON.parse(e.postData.contents || "{}");

    // Trampa para robots: si viene completo, se ignora sin avisar.
    if (d.web) return responder({ ok: true });

    var nombre = limpiar(d.nombre, 80);
    var cantidad = Math.max(0, Math.min(15, parseInt(d.cantidad, 10) || 0));
    var evento = ["Ambos", "Bautismo", "Festejo", "No asiste"].indexOf(d.evento) >= 0 ? d.evento : "";
    var mensaje = limpiar(d.mensaje, 500);
    if (nombre.length < 3 || !evento) return responder({ ok: false, error: "datos" });

    var hoja = obtenerHoja();
    hoja.appendRow([new Date(), nombre, cantidad, evento, mensaje]);
    return responder({ ok: true });
  } catch (err) {
    return responder({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return responder({ ok: true, info: "Confirmaciones del bautismo de Helena" });
}

function obtenerHoja() {
  var libro = SpreadsheetApp.getActiveSpreadsheet();
  var hoja = libro.getSheetByName(HOJA);
  if (!hoja) {
    hoja = libro.insertSheet(HOJA);
    hoja.appendRow(COLUMNAS);
    hoja.setFrozenRows(1);
    hoja.getRange(1, 1, 1, COLUMNAS.length).setFontWeight("bold").setBackground("#f7e3e8");
    hoja.setColumnWidth(2, 220);
    hoja.setColumnWidth(5, 360);
  }
  return hoja;
}

// Evita que un texto empiece con "=" y se interprete como fórmula.
function limpiar(v, max) {
  var s = String(v == null ? "" : v).trim().slice(0, max);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function responder(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
