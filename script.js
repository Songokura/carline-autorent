/* ============================================================
   CARLINE AUTORENT - скрипт страницы.
   Герой - живой шоурум (машины парка сменяют друг друга) · плиты в
   обычной прокрутке · перевод RU/EN, казахский словарь грузится отдельным
   файлом по кнопке KZ · меню ·
   WhatsApp с названием машины · форма в WhatsApp. Библиотек нет.
   ============================================================ */
(function(){
"use strict";
var WA = "77027779052";
var RED = matchMedia("(prefers-reduced-motion: reduce)").matches;
var HAS_IO = typeof IntersectionObserver === "function";
var root = document.documentElement;
var ASSET_V = ((document.currentScript && document.currentScript.src.match(/[?&]v=([^&]+)/)) || [])[1] || "";

/* ---------------- КОНВЕРСИИ GOOGLE ADS ----------------
   Ярлыки задаёт index.html (window.CL_CONV): phone, contact, lead. Пусто - не шлём. */
function conv(key, item){
  var id = (window.CL_CONV || {})[key];
  if (!id || typeof window.gtag !== "function") return;
  var p = {send_to: id, value: 1.0, currency: "USD", transport_type: "beacon"};
  if (item) p.item = item;
  window.gtag("event", "conversion", p);
}

/* ---------------- АНГЛИЙСКИЙ СЛОВАРЬ ---------------- */
var EN = {
  "m.title":"Car Rental in Astana without a Driver from 15,000 KZT per Day - Carline Autorent",
  "m.desc":"Self-drive car rental in Astana: 8 sedans and a crossover from 15,000 KZT per day. Minimal deposit, clean and serviced cars, delivery across the city, WhatsApp reply within 5 minutes. Open daily 10:00-22:00.",
  "m.ogt":"Carline Autorent - self-drive car rental in Astana",
  "a.menu":"Menu","a.home":"Carline Autorent - home","a.nav":"Sections","a.lang":"Site language","a.call":"Call","a.mnav":"Mobile menu",
  "a.hero":"Self-drive car rental in Astana","a.reel":"Cars in the fleet","a.ek":"Economy class","a.ko":"Comfort class","a.bi":"Business class","a.su":"SUV","a.park":"Fleet and prices","a.filter":"Filter by class","a.dost":"Car delivery across the city","a.usl":"Rental terms","a.kak":"How to rent","a.faq":"FAQ","a.zay":"Booking request","a.kont":"Contacts","a.bar":"Quick contact",
  "n.park":"Fleet","n.usl":"Terms","n.dost":"Delivery","n.kak":"How to rent","n.faq":"FAQ","n.kont":"Contacts",
  "mn.ek":"Economy","mn.ko":"Comfort","mn.bi":"Business","mn.su":"SUV",
  "b.wa":"Message on WhatsApp","b.call":"Call","b.book":"Book now","b.cars":"Cars in this class","b.bookwa":"Book on WhatsApp",
  "w.from":"from","w.day":"KZT / day","w.cur":"","w.curf":"",
  "h.kw":"Self-drive car rental in Astana",
  "h.l1":"Like your own.","h.l2":"Minus the hassle.",
  "h.lead":"8 cars from 15,000 KZT per day. Minimal deposit, delivery across the city, WhatsApp reply within 5 minutes.",
  "h.b1":"Book on WhatsApp","h.b2":"Choose a car","h.ig":"Our fleet on Instagram",
  "c1.k":"Economy","c1.h":"Chevrolet Cobalt 2026","c1.l":"For the city and errands: affordable, economical, always clean.",
  "c2.k":"Comfort","c2.h":"Hyundai Elantra and Toyota Camry 55","c2.l":"Comfortable sedans for every day, meetings and family trips.",
  "c3.k":"Business","c3.h":"Toyota Camry 70, Kia K5 and Camry 80","c3.l":"Executive sedans for business trips, meetings and events.",
  "c4.k":"SUV","c4.h":"Hyundai Santa Fe","c4.l":"A spacious crossover for the family, city guests and trips out of town.",
  "p.k":"Fleet","p.h":"Choose your car","p.l":"8 cars, prices per day, discounts already included. Tap \"Book\" - WhatsApp opens with the name of the chosen car.",
  "f.all":"All","f.ek":"Economy","f.ko":"Comfort","f.bi":"Business","f.su":"SUV",
  "ph.t":"Car photo",
  "car.cobalt":"Chevrolet Cobalt","car.elantra":"Hyundai Elantra","car.camry55":"Toyota Camry 55","car.camry70p":"Toyota Camry 70 Prestige","car.camry70l":"Toyota Camry 70 Luxe","car.k5":"Kia K5","car.camry80":"Toyota Camry 80","car.santafe":"Hyundai Santa Fe",
  "s.cobalt":"2026 · sedan · 5 seats","s.elantra":"2024 · Luxe (full) · 1.5 L","s.camry55":"N4 · sedan · 5 seats","s.camry70p":"Prestige · sedan · 5 seats","s.camry70l":"Luxe · sedan · 5 seats","s.k5":"2022 · Full · sedan · 5 seats","s.camry80":"Prestige · sedan · 5 seats","s.santafe":"Full · crossover · all-wheel drive",
  "p.note":"Prices in tenge per day. Delivery across the city - 5,000 KZT, to the airport - 10,000 KZT. Deposit and extension terms - ask the manager on WhatsApp.",
  "n1":"cars in the fleet","n2":"KZT - lowest price per day","n3m":"min","n3":"WhatsApp reply time","n4":"daily, no days off",
  "d.k":"Delivery","d.h":"We bring the car to your address","d.l":"Send us the address and a convenient time - we arrive with the car, sign the contract on the spot and hand over the keys.",
  "d.b":"Order delivery","dp.city":"Across the city","dp.air":"To the airport","dp.u":"KZT","dp.u2":"KZT","d.b2":"Rental terms",
  "u.k":"Terms","u.h":"What you need to rent","u.l":"The essentials in short. Exact amounts and requirements for your car - from the manager on WhatsApp.",
  "u1.h":"Documents","u1.t":"ID and a driving licence. Full list - from the manager.",
  "u2.h":"Deposit","u2.t":"Among the lowest on the market. Depends on the car - confirmed at booking.",
  "u3.h":"Age and experience","u3.t":"Age and driving experience requirements - ask the manager.",
  "u4.h":"Rental period","u4.t":"From one day. Extension by WhatsApp message, no office visit.",
  "w.k":"Why Carline","w1":"Minimal deposit","w2":"Clean and serviced cars","w3":"Delivery across the city","w4":"WhatsApp reply within 5 minutes",
  "k.k":"How to rent","k.h":"Four steps to the keys",
  "k1.h":"Choose a car","k1.t":"In the catalogue above or with the manager's advice",
  "k2.h":"Message us on WhatsApp","k2.t":"Dates, car, phone - we reply within 5 minutes",
  "k3.h":"Contract and deposit","k3.t":"Signed at pickup, the deposit is minimal",
  "k4.h":"Get the keys","k4.t":"At our office on Koshkarbayev 10/1 or with delivery",
  "q.k":"FAQ","q.h":"Frequently asked questions",
  "q1.q":"What is the deposit and when is it returned?","q1.a":"The deposit is minimal and depends on the car. It is returned after the car is checked in. The manager will name the exact amount.",
  "q2.q":"Which documents do I need?","q2.a":"ID and a driving licence. If there are special requirements for your car, we will tell you at booking.",
  "q3.q":"Do you deliver the car?","q3.a":"Yes. Across Astana - 5,000 KZT, to the airport - 10,000 KZT. You send the address and time, we arrive, sign the contract on the spot and hand over the car.",
  "q4.q":"Can I extend the rental?","q4.a":"Yes, message us on WhatsApp before the end of the term - we extend without an office visit if the car is free.",
  "q5.q":"In what condition are the cars?","q5.a":"Clean inside and out, fully serviced. You return it the same way - no surprises on either side.",
  "z.k":"Booking","z.h":"Book a car","z.l":"Fill in three fields - the request opens in your WhatsApp, the manager replies within 5 minutes.",
  "f.car":"Car","f.any":"Pick one for me","f.from":"Pickup date","f.to":"Return date","f.name":"Name","f.nameph":"How should we address you","f.phone":"Phone","f.send":"Send on WhatsApp",
  "f.err":"Enter your phone so we can reply.","f.ok":"Thank you! Opening WhatsApp with your request - if the window did not appear, message us directly.",
  "f.note":"The request goes to the manager on WhatsApp. No robot calls or mailings.",
  "kt.k":"Contacts","kt.h":"Message or call us","kt.l":"We reply daily from 10:00 to 22:00. Office - Rakymzhan Koshkarbayev Avenue, 10/1, Astana.",
  "kt.hrs":"Daily 10:00-22:00","kt.2gis":"We are on 2GIS","kt.addr":"Rakymzhan Koshkarbayev Ave., 10/1, Astana","kt.map":"Map: Carline Autorent, Koshkarbayev 10/1","kt.route":"Route on 2GIS",
  "ft.d":"Self-drive car rental in Astana.",
  "al.hero":"Black Toyota Camry 70 by Carline Autorent with headlights on at night","al.ek":"White Chevrolet Cobalt 2026 by Carline Autorent in a parking garage","al.ko":"White Hyundai Elantra 2024 by Carline Autorent in the city","al.bi":"Black Toyota Camry 70 Prestige by Carline Autorent in a parking garage","al.su":"Grey Hyundai Santa Fe by Carline Autorent, rear view","al.dost":"Black Toyota Camry 70 by Carline Autorent in the evening",
  "al.elantra":"White Hyundai Elantra 2024 by Carline Autorent","al.camry55":"Black Toyota Camry 55 by Carline Autorent with headlights on","al.camry70p":"Black Toyota Camry 70 Prestige by Carline Autorent in a parking garage","al.camry70l":"Black Toyota Camry 70 Luxe by Carline Autorent by a building in the evening","al.camry80":"Black Toyota Camry 80 by Carline Autorent","al.cobalt":"White Chevrolet Cobalt 2026 by Carline Autorent","g.btn":"All photos","g.hint":"Click to open the gallery","g.soon":"Photo coming soon","g.s1":"Interior: front row","g.s2":"Interior: rear row","g.s3":"Trunk","g.aria":"Car photos","g.close":"Close","g.prev":"Previous photo","g.next":"Next photo","al.k5":"Grey Kia K5 in a parking garage","al.santafe":"Grey Hyundai Santa Fe by Carline Autorent, front view",
  "mq.list":"Chevrolet Cobalt|Hyundai Elantra|Toyota Camry 55|Toyota Camry 70|Kia K5|Toyota Camry 80|Hyundai Santa Fe|from 15,000 KZT per day|Delivery from 5,000 KZT"
};
var RU_MQ = "Chevrolet Cobalt|Hyundai Elantra|Toyota Camry 55|Toyota Camry 70|Kia K5|Toyota Camry 80|Hyundai Santa Fe|от 15 000 тг в сутки|Доставка от 5 000 тг";
var I18N = {en: EN};
var RU = {};                                       /* снимок русского текста из разметки */

/* ---------------- WHATSAPP: текст по кнопке ----------------
   data-wa="general|class|car|delivery"; class и car берут название из data-wa-title (ключ i18n).
   Обработчик в фазе захвата на window - раньше трекера LeadBot, чтобы он дописал код к готовой ссылке. */
var WA_T = {
  ru:{general:"Здравствуйте! Пишу с сайта Carline Autorent. Хочу арендовать автомобиль.", "class":"Здравствуйте! Пишу с сайта Carline Autorent. Интересует класс:\n{name}\nПодскажите, какие машины свободны и условия.", car:"Здравствуйте! Пишу с сайта Carline Autorent. Хочу забронировать:\n{name}\nДаты аренды: ", delivery:"Здравствуйте! Пишу с сайта Carline Autorent. Хочу арендовать машину с доставкой.\nМашина:\nАдрес:\nДата и время:"},
  en:{general:"Hello! I'm writing from the Carline Autorent website. I'd like to rent a car.", "class":"Hello! I'm writing from the Carline Autorent website. I'm interested in the class:\n{name}\nWhich cars are available and on what terms?", car:"Hello! I'm writing from the Carline Autorent website. I'd like to book:\n{name}\nRental dates: ", delivery:"Hello! I'm writing from the Carline Autorent website. I'd like to rent a car with delivery.\nCar:\nAddress:\nDate and time:"}
};
function tr(key){
  var L = curLang(), d = I18N[L];
  return (d && d[key]) || RU[key] || "";
}
function waText(kind, titleKey){
  var L = curLang(), T = WA_T[L] || WA_T.ru;
  if (L === "kk" && window.SITE_KK && window.SITE_KK.__wa) T = window.SITE_KK.__wa;
  var t = T[kind] || T.general;
  if (titleKey) t = t.replace("{name}", tr(titleKey));
  return t;
}
window.addEventListener("click", function(e){
  var a = e.target.closest ? e.target.closest("a[href]") : null;
  if (!a) return;
  var h = a.getAttribute("href") || "";
  if (a.dataset.wa) {
    a.href = "https://wa.me/" + WA + "?text=" + encodeURIComponent(waText(a.dataset.wa, a.dataset.waTitle));
    conv("contact", a.dataset.waTitle || a.dataset.wa);
  } else if (h.indexOf("tel:") === 0) conv("phone");
}, true);

/* ---------------- ЯЗЫК ---------------- */
function curLang(){ return root.getAttribute("lang") || "ru"; }
function snapshot(){
  document.querySelectorAll("[data-i]").forEach(function(el){ RU[el.dataset.i] = el.textContent; });
  document.querySelectorAll("[data-i-ph]").forEach(function(el){ RU[el.dataset.iPh] = el.getAttribute("placeholder"); });
  document.querySelectorAll("[data-i-aria]").forEach(function(el){ RU[el.dataset.iAria] = el.getAttribute("aria-label"); });
  document.querySelectorAll("[data-i-alt]").forEach(function(el){ RU[el.dataset.iAlt] = el.getAttribute("alt"); });
  document.querySelectorAll("[data-i-t]").forEach(function(el){ RU[el.dataset.iT] = el.tagName === "IFRAME" ? el.getAttribute("title") : el.textContent; });
  document.querySelectorAll("[data-i-c]").forEach(function(el){ RU[el.dataset.iC] = el.getAttribute("content"); });
  RU["mq.list"] = RU_MQ;
}
function applyLang(lang){
  var d = lang === "ru" ? RU : (I18N[lang] || RU);
  function g(k){ return d[k] != null ? d[k] : RU[k]; }
  document.querySelectorAll("[data-i]").forEach(function(el){ var v = g(el.dataset.i); if (v != null) el.textContent = v; });
  document.querySelectorAll("[data-i-ph]").forEach(function(el){ var v = g(el.dataset.iPh); if (v != null) el.setAttribute("placeholder", v); });
  document.querySelectorAll("[data-i-aria]").forEach(function(el){ var v = g(el.dataset.iAria); if (v != null) el.setAttribute("aria-label", v); });
  document.querySelectorAll("[data-i-alt]").forEach(function(el){ var v = g(el.dataset.iAlt); if (v != null) el.setAttribute("alt", v); });
  document.querySelectorAll("[data-i-t]").forEach(function(el){ var v = g(el.dataset.iT); if (v != null) { if (el.tagName === "IFRAME") el.setAttribute("title", v); else el.textContent = v; } });
  document.querySelectorAll("[data-i-c]").forEach(function(el){ var v = g(el.dataset.iC); if (v != null) el.setAttribute("content", v); });
  root.setAttribute("lang", lang);
  document.querySelectorAll(".lang button").forEach(function(b){
    var on = b.dataset.lang === lang;
    b.classList.toggle("is-active", on); b.setAttribute("aria-pressed", on ? "true" : "false");
  });
  try { localStorage.setItem("cl-lang", lang); } catch(e){}
  buildMarquee(g("mq.list"));
  fitAll();
}
/* казахский словарь - отдельным файлом, только по выбору человека */
function loadLang(lang, done){
  if (I18N[lang] || lang !== "kk") return done();
  var s = document.createElement("script");
  s.src = "assets/lang/kk.js" + (ASSET_V ? "?v=" + ASSET_V : "");
  s.onload = function(){ if (window.SITE_KK) I18N.kk = window.SITE_KK; done(); };
  s.onerror = function(){ done(); };
  document.head.appendChild(s);
}
function setLang(lang){
  if (["ru","kk","en"].indexOf(lang) < 0) lang = "ru";
  loadLang(lang, function(){ applyLang((I18N[lang] || lang === "ru") ? lang : "ru"); });
}
document.querySelectorAll(".lang button").forEach(function(b){ b.addEventListener("click", function(){ setLang(b.dataset.lang); }); });
function initLang(){
  var q = new URLSearchParams(location.search).get("lang"), saved = null;
  try { saved = localStorage.getItem("cl-lang"); } catch(e){}
  var L = q || saved || "ru";
  if (L !== "ru") setLang(L); else buildMarquee(RU_MQ);
}

/* ---------------- БЕГУЩАЯ ЛЕНТА ---------------- */
function buildMarquee(list){
  var box = document.getElementById("mq1"); if (!box) return;
  var items = (list || RU_MQ).split("|"), html = "";
  items.forEach(function(t){ html += "<b>" + t + "</b>"; });
  box.innerHTML = html + html;                                 /* две копии: цикл в одну копию */
  requestAnimationFrame(function(){
    var w = box.scrollWidth / 2;
    box.style.setProperty("--tkw", w + "px");
    box.style.setProperty("--tkd", Math.max(20, w / 55) + "s");
  });
}

/* ---------------- ШАПКА И МЕНЮ ---------------- */
var hdr = document.getElementById("hdr"), burger = document.getElementById("burger");
function hdrState(){ hdr.classList.toggle("solid", scrollY > 40); }
function closeMenu(){ document.body.classList.remove("menu-open"); burger.setAttribute("aria-expanded", "false"); }
burger.addEventListener("click", function(){
  var open = document.body.classList.toggle("menu-open");
  burger.setAttribute("aria-expanded", open ? "true" : "false");
});
document.addEventListener("keydown", function(e){ if (e.key === "Escape") closeMenu(); });

/* ---------------- ГЕРОЙ: ЖИВОЙ ШОУРУМ ----------------
   Машины парка сменяют друг друга: кадр медленно наезжает (CSS kb), смена - наплыв 1.4 с.
   Подпись с ценой ведёт на карточку, полоски снизу переключают машину. Вне экрана и
   во вкладке в фоне показ стоит. При reduced-motion - без смены, только по полоскам. */
(function(){
  var hero = document.querySelector(".hero"), reel = document.getElementById("reel");
  if (!hero || !reel) return;
  var sl = [].slice.call(reel.querySelectorAll(".sl"));
  var caps = [].slice.call(hero.querySelectorAll(".rc"));
  var bars = [].slice.call(hero.querySelectorAll(".rbars button"));
  var DUR = 6000, i = 0, t = null, left = DUR, t0 = 0, seen = true;
  function show(n){
    var prev = i; i = (n + sl.length) % sl.length;
    if (prev !== i) {
      sl.forEach(function(el){ el.classList.remove("out"); });
      sl[prev].classList.remove("is-on"); sl[prev].classList.add("out");
      setTimeout(function(){ if (!sl[prev].classList.contains("is-on")) sl[prev].classList.remove("out"); }, 1500);
      var img = sl[i].querySelector("img"); if (img) img.loading = "eager";
    }
    sl[i].classList.add("is-on");
    caps.forEach(function(c, k){ c.classList.toggle("is-on", k === i); });
    bars.forEach(function(b, k){
      b.classList.remove("run"); b.classList.toggle("done", k < i);
      b.setAttribute("aria-pressed", k === i ? "true" : "false");
    });
    if (!RED) { void bars[i].offsetWidth; bars[i].style.setProperty("--dur", DUR + "ms"); bars[i].classList.add("run"); }
    else bars[i].classList.add("done");
    left = DUR; arm();
  }
  function arm(){
    clearTimeout(t); t = null;
    if (RED || !seen || document.hidden) { hero.classList.add("paused"); return; }
    hero.classList.remove("paused"); t0 = Date.now();
    t = setTimeout(function(){ show(i + 1); }, left);
  }
  function pause(){ if (t) { left = Math.max(300, left - (Date.now() - t0)); } clearTimeout(t); t = null; hero.classList.add("paused"); }
  bars.forEach(function(b, k){ b.addEventListener("click", function(){ show(k); }); });
  document.addEventListener("visibilitychange", function(){ document.hidden ? pause() : arm(); });
  if ("IntersectionObserver" in window) new IntersectionObserver(function(es){
    seen = es[0].isIntersecting; seen ? arm() : pause();
  }, {threshold: .2}).observe(hero);
  /* остальные кадры подгружаем после первой отрисовки, чтобы смена не мигала пустотой */
  addEventListener("load", function(){ sl.forEach(function(el){ var im = el.querySelector("img"); if (im) im.loading = "eager"; }); });
  show(0);
})();

/* ---------------- ЯКОРЯ ---------------- */
function goTo(id, push){
  var el = document.getElementById(id); if (!el) return;
  closeMenu();
  var top = el.getBoundingClientRect().top + scrollY;
  if (el.classList.contains("pw") && el.id !== "top") top += 2;   /* плита: чуть внутрь, чтобы enter = 1 */
  else if (!el.classList.contains("pw")) top -= parseFloat(getComputedStyle(root).getPropertyValue("--hh")) || 72;
  scrollTo({top: Math.max(0, top), behavior: RED ? "auto" : "smooth"});
  if (push !== false) { try { history.pushState(null, "", "#" + id); } catch(e){} }
}
document.addEventListener("click", function(e){
  var a = e.target.closest ? e.target.closest("[data-go]") : null; if (!a) return;
  e.preventDefault();
  goTo(a.dataset.go);
});

/* ---------------- FIT TEXT ---------------- */
function fitOne(el){
  el.style.fontSize = "";
  var box = el.parentElement, max = box.clientWidth, guard = 0;
  var fs = parseFloat(getComputedStyle(el).fontSize);
  while (el.scrollWidth > max + 1 && guard < 14) { fs *= .95; el.style.fontSize = fs + "px"; guard++; }
}
function fitAll(){ document.querySelectorAll(".fit").forEach(fitOne); }
if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitAll);
addEventListener("resize", fitAll);

/* ---------------- ПЛИТЫ ----------------
   Один слушатель scroll через rAF. На каждую .pw пишем --enter/--exit/--stay.
   Подача кадра: --arr (положение, 0..1, торможение easeOut), --vel (скорость -
   яркость луча фар впереди), --nod (кивок подвески в момент остановки).
   Герой: --arr от интро, по --stay машина уезжает вправо, --tv - след габаритов. */
function clamp(v){ return v < 0 ? 0 : (v > 1 ? 1 : v); }
function easeOut(t){ return 1 - Math.pow(1 - t, 3); }
function easeInOut(t){ return t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
/* профиль подачи: p 0..1 -> положение, скорость, кивок */
function drive(p){
  var pos = easeOut(p);
  var vel = 3 * Math.pow(1 - p, 2);                      /* производная easeOut, 3..0 */
  var nod = p > .55 ? Math.sin(Math.PI * clamp((p - .55) / .45)) : 0;   /* кивок при торможении */
  return {arr: pos, vel: clamp(vel / 3 * 1.4), nod: nod};
}

var heroPw = document.getElementById("top");
var pws = [].slice.call(document.querySelectorAll(".pw"));
var bar = document.getElementById("bar");
var kont = document.getElementById("kontakty");
var introK = 1, introDone = true;
function setDrive(pw, d){
  pw.style.setProperty("--arr", d.arr.toFixed(3));
  pw.style.setProperty("--vel", d.vel.toFixed(3));
  pw.style.setProperty("--nod", d.nod.toFixed(3));
}
function update(){
  var H = innerHeight || root.clientHeight;
  pws.forEach(function(pw){
    var r = pw.getBoundingClientRect();
    var enter = clamp(1 - r.top / H);
    var exit  = clamp(1 - r.bottom / H);
    var stay  = r.height > H + 1 ? clamp(-r.top / (r.height - H)) : enter;
    pw.style.setProperty("--enter", enter.toFixed(3));
    pw.style.setProperty("--exit",  exit.toFixed(3));
    pw.style.setProperty("--stay",  stay.toFixed(3));
    pw.classList.toggle("gone", exit >= 1);
    if (pw === heroPw) {
      setDrive(pw, drive(introK));
      pw.classList.toggle("on", introK > .5);
      pw.style.setProperty("--tv", Math.sin(Math.PI * clamp(stay / .85)).toFixed(3));   /* след ярче в движении, гаснет к концу */
    } else {
      var p = clamp((enter - .1) / .78);
      setDrive(pw, drive(p));
      pw.classList.toggle("on", enter > .3);
    }
  });
  hdrState();
  if (bar) {
    var onKont = kont && kont.getBoundingClientRect().top < H * 0.6;
    bar.classList.toggle("show", scrollY > H * 0.55 && !onKont);
  }
}
root.classList.add("no-plate");   /* плиты - обычная прокрутка, без наезда и подачи кадра */
if (RED) {
  pws.forEach(function(pw){ pw.classList.add("on"); });
  addEventListener("scroll", function(){ hdrState(); if (bar) bar.classList.toggle("show", scrollY > innerHeight * 0.55); }, {passive:true});
  hdrState();
} else {
  var tick = false;
  addEventListener("scroll", function(){
    if (tick) return; tick = true;
    requestAnimationFrame(function(){ tick = false; update(); });
  }, {passive:true});
  addEventListener("resize", update);
  addEventListener("load", update);
  /* интро 1250 мс: машина подаётся слева, впереди свет фар, тормозит с кивком; текст поднимается.
     Пропускаем при хэше / прокрутке - человек из рекламы сразу видит собранный экран. */
  var skip = true;   /* 02.10.2026: подача машины на интро и наезд плит убраны по просьбе клиента */
  if (skip) {
    update();
  } else {
    introK = 0; introDone = false; update();
    var t0 = null;
    var step = function(ts){
      if (introDone) return;
      if (t0 === null) t0 = ts;
      var p = clamp((ts - t0) / 1250);
      introK = p;
      update();
      if (p < 1) requestAnimationFrame(step);
      else introDone = true;
    };
    requestAnimationFrame(function(){ requestAnimationFrame(step); });
    setTimeout(function(){ if (!introDone) { introDone = true; introK = 1; update(); } }, 2000);
  }
}
window.plateSync = function(){ introDone = true; introK = 1; update(); };
addEventListener("hashchange", function(){
  var id = location.hash.slice(1); if (!id || !document.getElementById(id)) return;
  goTo(id, false);
  setTimeout(function(){ goTo(id, false); }, 420);
});

/* ---------------- ПОЯВЛЕНИЕ ---------------- */
if (HAS_IO) {
  if (!RED) root.classList.add("js");
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } });
  }, {threshold:.08, rootMargin:"0px 0px -5% 0px"});
  document.querySelectorAll(".rv").forEach(function(el){ io.observe(el); });
  setTimeout(function(){ document.querySelectorAll(".rv:not(.in)").forEach(function(el){
    if (el.getBoundingClientRect().top < innerHeight) el.classList.add("in");
  }); }, 1500);
} else {
  document.querySelectorAll(".rv").forEach(function(el){ el.classList.add("in"); });
}

/* ---------------- ФОРМА -> WhatsApp ---------------- */
var FORM_T = {
  ru:{hello:"Здравствуйте! Заявка с сайта Carline Autorent.", name:"Имя", car:"Машина", from:"Получение", to:"Возврат", phone:"Телефон", none:"подберите за меня"},
  en:{hello:"Hello! Booking request from the Carline Autorent website.", name:"Name", car:"Car", from:"Pickup", to:"Return", phone:"Phone", none:"pick one for me"}
};
var form = document.getElementById("form");
function fmtDate(v){ if (!v) return ""; var p = v.split("-"); return p.length === 3 ? p[2] + "." + p[1] + "." + p[0] : v; }
if (form) form.addEventListener("submit", function(e){
  e.preventDefault();
  var ok = document.getElementById("fmok"), err = document.getElementById("fmerr");
  if (form.company && form.company.value) return;          /* honeypot */
  var phone = form.phone.value.trim();
  if (phone.replace(/\D/g, "").length < 10) { err.hidden = false; ok.hidden = true; form.phone.focus(); return; }
  err.hidden = true;
  var L = curLang(), F = FORM_T[L] || FORM_T.ru;
  if (L === "kk" && window.SITE_KK && window.SITE_KK.__form) F = window.SITE_KK.__form;
  var car = form.car.value ? form.car.value : F.none;
  var name = form.name.value.trim(), from = fmtDate(form.from.value), to = fmtDate(form.to.value);
  var t = F.hello + "\n" + F.car + ": " + car + "\n" +
          (from || to ? F.from + ": " + (from || "-") + ", " + F.to + ": " + (to || "-") + "\n" : "") +
          (name ? F.name + ": " + name + "\n" : "") + F.phone + ": " + phone;
  ok.hidden = false;
  conv("lead", car);
  window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(t), "_blank", "noopener");
});

/* ---------------- СТАРТ ---------------- */
snapshot();
initLang();
hdrState();
fitAll();
/* прямой переход по якорю: встать на блок, интро пропущено выше; старый якорь класса ведёт в каталог */
if (location.hash) {
  var hid = location.hash.slice(1);
  if (/^(ekonom|komfort|biznes|vnedorozhnik)$/.test(hid)) hid = "avtopark";   /* старые якоря классов, убраны 02.10.2026 */
  if (document.getElementById(hid)) {
    setTimeout(function(){ goTo(hid, false); }, 60);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function(){ if (location.hash.slice(1) === hid) goTo(hid, false); });
  }
}

/* ---------------- ГАЛЕРЕЯ МАШИНЫ ----------------
   Слайд - путь к фото или {ph:"ключ подписи"} (заглушка до фото клиента:
   чтобы заменить, вписать вместо неё путь к файлу). */
var GV = "?v=20260929-9";
var GAL = {
  cobalt:   {t:"car.cobalt",   s:[1,2,3,4,5,6,7,8].map(function(n){ return "assets/img/g/cobalt-" + n + ".webp" + GV; })},
  camry70p: {t:"car.camry70p", s:[1,2,3,4,5,6,7].map(function(n){ return "assets/img/g/camry70p-" + n + ".webp" + GV; })},
  camry70l: {t:"car.camry70l", s:[2,1,3,4,5,6,7,8].map(function(n){ return "assets/img/g/camry70l-" + n + ".webp" + GV; })},
  elantra:  {t:"car.elantra",  s:[1,2,3,4,5,6,7].map(function(n){ return "assets/img/g/elantra-" + n + ".webp" + GV; })},
  camry55:  {t:"car.camry55",  s:[1,2,3,4,5,6,7].map(function(n){ return "assets/img/g/camry55-" + n + ".webp" + GV; })},
  camry80:  {t:"car.camry80",  s:[1,2,3,4,5,6,7,8].map(function(n){ return "assets/img/g/camry80-" + n + ".webp" + GV; })},
  santafe:  {t:"car.santafe",  s:[1,2,3,4,5,6,7,8].map(function(n){ return "assets/img/g/santafe-" + n + ".webp" + GV; })}
};
RU["g.hint"] = "Нажмите - откроется галерея"; RU["g.s1"] = "Салон: передний ряд"; RU["g.s2"] = "Салон: задний ряд"; RU["g.s3"] = "Багажник";
var lb = document.getElementById("lb");
if (lb) {
  var lbImg = lb.querySelector(".lb-img"), lbPh = lb.querySelector(".lb-ph"), lbPhT = lb.querySelector(".lb-ph-t"),
      lbT = lb.querySelector(".lb-t"), lbN = lb.querySelector(".lb-n"),
      lbPrev = lb.querySelector(".lb-prev"), lbNext = lb.querySelector(".lb-next"), lbX = lb.querySelector(".lb-x"),
      cur = null, idx = 0, back = null;
  var show = function(i){
    var sl = cur.s; idx = Math.max(0, Math.min(sl.length - 1, i));
    var it = sl[idx];
    if (typeof it === "string") {
      lbPh.hidden = true; lbImg.hidden = false; lbImg.src = it; lbImg.alt = tr(cur.t) + " - " + (idx + 1);
    } else {
      lbImg.hidden = true; lbImg.removeAttribute("src"); lbPh.hidden = false; lbPhT.textContent = tr(it.ph);
    }
    lbN.textContent = (idx + 1) + " / " + sl.length;
    lbPrev.disabled = idx === 0; lbNext.disabled = idx === sl.length - 1;
    [idx - 1, idx + 1].forEach(function(j){ if (typeof sl[j] === "string") { var im = new Image(); im.src = sl[j]; } });
  };
  var open = function(key, from, at){
    cur = GAL[key]; if (!cur) return;
    back = from; lbT.textContent = tr(cur.t);
    lb.hidden = false; document.body.classList.add("lb-open");
    show(at || 0); lbX.focus();
  };
  var close = function(){
    lb.hidden = true; document.body.classList.remove("lb-open"); lbImg.removeAttribute("src");
    if (back) back.focus();
  };
  document.addEventListener("click", function(e){
    var b = e.target.closest && e.target.closest(".gal-btn");
    if (b) { e.preventDefault(); open(b.dataset.gal, b, +(b.dataset.at || 0)); return; }
    var ci = e.target.closest && e.target.closest(".has-gal .cimg");
    if (ci) { var gb = ci.querySelector(".gal-btn"); open(gb.dataset.gal, gb, +(gb.dataset.at || 0)); }
  });
  lbPrev.addEventListener("click", function(){ show(idx - 1); });
  lbNext.addEventListener("click", function(){ show(idx + 1); });
  lbX.addEventListener("click", close);
  lb.addEventListener("click", function(e){ if (e.target === lb || e.target.classList.contains("lb-stage")) close(); });
  document.addEventListener("keydown", function(e){
    if (lb.hidden) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowLeft") show(idx - 1);
    else if (e.key === "ArrowRight") show(idx + 1);
  });
  var tx = null;
  lb.addEventListener("touchstart", function(e){ tx = e.touches[0].clientX; }, {passive:true});
  lb.addEventListener("touchend", function(e){
    if (tx == null) return; var dx = e.changedTouches[0].clientX - tx; tx = null;
    if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
  }, {passive:true});
}

/* ---------------- СЛАЙД-ШОУ В КАРТОЧКЕ ----------------
   Наведение (на телефоне - карточка в кадре) листает фото машины прямо в карточке:
   полоски сверху, клик открывает галерею на текущем кадре. Лёгкие копии - assets/img/g/s/. */
var HOVER = matchMedia("(hover:hover) and (pointer:fine)").matches;
var STEP = 1600;
document.querySelectorAll(".gal-btn").forEach(function(b){
  var g = GAL[b.dataset.gal]; if (!g) return;
  var card = b.closest(".card"), ci = b.parentNode;
  card.classList.add("has-gal");
  var src = g.s.filter(function(x){ return typeof x === "string"; });
  var cs = document.createElement("div"); cs.className = "cs"; cs.setAttribute("aria-hidden", "true");
  var bars = document.createElement("div"); bars.className = "cbars"; bars.setAttribute("aria-hidden", "true");
  src.forEach(function(){ bars.appendChild(document.createElement("i")); });
  var hint = document.createElement("span"); hint.className = "chint"; hint.setAttribute("data-i", "g.hint"); hint.textContent = tr("g.hint") || "Нажмите - откроется галерея";
  ci.appendChild(cs); ci.appendChild(bars); ci.appendChild(hint);
  var imgs = [], i = 0, t = null, built = false;
  function build(){
    if (built) return; built = true;
    src.forEach(function(p){ var im = new Image(); im.alt = ""; im.decoding = "async"; im.src = p.replace("/g/", "/g/s/"); cs.appendChild(im); imgs.push(im); });
  }
  function paint(){
    imgs.forEach(function(im, k){ im.classList.toggle("on", k === i); });
    [].forEach.call(bars.children, function(el, k){
      el.classList.remove("run"); el.classList.toggle("done", k < i);
    });
    var cur = bars.children[i]; void cur.offsetWidth; cur.style.setProperty("--dur", STEP + "ms"); cur.classList.add("run");
    b.dataset.at = i;
  }
  function tick(){ i = (i + 1) % src.length; paint(); }
  function start(){
    if (RED || t) return; build(); card.classList.add("play");
    i = src.length > 1 ? 1 : 0; paint(); t = setInterval(tick, STEP);
  }
  function stop(){
    clearInterval(t); t = null; card.classList.remove("play");
    imgs.forEach(function(im){ im.classList.remove("on"); }); b.dataset.at = 0;
  }
  if (HOVER) { ci.addEventListener("mouseenter", start); ci.addEventListener("mouseleave", stop); }
  else if ("IntersectionObserver" in window) {
    new IntersectionObserver(function(es){ es.forEach(function(e){ e.isIntersecting ? start() : stop(); }); }, {threshold: .7}).observe(ci);
  }
});
})();
