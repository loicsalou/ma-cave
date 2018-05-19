// New copy task for font files
module.exports = {
  copyFontAwesome: {
    src: ['{{ROOT}}/node_modules/font-awesome/fonts/**/*'],
    dest: '{{WWW}}/assets/fonts'
  },
  copyFontawesomeCss: {
    src: ['{{ROOT}}/node_modules/font-awesome/css/font-awesome.min.css'],
    dest: '{{WWW}}/assets/css'
  },
  copyCavus: {
    src: ['{{ROOT}}/src/app/scss/icons/font/*'],
    dest: '{{WWW}}/assets/fonts'
  },
  copyCavusCss: {
    src: ['{{ROOT}}/src/app/scss/icons/css/*'],
    dest: '{{WWW}}/assets/css'
  }
};
