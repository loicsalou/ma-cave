// New copy task for font files
module.exports = {
  copyHosting: {
    src: ['{{ROOT}}/firebase.json'],
    dest: '{{WWW}}'
  },
  copyCavus: {
    src: ['{{ROOT}}/src/app/scss/icons/fonts/*'],
    dest: '{{WWW}}/assets/fonts'
  },
  copyCavusCss: {
    src: ['{{ROOT}}/src/app/scss/icons/css/*'],
    dest: '{{WWW}}/assets/css'
  },
  copyRobots: {
    src: ['{{ROOT}}/src/app/robots.txt'],
    dest: '{{WWW}}'
  },
   copyModernizr: {
    src: ['{{ROOT}}/src/app/modernizr.js'],
    dest: '{{WWW}}'
  },
  copyWorkbox: {
    src: ['./node_modules/workbox-sw/build/workbox-sw.js',
      './node_modules/workbox-core/build/workbox-core.prod.js',
      './node_modules/workbox-precaching/build/workbox-precaching.prod.js'],
    dest: '{{WWW}}/workbox-3.2.0'
  }
};
