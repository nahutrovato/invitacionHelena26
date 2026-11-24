(function () {
  "use strict";

  var C = window.CONFIG;
  var TZ = "-03:00"; // hora de Argentina (sin horario de verano)
  var STORE_KEY = "bautismo-helena-rsvp";
  var $ = function (id) { return document.getElementById(id); };

  // ---------- Íconos (trazo dorado) ----------
  var ICONS = {
    iglesia: '<path d="M12 2v4M10 4h4M6 21V11l6-5 6 5v10M3 21h18M10 21v-4a2 2 0 0 1 4 0v4"/><circle cx="12" cy="11.5" r="1.3"/>',
    globos: '<ellipse cx="9" cy="8" rx="4" ry="5"/><ellipse cx="16" cy="9.5" rx="3.2" ry="4"/><path d="M9 13l-.6 1.2h1.2zM16 13.5l-.5 1h1M9 14.2c0 2.5 2 3.5 2 6.8M16 14.5c0 2-2 3-3 6.5"/>',
    taza: '<path d="M4 9h12v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM16 10.5h1.5a2.5 2.5 0 0 1 0 5H15.5M3 21h15M8 3.5c-.8 1 .8 2 0 3M12 3.5c-.8 1 .8 2 0 3"/>',
    torta: '<path d="M4 21v-7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v7M3 21h18M4 16.5c1.3 1 2.7 1 4 0s2.7-1 4 0 2.7 1 4 0 2.7-1 4 0M8 12V9M12 12V9M16 12V9"/><path d="M8 6.5c.6-.6.6-1.4 0-2-.6.6-.6 1.4 0 2zM12 6.5c.6-.6.6-1.4 0-2-.6.6-.6 1.4 0 2zM16 6.5c.6-.6.6-1.4 0-2-.6.6-.6 1.4 0 2z"/>',
    musica: '<path d="M9 18V5l11-2v13"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/>',
    estrella: '<path d="m12 3 2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.4 6.7 19.4l1.2-6L3.4 9.3l6-.7z"/>',
  };
  function icon(name) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      (ICONS[name] || ICONS.estrella) + "</svg>";
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function toDate(local) { return new Date(local + ":00" + TZ); }
  var fmtFecha = new Intl.DateTimeFormat("es-AR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "America/Argentina/Buenos_Aires",
  });
  var fmtCorta = new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "long", timeZone: "America/Argentina/Buenos_Aires" });
  function hora(local) { return local.slice(11, 16); }

  // ---------- Textos simples ----------
  document.querySelectorAll("[data-f]").forEach(function (el) {
    var v = C[el.getAttribute("data-f")];
    if (v) el.textContent = v;
  });
  if (C.borrador) $("draft").hidden = false;

  var primero = C.eventos[0];
  // "sábado, 19 de diciembre de 2026" → "Sábado 19 de diciembre" + salto + "2026"
  var f = fmtFecha.format(toDate(primero.inicio)).replace(",", "").replace(/ de (\d{4})$/, "\n$1");
  $("cover-date").innerText = f.charAt(0).toUpperCase() + f.slice(1);

  function lista(id, arr) {
    $(id).innerHTML = (arr || []).map(function (n) { return "<li>" + esc(n) + "</li>"; }).join("");
  }
  lista("padres", C.padres);
  lista("padrinos", C.padrinos);

  // ---------- Eventos ----------
  // Con GPS: el celular abre Google Maps (o Waze) con la navegación lista hasta el lugar.
  function destino(ev) {
    return ev.gps ? ev.gps.join(",") : ev.lugar + ", " + ev.direccion;
  }
  function comoLlegarUrl(ev) {
    return "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(destino(ev));
  }
  function wazeUrl(ev) {
    return ev.gps
      ? "https://waze.com/ul?ll=" + ev.gps.join(",") + "&navigate=yes"
      : "https://waze.com/ul?q=" + encodeURIComponent(destino(ev)) + "&navigate=yes";
  }
  function mapaEmbed(ev) {
    return "https://maps.google.com/maps?q=" + encodeURIComponent(destino(ev)) + "&z=16&output=embed";
  }
  function rango(ev) {
    var a = hora(ev.inicio), b = ev.fin ? hora(ev.fin) : "";
    return b ? a + " a " + b + " hs" : a + " hs";
  }
  $("eventos").innerHTML = C.eventos.map(function (ev, i) {
    return '<article class="event">' +
      '<div class="icon">' + icon(ev.icono) + "</div>" +
      '<p class="when-label">' + esc(ev.momento) + "</p>" +
      "<h3>" + esc(ev.titulo) + "</h3>" +
      '<p class="hour">' + rango(ev) + "</p>" +
      '<p class="place">' + esc(ev.lugar) + "</p>" +
      '<p class="addr">' + esc(ev.direccion) + "</p>" +
      '<div class="map"><iframe src="' + esc(mapaEmbed(ev)) + '" title="Mapa: ' + esc(ev.lugar) +
      '" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>' +
      '<div class="actions">' +
      '<a class="btn btn-small" href="' + esc(comoLlegarUrl(ev)) + '" target="_blank" rel="noopener">' +
      '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>' +
      "Cómo llegar</a>" +
      '<a class="btn btn-soft btn-small" href="' + esc(wazeUrl(ev)) + '" target="_blank" rel="noopener">Waze</a>' +
      '<button class="btn btn-soft btn-small" type="button" data-cal="' + i + '">Agendar</button>' +
      "</div></article>";
  }).join("");

  // ---------- Agendar (Google Calendar o archivo .ics en iPhone) ----------
  function utcStamp(local) {
    return toDate(local).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  }
  var esApple = /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent) && !/Android/.test(navigator.userAgent);
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-cal]");
    if (!b) return;
    var ev = C.eventos[+b.getAttribute("data-cal")];
    var titulo = ev.titulo + " de " + C.nombre;
    var lugar = ev.lugar + ", " + ev.direccion;
    if (esApple) {
      var ics = [
        "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Bautismo Helena//ES", "BEGIN:VEVENT",
        "UID:" + ev.id + "-" + utcStamp(ev.inicio) + "@helena",
        "DTSTAMP:" + new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, ""),
        "DTSTART:" + utcStamp(ev.inicio), "DTEND:" + utcStamp(ev.fin),
        "SUMMARY:" + titulo, "LOCATION:" + lugar.replace(/,/g, "\\,"),
        "END:VEVENT", "END:VCALENDAR",
      ].join("\r\n");
      var a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
      a.download = ev.id + "-helena.ics";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } else {
      var url = "https://calendar.google.com/calendar/render?action=TEMPLATE" +
        "&text=" + encodeURIComponent(titulo) +
        "&dates=" + utcStamp(ev.inicio) + "/" + utcStamp(ev.fin) +
        "&location=" + encodeURIComponent(lugar);
      window.open(url, "_blank", "noopener");
    }
  });

  // ---------- Itinerario ----------
  if (C.itinerario && C.itinerario.length) {
    $("itinerario").innerHTML = C.itinerario.map(function (it) {
      return '<li><span class="dot">' + icon(it.icono) + "</span><span><b>" + esc(it.hora) +
        " hs</b>" + esc(it.texto) + "</span></li>";
    }).join("");
  } else {
    $("itinerario-wrap").hidden = true;
  }

  // ---------- Opcionales ----------
  if (C.vestimenta) $("vestimenta-wrap").hidden = false;
  var R = C.regalos || {};
  if (R.texto || R.alias || R.cuenta) {
    $("regalos-wrap").hidden = false;
    $("regalos-texto").textContent = R.texto || "";
    var filas = [["Titular", R.titular], ["Alias", R.alias], ["CBU", R.cuenta]].filter(function (f) { return f[1]; });
    $("regalos-datos").innerHTML = filas.map(function (f) {
      return "<div><dt>" + f[0] + "</dt><dd>" + esc(f[1]) + "</dd></div>";
    }).join("");
    $("copiar").addEventListener("click", function () {
      var txt = filas.map(function (f) { return f[0] + ": " + f[1]; }).join("\n");
      navigator.clipboard.writeText(txt).then(function () {
        $("copiado").hidden = false;
        setTimeout(function () { $("copiado").hidden = true; }, 2200);
      });
    });
  }
  $("fotos-link").href = C.fotosUrl;

  // ---------- Cuenta regresiva ----------
  var objetivo = toDate(primero.inicio).getTime();
  function tick() {
    var ms = objetivo - Date.now();
    if (ms <= 0) {
      $("countdown").hidden = true;
      $("cd-done").hidden = false;
      return;
    }
    var s = Math.floor(ms / 1000);
    $("cd-d").textContent = Math.floor(s / 86400);
    $("cd-h").textContent = Math.floor((s % 86400) / 3600);
    $("cd-m").textContent = Math.floor((s % 3600) / 60);
    $("cd-s").textContent = s % 60;
    setTimeout(tick, 1000 - (Date.now() % 1000));
  }
  tick();

  // ---------- Aparición suave ----------
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
  }

  // ---------- Confirmación ----------
  if (C.confirmarHasta) {
    $("rsvp-hasta").textContent = "Te pedimos que confirmes antes del " +
      fmtCorta.format(toDate(C.confirmarHasta + "T12:00")) + ".";
  }
  var demo = !C.sheetUrl;
  $("f-demo").hidden = !demo;

  function leerGuardado() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)); } catch (e) { return null; }
  }
  function mostrarYaConfirmado() {
    var g = leerGuardado();
    if (!g) return;
    $("rsvp-ya").hidden = false;
    $("rsvp-ya").textContent = "Ya confirmaste como " + g.nombre + ". Si querés cambiar algo, podés volver a enviarla.";
    $("rsvp-open").textContent = "Modificar confirmación";
  }
  mostrarYaConfirmado();

  var dlg = $("rsvp");
  var form = $("rsvp-form");
  var cant = $("f-cantidad");

  $("rsvp-open").addEventListener("click", function () {
    var g = leerGuardado();
    if (g) {
      $("f-nombre").value = g.nombre;
      cant.value = g.cantidad;
      var r = form.querySelector('input[name="evento"][value="' + g.evento + '"]');
      if (r) r.checked = true;
    }
    form.hidden = false;
    $("rsvp-ok").hidden = true;
    $("f-error").hidden = true;
    dlg.showModal();
  });
  $("rsvp-close").addEventListener("click", function () { dlg.close(); });
  $("ok-cerrar").addEventListener("click", function () { dlg.close(); });
  dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });

  form.querySelectorAll("[data-step]").forEach(function (b) {
    b.addEventListener("click", function () {
      var v = (parseInt(cant.value, 10) || 1) + +b.getAttribute("data-step");
      cant.value = Math.min(15, Math.max(1, v));
    });
  });

  function error(msg) {
    $("f-error").textContent = msg;
    $("f-error").hidden = false;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    $("f-error").hidden = true;
    var datos = {
      nombre: $("f-nombre").value.trim().replace(/\s+/g, " "),
      cantidad: parseInt(cant.value, 10),
      evento: (form.querySelector('input[name="evento"]:checked') || {}).value,
      mensaje: $("f-mensaje").value.trim(),
      web: form.web.value,
    };
    if (datos.nombre.length < 3) return error("Escribí tu nombre y apellido.");
    if (!(datos.cantidad >= 1 && datos.cantidad <= 15)) return error("Indicá cuántos van a venir (de 1 a 15).");
    if (datos.evento === "No asiste") datos.cantidad = 0;

    var btn = $("f-enviar");
    btn.disabled = true;
    btn.textContent = "Enviando…";

    var envio = demo
      ? new Promise(function (ok) { setTimeout(ok, 700); })
      : fetch(C.sheetUrl, {
          method: "POST",
          // text/plain evita el "preflight" que Google no acepta
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(datos),
        }).then(function (r) { return r.json(); }).then(function (r) {
          if (!r || !r.ok) throw new Error((r && r.error) || "error");
        });

    envio.then(function () {
      try {
        localStorage.setItem(STORE_KEY, JSON.stringify({
          nombre: datos.nombre, cantidad: datos.cantidad || 1, evento: datos.evento,
        }));
      } catch (e2) { /* sin almacenamiento: no pasa nada */ }
      var nombre = datos.nombre.split(" ")[0];
      $("ok-texto").textContent = datos.evento === "No asiste"
        ? "Gracias por avisarnos, " + nombre + ". ¡Los vamos a extrañar!"
        : "¡Qué alegría, " + nombre + "! Los esperamos" +
          (datos.evento === "Bautismo" ? " en el bautismo." : datos.evento === "Festejo" ? " en el festejo." : " en el bautismo y en el festejo.");
      form.hidden = true;
      $("rsvp-ok").hidden = false;
      form.reset();
      mostrarYaConfirmado();
    }).catch(function () {
      error("No pudimos enviar la confirmación. Revisá tu conexión y probá de nuevo.");
    }).then(function () {
      btn.disabled = false;
      btn.textContent = "Enviar";
    });
  });
})();
