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
  "m.desc":"Self-drive car rental in Astana: 8 sedans and a crossover from 15,000 KZT per day. Minimal deposit, clean and serviced cars, delivery across the city, WhatsApp reply within 5 minutes. Open 24/7.",
  "m.ogt":"Carline Autorent - self-drive car rental in Astana",
  "a.menu":"Menu","a.home":"Carline Autorent - home","a.nav":"Sections","a.lang":"Site language","a.call":"Call","a.mnav":"Mobile menu",
  "a.hero":"Self-drive car rental in Astana","a.reel":"Cars in the fleet","a.ek":"Economy class","a.ko":"Comfort class","a.bi":"Business class","a.su":"SUV","a.park":"Fleet and prices","a.filter":"Filter by class","a.dost":"Car delivery across the city","a.usl":"Rental terms","a.kak":"How to rent","a.faq":"FAQ","a.zay":"Booking request","a.kont":"Contacts","a.bar":"Quick contact",
  "n.park":"Fleet","n.usl":"Terms","n.dost":"Delivery","n.kak":"How to rent","n.faq":"FAQ","n.kont":"Contacts",
  "mn.ek":"Economy","mn.ko":"Comfort","mn.bi":"Business","mn.su":"SUV",
  "b.wa":"Message on WhatsApp","b.call":"Call","b.book":"Book now","b.cars":"Cars in this class","b.bookwa":"Book on WhatsApp",
  "w.from":"from","w.day":"KZT / day","w.cur":"","w.curf":"",
  "h.kw":"Car rental in Astana",
  "h.l1":"Like your own.","h.l2":"Minus the hassle.",
  "h.lead":"8 cars from 15,000 KZT per day. Minimal deposit, delivery across the city, WhatsApp reply within 5 minutes.",
  "h.b1":"Book on WhatsApp","h.b2":"Choose a car","h.ig":"Our fleet on Instagram",
  "c1.k":"Economy","c1.h":"Chevrolet Cobalt 2026","c1.l":"For the city and errands: affordable, economical, always clean.",
  "c2.k":"Comfort","c2.h":"Hyundai Elantra and Toyota Camry 55","c2.l":"Comfortable sedans for every day, meetings and family trips.",
  "c3.k":"Business","c3.h":"Toyota Camry 70, Kia K5 and Camry 80","c3.l":"Executive sedans for business trips, meetings and events.",
  "c4.k":"SUV","c4.h":"Hyundai Santa Fe","c4.l":"A spacious crossover for the family, city guests and trips out of town.",
  "p.k":"Fleet","p.h":"Choose your car","p.l":"Pick the rental period above the price - the price updates. Tap \"Book\" - WhatsApp opens with the car and the period.",
  "f.all":"All","f.ek":"Economy","f.ko":"Comfort","f.bi":"Business","f.su":"SUV",
  "ph.t":"Car photo",
  "car.cobalt":"Chevrolet Cobalt","car.elantra":"Hyundai Elantra","car.camry55":"Toyota Camry 55","car.camry70p":"Toyota Camry 70 Prestige","car.camry70l":"Toyota Camry 70 Luxe","car.k5":"Kia K5","car.camry80":"Toyota Camry 80","car.santafe":"Hyundai Santa Fe",
  "s.cobalt":"2026 · sedan · 5 seats","s.elantra":"2024 · Luxe (full) · 1.5 L","s.camry55":"N4 · sedan · 5 seats","s.camry70p":"Prestige · sedan · 5 seats","s.camry70l":"Luxe · sedan · 5 seats","s.k5":"2022 · Full · sedan · 5 seats","s.camry80":"Prestige · sedan · 5 seats","s.santafe":"Full · crossover · all-wheel drive",
  "p.note":"Prices in tenge, depending on the rental period. Deposit and extension terms - ask the manager on WhatsApp.",
  "n1":"cars in the fleet","n2":"when renting from 16 days","t.2":"2-4 days","t.5":"5-15 days","t.16":"16-30 days","n3m":"min","n3":"WhatsApp reply time","n4":"no days off",
  "d.k":"Delivery","d.h":"We bring the car to your address","d.l":"Send us the address and a convenient time - we arrive with the car, sign the contract on the spot and hand over the keys.",
  "d.b":"Order delivery","dp.city":"Across the city","dp.air":"To the airport","dp.u":"KZT","dp.u2":"KZT","d.b2":"Rental terms",
  "u.k":"Terms","u.h":"What you need to rent","u.l":"The essentials in short. Exact amounts and requirements for your car - from the manager on WhatsApp.",
  "u1.h":"Documents","u1.t":"ID and a driving licence. Full list - from the manager.",
  "u2.h":"Deposit","u2.t":"Among the lowest on the market. Depends on the car - confirmed at booking.",
  "u3.h":"Age and experience","u3.t":"Age and driving experience requirements - ask the manager.",
  "u4.h":"Rental period","u4.t":"From one day. Extensions are arranged at the office - let the manager know in advance.",
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
  "q4.q":"Can I extend the rental?","q4.a":"Yes, if the car is free. Let the manager know on WhatsApp before the term ends and come to the office - the extension is arranged on the spot.",
  "q5.q":"In what condition are the cars?","q5.a":"Clean inside and out, fully serviced. Please return the car in the same condition.",
  "z.k":"Booking","z.h":"Book a car","z.l":"Fill in three fields - the request opens in your WhatsApp, the manager replies within 5 minutes.",
  "f.car":"Car","f.any":"Pick one for me","f.from":"Pickup date","f.to":"Return date","f.name":"Name","f.nameph":"How should we address you","f.phone":"Phone","f.send":"Send on WhatsApp",
  "f.err":"Enter your phone so we can reply.","f.ok":"Thank you! Opening WhatsApp with your request - if the window did not appear, message us directly.",
  "f.note":"The request goes to the manager on WhatsApp. No robot calls or mailings.",
  "kt.k":"Contacts","kt.h":"Message or call us","kt.l":"We work 24/7, no days off. Office - Rakymzhan Koshkarbayev Avenue, 10/1, Astana.",
  "kt.hrs":"24/7, no days off","kt.2gis":"We are on 2GIS","kt.addr":"Rakymzhan Koshkarbayev Ave., 10/1, Astana","kt.map":"Map: Carline Autorent, Koshkarbayev 10/1","kt.route":"Route on 2GIS",
  "ft.d":"Self-drive car rental in Astana.",
  "al.hero":"Black Toyota Camry 70 by Carline Autorent with headlights on at night","al.ek":"White Chevrolet Cobalt 2026 by Carline Autorent in a parking garage","al.ko":"White Hyundai Elantra 2024 by Carline Autorent in the city","al.bi":"Black Toyota Camry 70 Prestige by Carline Autorent in a parking garage","al.su":"Grey Hyundai Santa Fe by Carline Autorent, rear view","al.dost":"Airport terminal at night - car delivery to your flight",
  "al.elantra":"White Hyundai Elantra 2024 by Carline Autorent","al.camry55":"Black Toyota Camry 55 by Carline Autorent with headlights on","al.camry70p":"Black Toyota Camry 70 Prestige by Carline Autorent in a parking garage","al.camry70l":"Black Toyota Camry 70 Luxe by Carline Autorent by a building in the evening","al.camry80":"Black Toyota Camry 80 by Carline Autorent","al.cobalt":"White Chevrolet Cobalt 2026 by Carline Autorent","g.btn":"All photos","g.hint":"Click to open the gallery","g.soon":"Photo coming soon","g.s1":"Interior: front row","g.s2":"Interior: rear row","g.s3":"Trunk","g.aria":"Car photos","g.close":"Close","g.prev":"Previous photo","g.next":"Next photo","al.k5":"Grey Kia K5 in a parking garage","al.santafe":"Grey Hyundai Santa Fe by Carline Autorent, front view",
  "h.tg":"Message on Telegram","p.sl":"The longer the rental, the better the price","t.1":"1 day","w.tg":"KZT","a.term":"Rental period","a.sub":"Car sublease","n.sub":"Sublease","sb.k":"For car owners","sb.h":"Sublease your car to us","sb.l":"Your car works and earns, while we take care of clients, contracts and handovers.","sb1":"We find renters and hand over the car","sb2":"An official contract with the owner","sb3":"We keep an eye on the car's condition","sb.more":"Learn more","sb.wa":"Offer a car",
  "mq.list":"Chevrolet Cobalt|Hyundai Elantra|Toyota Camry 55|Toyota Camry 70|Kia K5|Toyota Camry 80|Hyundai Santa Fe|from 15,000 KZT per day|Delivery from 5,000 KZT"
};
var RU_MQ = "Chevrolet Cobalt|Hyundai Elantra|Toyota Camry 55|Toyota Camry 70|Kia K5|Toyota Camry 80|Hyundai Santa Fe|от 15 000 тг в сутки|Доставка от 5 000 тг";
if (window.PAGE_EN) Object.assign(EN, window.PAGE_EN);    /* английский текст отдельной страницы */
var I18N = {en: EN};
var RU = {};                                       /* снимок русского текста из разметки */

/* ---------------- WHATSAPP: текст по кнопке ----------------
   data-wa="general|class|car|delivery"; class и car берут название из data-wa-title (ключ i18n).
   Обработчик в фазе захвата на window - раньше трекера LeadBot, чтобы он дописал код к готовой ссылке. */
var WA_T = {
  ru:{general:"Здравствуйте! Пишу с сайта Carline Autorent. Хочу арендовать автомобиль.", "class":"Здравствуйте! Пишу с сайта Carline Autorent. Интересует класс:\n{name}\nПодскажите, какие машины свободны и условия.", car:"Здравствуйте! Пишу с сайта Carline Autorent. Хочу забронировать:\n{name}\nДаты аренды: ", delivery:"Здравствуйте! Пишу с сайта Carline Autorent. Хочу арендовать машину с доставкой.\nМашина:\nАдрес:\nДата и время:", sub:"Здравствуйте! Пишу с сайта Carline Autorent. Хочу сдать машину в субаренду.\nМарка, модель, год:\nПробег:", term:"Срок: "},
  en:{general:"Hello! I'm writing from the Carline Autorent website. I'd like to rent a car.", "class":"Hello! I'm writing from the Carline Autorent website. I'm interested in the class:\n{name}\nWhich cars are available and on what terms?", car:"Hello! I'm writing from the Carline Autorent website. I'd like to book:\n{name}\nRental dates: ", delivery:"Hello! I'm writing from the Carline Autorent website. I'd like to rent a car with delivery.\nCar:\nAddress:\nDate and time:", sub:"Hello! I'm writing from the Carline Autorent website. I'd like to sublease my car to you.\nMake, model, year:\nMileage:", term:"Period: "}
};
function tr(key){
  var L = curLang(), d = I18N[L];
  return (d && d[key]) || RU[key] || "";
}
function waText(kind, titleKey, termKey){
  var L = curLang(), T = WA_T[L] || WA_T.ru;
  if (L === "kk" && window.SITE_KK && window.SITE_KK.__wa) T = window.SITE_KK.__wa;
  var t = T[kind] || T.general;
  if (titleKey) t = t.replace("{name}", tr(titleKey));
  if (kind === "car" && termKey) t = t.replace(/\n([^\n]*)$/, "\n" + (T.term || "Срок: ") + tr(termKey) + "\n$1");
  return t;
}
window.addEventListener("click", function(e){
  var a = e.target.closest ? e.target.closest("a[href]") : null;
  if (!a) return;
  var h = a.getAttribute("href") || "";
  if (a.dataset.wa) {
    var cd = a.closest(".card");
    a.href = "https://wa.me/" + WA + "?text=" + encodeURIComponent(waText(a.dataset.wa, a.dataset.waTitle, cd && cd.dataset.term));
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
function addScript(src, cb){
  var s = document.createElement("script");
  s.src = src + (ASSET_V ? "?v=" + ASSET_V : "");
  s.onload = s.onerror = function(){ cb(); };
  document.head.appendChild(s);
}
/* у отдельной страницы свой словарь: <body data-kk="subarenda"> -> assets/lang/subarenda-kk.js (window.PAGE_KK) */
function loadLang(lang, done){
  if (I18N[lang] || lang !== "kk") return done();
  addScript("assets/lang/kk.js", function(){
    var page = document.body.dataset.kk;
    function fin(){
      if (window.SITE_KK) I18N.kk = Object.assign({}, window.SITE_KK, window.PAGE_KK || {});
      done();
    }
    page ? addScript("assets/lang/" + page + "-kk.js", fin) : fin();
  });
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

/* ---------------- ГЕРОЙ: БЕЛАЯ CAMRY 80 В 3D ----------------
   <model-viewer> (Google, с jsdelivr) подключаем после загрузки страницы: первым экраном
   стоит постер того же ракурса, модель 3 МБ не мешает загрузке. Медленно крутится сама,
   жестами не управляется (скролл на телефоне не перехватывает). Reduced motion - без вращения.
   Модель: «toyota camry v80» by s122, CC BY 4.0 (подпись в подвале), кузов перекрашен в белый. */
(function(){
  var mv = document.getElementById("mv"); if (!mv) return;
  if (RED) mv.removeAttribute("auto-rotate");
  mv.addEventListener("load", function(){ mv.classList.add("ready"); });
  function boot(){
    var s = document.createElement("script"); s.type = "module";
    s.src = "https://cdn.jsdelivr.net/npm/@google/model-viewer@4.0.0/dist/model-viewer.min.js";
    document.head.appendChild(s);
  }
  if (document.readyState === "complete") setTimeout(boot, 200);
  else addEventListener("load", function(){ setTimeout(boot, 200); });
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
  if (hid === "kak-arendovat") hid = "subarenda";                             /* блок шагов заменён субарендой 07.10.2026 */
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
RU["g.s1"] = "Салон: передний ряд"; RU["g.s2"] = "Салон: задний ряд"; RU["g.s3"] = "Багажник";
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

/* ---------------- АЛЬБОМ В КАРТОЧКЕ ----------------
   До 5 фото прямо в карточке: обложка + 4 кадра галереи (ALB - номера кадров в GAL[...].s).
   Стрелки и точки, свайп на телефоне, стрелки клавиатуры на фокусе. Клик по фото -
   галерея на этом кадре. Лёгкие копии - assets/img/g/s/. */
var ALB = {cobalt:[2,3,5,6], elantra:[2,3,5,6], camry55:[4,5,6,7], camry70p:[2,3,5,7], camry70l:[3,5,6,8], camry80:[3,5,6,8], santafe:[3,6,7,8]};
document.querySelectorAll(".gal-btn").forEach(function(b){
  var key = b.dataset.gal, g = GAL[key], picks = ALB[key]; if (!g || !picks) return;
  var card = b.closest(".card"), ci = b.parentNode, cover = ci.querySelector("img");
  card.classList.add("has-gal");
  var frames = [{src: null, at: 0}].concat(picks.map(function(n){
    var k = g.s.findIndex(function(x){ return x.indexOf("-" + n + ".webp") > 0; });
    return {src: g.s[k].replace("/g/", "/g/s/"), at: k};
  }));
  var alb = document.createElement("div"); alb.className = "alb";
  var dots = document.createElement("div"); dots.className = "alb-dots"; dots.setAttribute("aria-hidden", "true");
  var prev = document.createElement("button"), next = document.createElement("button");
  prev.type = next.type = "button"; prev.className = "alb-nav alb-prev"; next.className = "alb-nav alb-next";
  prev.setAttribute("data-i-aria", "g.prev"); next.setAttribute("data-i-aria", "g.next");
  prev.setAttribute("aria-label", tr("g.prev") || "Предыдущее фото"); next.setAttribute("aria-label", tr("g.next") || "Следующее фото");
  prev.innerHTML = next.innerHTML = '<svg width="18" height="18" aria-hidden="true"><use href="#ic-arr"/></svg>';
  frames.forEach(function(){ dots.appendChild(document.createElement("i")); });
  ci.appendChild(alb); ci.appendChild(dots); ci.appendChild(prev); ci.appendChild(next);
  var imgs = [], i = 0, built = false;
  function build(){
    if (built) return; built = true;
    frames.forEach(function(f, k){
      if (!k) { imgs.push(null); return; }
      var im = new Image(); im.alt = ""; im.decoding = "async"; im.src = f.src; alb.appendChild(im); imgs.push(im);
    });
  }
  function go(n){
    if (n !== 0) build();
    i = Math.max(0, Math.min(frames.length - 1, n));
    imgs.forEach(function(im, k){ if (im) im.classList.toggle("on", k === i); });
    [].forEach.call(dots.children, function(d, k){ d.classList.toggle("on", k === i); });
    prev.disabled = i === 0; next.disabled = i === frames.length - 1;
    b.dataset.at = frames[i].at;
  }
  prev.addEventListener("click", function(e){ e.stopPropagation(); go(i - 1); });
  next.addEventListener("click", function(e){ e.stopPropagation(); go(i + 1); });
  ci.addEventListener("mouseenter", build, {once: true});
  var tx = null;
  ci.addEventListener("touchstart", function(e){ tx = e.touches[0].clientX; build(); }, {passive: true});
  ci.addEventListener("touchend", function(e){
    if (tx == null) return; var dx = e.changedTouches[0].clientX - tx; tx = null;
    if (Math.abs(dx) > 40) { go(i + (dx < 0 ? 1 : -1)); ci.dataset.swiped = "1"; setTimeout(function(){ delete ci.dataset.swiped; }, 350); }
  }, {passive: true});
  ci.addEventListener("click", function(e){
    if (ci.dataset.swiped || e.target.closest(".alb-nav,.gal-btn")) return;
    b.click();
  });
  go(0);
});

/* ---------------- СРОК АРЕНДЫ НАД ЦЕНОЙ ----------------
   Переключатель 1 сутки / 2-4 / 5-15 / 16-30 дней пересчитывает цену карточки (data-p: 4 цены
   через запятую). Выбранный срок уходит в текст WhatsApp кнопки «Забронировать». */
function fmtPrice(n){ return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " "); }
document.querySelectorAll(".card .term").forEach(function(box){
  var card = box.closest(".card"), pr = card.querySelector(".cprice"), b = pr.querySelector("b");
  var P = pr.dataset.p.split(",");
  card.dataset.term = "t.1";
  [].forEach.call(box.children, function(btn, k){
    btn.addEventListener("click", function(){
      [].forEach.call(box.children, function(x, j){ x.classList.toggle("is-on", j === k); x.setAttribute("aria-pressed", j === k ? "true" : "false"); });
      card.dataset.term = btn.dataset.i;
      if (RED) { b.textContent = fmtPrice(P[k]); return; }
      pr.classList.add("flip");
      setTimeout(function(){ b.textContent = fmtPrice(P[k]); pr.classList.remove("flip"); }, 160);
    });
  });
});
})();
