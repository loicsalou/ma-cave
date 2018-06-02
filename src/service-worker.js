/**
 * Check out https://googlechrome.github.io/sw-toolbox/docs/master/index.html for
 * more info on how to use sw-toolbox to custom configure your service worker.
 */
'use strict';
importScripts('workbox-3.2.0/workbox-sw.js');

self.addEventListener('install', (event) => {
  console.log('install:' + event);
})

self.addEventListener('fetch', (event) => {
})

self.addEventListener('activate', (event) => {
  console.log('activate:' + event);
})

workbox.setConfig({
  debug: false,
  modulePathPrefix: 'workbox-3.2.0/'
});
workbox.skipWaiting();
workbox.clientsClaim();
workbox.precaching.precacheAndRoute([]);
