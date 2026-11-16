/**
 * Service Worker for Baffoe Kwabena Portfolio & Studio CMS PWA
 * Version: 1.1.0
 */

const CACHE_NAME = "baffoe-art-v2";

const PRECACHE_ASSETS = [
  "/",
  "/index.html",
  "/index-studio-multipage.html",
  "/index-studio-onepage.html",
  "/works.html",
  "/admin.html",
  "/manifest.json",
  "/admin-manifest.json",
  "/css/plugins.css",
  "/css/main.css",
  "/css/loader.css",
  "/js/libs.min.js",
  "/js/app.js",
  "/img/favicon/favicon.ico",
  "/img/favicon/pwa-192.png",
  "/img/favicon/pwa-512.png",
  "/img/favicon/pwa-maskable-512.png",
  "/img/favicon/apple-touch-icon.png",
  "/js/firebase-config.js",
  "/js/dynamic-artworks.js"
];

// Install: Cache core app shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn("[PWA SW] Precache partial note:", err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate: Clean up older caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Network-first for HTML navigation, Cache-first / Stale-while-revalidate for assets
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET and cross-origin Firebase APIs (let them fetch over network)
  if (
    event.request.method !== "GET" ||
    url.hostname.includes("firestore.googleapis.com") ||
    url.hostname.includes("identitytoolkit.googleapis.com") ||
    url.hostname.includes("securetoken.googleapis.com")
  ) {
    return;
  }

  // For HTML requests: Network first, fallback to cached HTML
  if (event.request.mode === "navigate" || event.request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => {
          return caches.match(event.request).then((cached) => {
            if (cached) return cached;
            if (url.pathname.includes("admin")) {
              return caches.match("/admin.html");
            }
            return caches.match("/") || caches.match("/index.html");
          });
        })
    );
    return;
  }

  // For static assets: Stale-while-revalidate
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
