// 有網路：抓最新版並存起來；沒網路：用存好的版本
const CACHE = 'gamebox-v80';
const FILES = ['./', 'index.html', '2048.html', 'jump.html', 'runner.html', 'meow.html', 'army.html', 'wuxia.html', 'baseball.html', 'basketball.html', 'cook.html', 'flow.html', 'air.html', 'stock.html', 'xian.html', 'douluo.html', 'slime.html', 'gong.html', 'xiaowu.html', 'zhuyu.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  // 音樂、影片不要經過快取（手機分段讀取音檔時，經過快取會播不出來）
  if (e.request.headers.has('range') || /\.(mp3|m4a|ogg|wav|mp4)(\?|$)/i.test(e.request.url)) return;
  e.respondWith(
    fetch(e.request, { cache: 'no-cache' }).catch(() => fetch(e.request)).then(r => {
      if (r && r.ok) { const cp = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); return r; }
      return caches.match(e.request, { ignoreSearch: true }).then(m => m || r);
    }).catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
