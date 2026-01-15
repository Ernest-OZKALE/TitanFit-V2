/**
 * TitanFit V2 - Enhanced Service Worker
 * Advanced caching strategies for optimal performance
 */

const CACHE_VERSION = 'v2';
const STATIC_CACHE = `titanfit-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `titanfit-dynamic-${CACHE_VERSION}`;
const API_CACHE = `titanfit-api-${CACHE_VERSION}`;
const IMAGE_CACHE = `titanfit-images-${CACHE_VERSION}`;

// Static assets to pre-cache (App Shell)
const PRECACHE_ASSETS = [
    '/',
    '/offline.html',
    '/manifest.json',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
];

// Cache limits
const CACHE_LIMITS = {
    dynamic: 50,
    api: 100,
    images: 100,
};

// ============================================
// INSTALL EVENT - Pre-cache essential assets
// ============================================
self.addEventListener('install', (event) => {
    console.log('[SW] Installing...');
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('[SW] Pre-caching app shell');
                return cache.addAll(PRECACHE_ASSETS);
            })
            .then(() => self.skipWaiting())
    );
});

// ============================================
// ACTIVATE EVENT - Clean old caches
// ============================================
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating...');
    const currentCaches = [STATIC_CACHE, DYNAMIC_CACHE, API_CACHE, IMAGE_CACHE];

    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (!currentCaches.includes(cacheName)) {
                            console.log('[SW] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => self.clients.claim())
    );
});

// ============================================
// FETCH EVENT - Smart caching strategies
// ============================================
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') return;

    // Skip chrome extensions and other non-http
    if (!url.protocol.startsWith('http')) return;

    // Strategy selection based on request type
    if (isApiRequest(url)) {
        event.respondWith(staleWhileRevalidate(request, API_CACHE));
    } else if (isImageRequest(url)) {
        event.respondWith(cacheFirst(request, IMAGE_CACHE));
    } else if (isStaticAsset(url)) {
        event.respondWith(cacheFirst(request, STATIC_CACHE));
    } else if (isPageRequest(request)) {
        event.respondWith(networkFirst(request, DYNAMIC_CACHE));
    } else {
        event.respondWith(networkFirst(request, DYNAMIC_CACHE));
    }
});

// ============================================
// CACHING STRATEGIES
// ============================================

/**
 * Cache First - Serve from cache, fallback to network
 * Best for: Static assets, images, fonts
 */
async function cacheFirst(request, cacheName) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }

    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.log('[SW] Cache first failed:', error);
        return caches.match('/offline.html');
    }
}

/**
 * Network First - Try network, fallback to cache
 * Best for: HTML pages, dynamic content
 */
async function networkFirst(request, cacheName) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
            trimCache(cacheName, CACHE_LIMITS.dynamic);
        }
        return networkResponse;
    } catch (error) {
        console.log('[SW] Network first - serving from cache');
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        // Return offline page for navigation requests
        if (request.mode === 'navigate') {
            return caches.match('/offline.html');
        }
        throw error;
    }
}

/**
 * Stale While Revalidate - Serve stale, update in background
 * Best for: API responses, frequently changing data
 */
async function staleWhileRevalidate(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);

    // Fetch fresh response in background
    const fetchPromise = fetch(request)
        .then((networkResponse) => {
            if (networkResponse.ok) {
                cache.put(request, networkResponse.clone());
                trimCache(cacheName, CACHE_LIMITS.api);
            }
            return networkResponse;
        })
        .catch((error) => {
            console.log('[SW] Background fetch failed:', error);
            return null;
        });

    // Return cached response immediately, or wait for network
    if (cachedResponse) {
        return cachedResponse;
    }

    const networkResponse = await fetchPromise;
    if (networkResponse) {
        return networkResponse;
    }

    // Return error response if both fail
    return new Response(JSON.stringify({ error: 'Offline' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
    });
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function isApiRequest(url) {
    return url.pathname.startsWith('/api/');
}

function isImageRequest(url) {
    return url.pathname.match(/\.(jpg|jpeg|png|gif|svg|webp|ico)$/i) ||
        url.hostname.includes('unsplash.com') ||
        url.hostname.includes('supabase.co');
}

function isStaticAsset(url) {
    return url.pathname.match(/\.(js|css|woff|woff2|ttf|eot)$/i) ||
        url.pathname.startsWith('/_next/static/');
}

function isPageRequest(request) {
    return request.mode === 'navigate' ||
        request.headers.get('accept')?.includes('text/html');
}

/**
 * Trim cache to limit
 */
async function trimCache(cacheName, maxItems) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();

    if (keys.length > maxItems) {
        // Delete oldest entries (FIFO)
        const toDelete = keys.slice(0, keys.length - maxItems);
        await Promise.all(toDelete.map(key => cache.delete(key)));
    }
}

// ============================================
// BACKGROUND SYNC - Offline data sync
// ============================================
self.addEventListener('sync', (event) => {
    console.log('[SW] Background sync:', event.tag);

    if (event.tag === 'sync-workouts') {
        event.waitUntil(syncData('workouts'));
    }
    if (event.tag === 'sync-meals') {
        event.waitUntil(syncData('meals'));
    }
    if (event.tag === 'sync-progress') {
        event.waitUntil(syncData('progress'));
    }
});

async function syncData(type) {
    console.log(`[SW] Syncing ${type}...`);
    // In production: Get pending data from IndexedDB and POST to API
    // This is a placeholder for the sync logic
    try {
        // const pendingData = await getFromIndexedDB(type);
        // await fetch(`/api/${type}`, { method: 'POST', body: JSON.stringify(pendingData) });
        // await clearFromIndexedDB(type);
        console.log(`[SW] ${type} synced successfully`);
    } catch (error) {
        console.error(`[SW] ${type} sync failed:`, error);
        throw error; // Will retry
    }
}

// ============================================
// PUSH NOTIFICATIONS
// ============================================
self.addEventListener('push', (event) => {
    console.log('[SW] Push received');

    let data = { title: 'TitanFit', body: 'Nouvelle notification' };

    if (event.data) {
        try {
            data = event.data.json();
        } catch {
            data.body = event.data.text();
        }
    }

    const options = {
        body: data.body,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            url: data.url || '/dashboard',
            dateOfArrival: Date.now(),
        },
        actions: [
            { action: 'view', title: 'Voir', icon: '/icons/check.png' },
            { action: 'dismiss', title: 'Ignorer', icon: '/icons/x.png' },
        ],
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

self.addEventListener('notificationclick', (event) => {
    console.log('[SW] Notification clicked');
    event.notification.close();

    if (event.action === 'dismiss') return;

    const urlToOpen = event.notification.data?.url || '/dashboard';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((clientList) => {
                // Focus existing window if open
                for (const client of clientList) {
                    if (client.url.includes(self.location.origin) && 'focus' in client) {
                        client.navigate(urlToOpen);
                        return client.focus();
                    }
                }
                // Open new window
                return clients.openWindow(urlToOpen);
            })
    );
});

console.log('[SW] TitanFit Service Worker loaded');
