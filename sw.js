// 有網路：抓最新版並存起來；沒網路：用存好的版本
const CACHE = 'gamebox-v42';
const FILES = ['./', 'index.html', '2048.html', 'jump.html', 'runner.html', 'meow.html', 'army.html', 'wuxia.html', 'baseball.html', 'basketball.html', 'cook.html', 'flow.html', 'air.html', 'stock.html', 'xian.html', 'douluo.html', 'slime.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request, { cache: 'no-cache' }).catch(() => fetch(e.request)).then(r => {
      if (r && r.ok) { const cp = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); return r; }
      return caches.match(e.request, { ignoreSearch: true }).then(m => m || r);
    }).catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
