module.exports = {
  "globDirectory": "www/",
  "globPatterns": [
    "assets/**/*.*",
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
