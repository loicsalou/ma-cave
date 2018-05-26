module.exports = {
  "globDirectory": "www/",
  "globPatterns": [
    "assets/fonts/*.woff2",
    "assets/css/*.css",
    "assets/icon/*.webp",
    "assets/icon/*.jpg",
    "assets/icon/*.png",
    "assets/img/**/*.webp",
    "assets/img/**/*.png",
    "assets/img/**/*.jpg",
    "assets/i18n/*.json",
    "build/**/*.css",
    "build/**/*.js",
    "index.html",
    "manifest.json"
  ],
  "dontCacheBustUrlsMatching": new RegExp('.+\.[a-f0-9]{8}\..+'),
  "maximumFileSizeToCacheInBytes": 12000000,
  "swSrc": "src/service-worker.js",
  "swDest": "www/service-worker.js"
};
