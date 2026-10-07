/* ============================================================
   CARLINE - герой: белая Toyota Camry 80 в студии.
   three.js (jsdelivr): лак с бликами софтбоксов (своё окружение через PMREM),
   мокрый зеркальный пол (Reflector + затемнение к краям), контровой свет,
   красная полоса студии отражается в кузове, горят задние фонари.
   Машина медленно вращается; вне экрана и во вкладке в фоне рендер стоит.
   Модель: «toyota camry v80» by s122, CC BY 4.0 (подпись в подвале).
   ============================================================ */
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { Reflector } from "three/addons/objects/Reflector.js";

const box = document.getElementById("stage3d");
const RED = matchMedia("(prefers-reduced-motion: reduce)").matches;
const SNAP = /[?&]snap=1/.test(location.search);           /* служебно: кадр для постера */
const BG = 0x000000;                                         /* чистый чёрный: пол и фон без шва на горизонте */

const renderer = new THREE.WebGLRenderer({ antialias: !matchMedia("(max-width:760px)").matches || (devicePixelRatio || 1) < 2, alpha: false, preserveDrawingBuffer: SNAP, powerPreference: "high-performance" });
renderer.setClearColor(BG, 1);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.outputColorSpace = THREE.SRGBColorSpace;
box.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(BG);
scene.fog = new THREE.Fog(BG, 16, 34);
const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);

/* ---------- студия для отражений: тёмная комната, софтбоксы, красная полоса ---------- */
function studioEnv(){
  const s = new THREE.Scene();
  s.background = new THREE.Color(0x141518);                  /* тёмные стены: между софтбоксами на белом лаке тёмные полосы */
  const strip = (w, h, color, k, pos, rot) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(k), side: THREE.DoubleSide }));
    m.position.set(...pos); m.rotation.set(...rot); s.add(m);
  };
  strip(14, 3.2, 0xffffff, 9, [0, 7, 0], [Math.PI / 2, 0, 0]);          /* длинный софтбокс над машиной */
  strip(14, 1.0, 0xffffff, 4, [0, 6.6, 3.2], [Math.PI / 2, 0, 0]);
  strip(14, 1.0, 0xffffff, 4, [0, 6.6, -3.2], [Math.PI / 2, 0, 0]);
  strip(1.6, 6, 0xffffff, 3, [-9, 2.6, 0], [0, Math.PI / 2, 0]);       /* боковые стойки */
  strip(1.6, 6, 0xffffff, 2.2, [9, 2.6, 0], [0, -Math.PI / 2, 0]);
  strip(16, 0.45, 0xe3172f, 3, [0, 0.9, -9], [0, 0, 0]);                /* красная полоса - бренд в бликах */
  strip(6, 3, 0xffffff, 1.2, [0, 2.5, 9], [0, Math.PI, 0]);             /* мягкий фронт */
  const pm = new THREE.PMREMGenerator(renderer);
  const tex = pm.fromScene(s, 0.02).texture;
  pm.dispose();
  return tex;
}
scene.environment = studioEnv();

/* ---------- свет: ключ сверху, холодный контр сзади, красный контр сбоку ---------- */
const key = new THREE.SpotLight(0xffffff, 260, 30, Math.PI / 5, 0.7, 1.2);
key.position.set(1.5, 9, 3); scene.add(key, key.target);
const rimR = new THREE.PointLight(0xe3172f, 16, 12, 1.6); rimR.position.set(-4.5, 1.2, -4); scene.add(rimR);
const rimW = new THREE.PointLight(0xe8eef8, 18, 14, 1.6); rimW.position.set(4.5, 2.2, -4); scene.add(rimW);
scene.add(new THREE.HemisphereLight(0xf2f2f0, 0x101012, 1.1));
const fill = new THREE.DirectionalLight(0xffffff, 1.3); fill.position.set(2, 3, 8); scene.add(fill);

/* ---------- мокрый пол: зеркало + затемнение к краям ---------- */
const MOB = matchMedia("(max-width:760px)").matches;
const RT = MOB ? 384 : 640;                                       /* отражение под затемнением: высокое разрешение не видно, а стоит кадров */
const mirror = new Reflector(new THREE.CircleGeometry(40, 64), {
  textureWidth: RT, textureHeight: RT, color: 0x6a6a6a, clipBias: 0.003
});
mirror.rotation.x = -Math.PI / 2; scene.add(mirror);
const fadeTex = (() => {
  const c = document.createElement("canvas"); c.width = c.height = 256;
  const g = c.getContext("2d"), r = g.createRadialGradient(128, 128, 10, 128, 128, 128);
  r.addColorStop(0, "rgba(0,0,0,0.6)"); r.addColorStop(0.14, "rgba(0,0,0,0.74)"); r.addColorStop(0.3, "rgba(0,0,0,0.94)"); r.addColorStop(0.4, "rgba(0,0,0,1)");
  g.fillStyle = r; g.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
})();
const veil = new THREE.Mesh(new THREE.CircleGeometry(40, 64), new THREE.MeshBasicMaterial({ map: fadeTex, transparent: true, depthWrite: false, fog: false }));
veil.rotation.x = -Math.PI / 2; veil.position.y = 0.002; scene.add(veil);
/* красный разлив света на полу под машиной */
const glowTex = (() => {
  const c = document.createElement("canvas"); c.width = c.height = 128;
  const g = c.getContext("2d"), r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  r.addColorStop(0, "rgba(227,23,47,0.55)"); r.addColorStop(0.5, "rgba(200,16,46,0.16)"); r.addColorStop(1, "rgba(200,16,46,0)");
  g.fillStyle = r; g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
})();
const glow = new THREE.Mesh(new THREE.PlaneGeometry(9, 5), new THREE.MeshBasicMaterial({ map: glowTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }));
glow.rotation.x = -Math.PI / 2; glow.position.set(0, 0.004, -0.6); scene.add(glow);

/* ---------- машина ---------- */
const turn = new THREE.Group(); scene.add(turn);
const draco = new DRACOLoader().setDecoderPath("https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/libs/draco/gltf/");
const loader = new GLTFLoader().setDRACOLoader(draco);
const SRC = box.dataset.src;

/* панели кузова в модели вывернуты (видна обратная сторона): без лака three это прощает,
   а лак на обратной стороне гасит белый. Разворачиваем треугольники и нормали наружу. */
function flip(g){
  const ix = g.index;
  if (ix) for (let i = 0; i < ix.count; i += 3) { const t = ix.getX(i + 1); ix.setX(i + 1, ix.getX(i + 2)); ix.setX(i + 2, t); }
  const nr = g.attributes.normal;
  if (nr) for (let i = 0; i < nr.count; i++) nr.setXYZ(i, -nr.getX(i), -nr.getY(i), -nr.getZ(i));
  if (ix) ix.needsUpdate = true; if (nr) nr.needsUpdate = true;
}

loader.load(SRC, (gltf) => {
  const car = gltf.scene;
  car.traverse((o) => {
    if (!o.isMesh) return;
    const n = o.material && o.material.name;
    if (n === "BODY.001") {
      flip(o.geometry);
      o.material = new THREE.MeshPhysicalMaterial({
        name: n, color: 0xf4f4f2, metalness: 0.0, roughness: 0.07,
        ior: 1.5, specularIntensity: 1, envMapIntensity: 1.5, side: THREE.DoubleSide
        /* лаковый глянец даёт низкая шероховатость: clearcoat на этой модели гасит белый в серый */
      });
    } else if (o.material) {
      o.material.envMapIntensity = 1.1;
      if (o.material.transmission) {                             /* стёкла без преломления: transmission = лишний проход сцены каждый кадр */
        o.material.transmission = 0; o.material.transparent = true; o.material.opacity = 0.42;
        o.material.roughness = 0.02; o.material.depthWrite = false;
      }
      if (/LED|RGLASS|SIGNALS/.test(n)) {                       /* фонари светятся */
        o.material.emissive = new THREE.Color(/SIGNALS/.test(n) ? 0xff8a1e : 0xff2236);
        o.material.emissiveIntensity = /RGLASS/.test(n) ? 1.4 : 2.2;
      }
    }
  });
  /* центр и масштаб: длина машины 4.8 */
  let b = new THREE.Box3().setFromObject(car, true);   /* точно по вершинам: у квантованной модели рамки мешей врут */
  const size = b.getSize(new THREE.Vector3());
  car.scale.multiplyScalar(4.8 / Math.max(size.x, size.z));   /* у корня модели свой масштаб - умножаем, не затираем */
  car.updateMatrixWorld(true);
  b = new THREE.Box3().setFromObject(car, true);
  const c = b.getCenter(new THREE.Vector3());
  car.position.x -= c.x; car.position.z -= c.z; car.position.y -= b.min.y;
  turn.add(car);
  turn.rotation.y = -0.62;
  renderer.compile(scene, camera);                               /* шейдеры заранее - без рывка на первом обороте */
  box.classList.add("ready");
  window.__dims = [size.x, size.y, size.z].map((v) => v.toFixed(2)).join("x");
  draw();
  if (SNAP) { renderer.render(scene, camera); window.__snap = renderer.domElement.toDataURL("image/webp", 0.86); }
});

/* ---------- кадр: на десктопе машина правее центра, на телефоне по центру ---------- */
function frame(){
  const w = box.clientWidth, h = box.clientHeight;
  const dpr = Math.min(devicePixelRatio || 1, w < 760 ? 1.5 : 1.5);
  renderer.setPixelRatio(dpr); renderer.setSize(w, h, false);
  camera.aspect = w / h;
  const mob = w / h < 1;
  camera.fov = mob ? 30 : 26;
  const dist = mob ? 20 : 11.6;
  camera.position.set(0, mob ? 2.6 : 1.35, dist);
  camera.lookAt(0, mob ? 0.2 : 0.75, 0);
  /* сдвиг кадра без перспективных искажений: машина уходит вправо, слева место под текст */
  if (mob) camera.clearViewOffset();
  else camera.setViewOffset(w, h, -w * 0.16, h * 0.03, w, h);
  camera.updateProjectionMatrix();
}

let on = true, last = 0, raf = 0;
function draw(){ renderer.render(scene, camera); }
function loop(t){
  raf = 0;
  if (!on) return;
  const dt = last ? Math.min(0.05, (t - last) / 1000) : 0; last = t;
  if (!RED) turn.rotation.y -= dt * 0.22;
  draw();
  raf = requestAnimationFrame(loop);
}
function play(){ if (!raf && !RED && !SNAP) { last = 0; raf = requestAnimationFrame(loop); } }
function stop(){ if (raf) cancelAnimationFrame(raf); raf = 0; }

frame();
addEventListener("resize", () => { frame(); draw(); });
new IntersectionObserver((es) => { on = es[0].isIntersecting && !document.hidden; on ? play() : stop(); }, { threshold: 0.05 }).observe(box);
document.addEventListener("visibilitychange", () => { on = !document.hidden; on ? play() : stop(); });
if (RED) draw(); else play();
window.hero3d = { stop, play, draw, scene, camera, turn };
