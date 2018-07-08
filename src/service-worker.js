/**
 * Check out https://googlechrome.github.io/sw-toolbox/docs/master/index.html for
 * more info on how to use sw-toolbox to custom configure your service worker.
 */
'use strict';
importScripts('workbox-3.2.0/workbox-sw.js');
let deferredPrompt = undefined;

self.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
});

self.addEventListener('install', (event) => {
  console.log('install:' + event);
});

self.addEventListener('fetch', (event) => {
  // console.info('service worker fetched '+JSON.stringify(event));
});

self.addEventListener('activate', (event) => {
  console.log('activate:' + JSON.stringify(event));
});

workbox.setConfig({
  debug: false,
  modulePathPrefix: 'workbox-3.2.0/'
});
workbox.skipWaiting();
workbox.clientsClaim();
workbox.precaching.precacheAndRoute([]);
