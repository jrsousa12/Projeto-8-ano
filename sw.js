// Guarda o app no aparelho para abrir sem internet.
// A versão abaixo é recalculada sozinha (build/versao.py, rodado pelo GitHub a cada envio ao main).
const V = "animais-8ano-46435169";
const ARQ = ["./", "./index.html", "./style.css", "./tema-claro.css", "./util.js", "./dados.js", "./banco-proprio.js", "./app.js", "./extras.js", "./progresso.js", "./editor.html", "./editor.js", "./editor.css", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./icon-maskable-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(V).then(c => Promise.all(ARQ.map(u => c.add(new Request(u, { cache: "reload" })).catch(() => {})))).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(r => r || fetch(e.request).then(n => { if (n.ok) { const cp = n.clone(); caches.open(V).then(c => c.put(e.request, cp)); } return n; }).catch(() => caches.match("./index.html"))));
});
