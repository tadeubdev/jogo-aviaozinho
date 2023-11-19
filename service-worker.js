self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open('helicopter-game-tadeu').then(function(cache) {
      return cache.addAll(['./assets','./favicon.ico','./index.html','./manifest.json',
      'assets/audio','assets/css','assets/fonts','assets/img','assets/js',
      'assets/prints','assets/audio/helicopter.mp3','assets/audio/laser.wav',
      'assets/audio/level-failed.mp3','assets/css/style.css',
      'assets/fonts/Poppins-Medium.ttf','assets/fonts/Poppins-SemiBold.ttf',
      'assets/img/cloud.png','assets/img/grass.png','assets/img/helicopter.png',
      'assets/img/helicopter_1.png','assets/img/helicopter_2.png',
      'assets/img/helicopter_3.png','assets/img/helicopter_4.png',
      'assets/img/helicopter_5.png','assets/img/helicopter_6.png',
      'assets/img/helicopter_7.png','assets/img/helicopter_8.png',
      'assets/js/clouds.js','assets/js/floor.js','assets/js/helicopter.js','assets/js/profile.js','assets/js/score.js','assets/js/script.js','assets/js/shoot.js','assets/prints/print-001.png']);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});