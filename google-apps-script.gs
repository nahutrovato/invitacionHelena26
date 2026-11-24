/**
 * Script de la planilla del bautismo y cumple de Helena.
 * Se pega en: Planilla → Extensiones → Apps Script. Ver INSTRUCCIONES.md.
 *
 * - POST desde la invitación: guarda una confirmación en la hoja "Confirmaciones".
 * - POST con tipo "mensaje" desde la web de fotos: guarda un mensaje en la hoja "Mensajes".
 * - GET ?accion=mensajes: devuelve los mensajes de las dos hojas (solo nombre, mensaje y fecha).
 *
 * Para ocultar un mensaje, escribí algo (ej: "x") en la columna "Ocultar" de esa fila.
 */
var HOJA = "Confirmaciones";
var COLUMNAS = ["Fecha", "Nombre", "Cantidad", "Asiste a", "Mensaje para Helena", "Ocultar"];
var HOJA_MSJ = "Mensajes";
var COLUMNAS_MSJ = ["Fecha", "Nombre", "Mensaje", "Ocultar"];
var CACHE_KEY = "mensajes-v1";

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var d = JSON.parse(e.postData.contents || "{}");

    // Trampa para robots: si viene completo, se ignora sin avisar.
    if (d.web) return responder({ ok: true });

    var nombre = limpiar(d.nombre, 80);
    var mensaje = limpiar(d.mensaje, 500);

    if (d.tipo === "mensaje") {
      if (nombre.length < 2 || mensaje.length < 2) return responder({ ok: false, error: "datos" });
      obtenerHoja(HOJA_MSJ, COLUMNAS_MSJ).appendRow([new Date(), nombre, mensaje]);
    } else {
      var cantidad = Math.max(0, Math.min(15, parseInt(d.cantidad, 10) || 0));
      var evento = ["Ambos", "Bautismo", "Festejo", "No asiste"].indexOf(d.evento) >= 0 ? d.evento : "";
      if (nombre.length < 3 || !evento) return responder({ ok: false, error: "datos" });
      obtenerHoja(HOJA, COLUMNAS).appendRow([new Date(), nombre, cantidad, evento, mensaje]);
    }
    CacheService.getScriptCache().remove(CACHE_KEY); // así el mensaje nuevo aparece enseguida
    return responder({ ok: true });
  } catch (err) {
    return responder({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  if (e && e.parameter && e.parameter.accion === "mensajes") {
    // Cache de 10 segundos: la web de fotos consulta seguido y así responde más rápido.
    var cache = CacheService.getScriptCache();
    var guardado = cache.get(CACHE_KEY);
    if (guardado) return ContentService.createTextOutput(guardado).setMimeType(ContentService.MimeType.JSON);

    var mensajes = leerMensajes(HOJA, COLUMNAS, 1, 4, 5)
      .concat(leerMensajes(HOJA_MSJ, COLUMNAS_MSJ, 1, 2, 3))
      .sort(function (a, b) { return b.t - a.t; }) // los más nuevos primero
      .map(function (m) { return { nombre: m.nombre, mensaje: m.mensaje, fecha: m.fecha }; });

    var json = JSON.stringify({ ok: true, mensajes: mensajes });
    try { cache.put(CACHE_KEY, json, 10); } catch (err) { /* muy grande para la cache: no pasa nada */ }
    return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
  }
  return responder({ ok: true, info: "Planilla del bautismo y cumple de Helena" });
}

// Lee nombre y mensaje de una hoja (índices de columna desde 0), salteando vacíos y ocultos.
function leerMensajes(nombreHoja, columnas, iNombre, iMensaje, iOcultar) {
  var hoja = obtenerHoja(nombreHoja, columnas);
  if (hoja.getLastRow() < 2) return [];
  var filas = hoja.getRange(2, 1, hoja.getLastRow() - 1, columnas.length).getValues();
  return filas
    .filter(function (f) { return String(f[iMensaje]).trim() && !String(f[iOcultar]).trim(); })
    .map(function (f) {
      var fecha = f[0] instanceof Date ? f[0] : null;
      return {
        nombre: String(f[iNombre]).replace(/^'/, ""),
        mensaje: String(f[iMensaje]).replace(/^'/, ""),
        fecha: fecha ? fecha.toISOString() : "",
        t: fecha ? fecha.getTime() : 0,
      };
    });
}

function obtenerHoja(nombre, columnas) {
  var libro = SpreadsheetApp.getActiveSpreadsheet();
  var hoja = libro.getSheetByName(nombre);
  if (!hoja) {
    hoja = libro.insertSheet(nombre);
    hoja.appendRow(columnas);
    hoja.setFrozenRows(1);
    hoja.getRange(1, 1, 1, columnas.length).setFontWeight("bold").setBackground("#f7e3e8");
    hoja.setColumnWidth(2, 220);
    hoja.setColumnWidth(columnas.indexOf("Ocultar"), 360); // la columna del mensaje (antes de "Ocultar")
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
