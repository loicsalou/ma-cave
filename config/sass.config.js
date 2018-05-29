// Adding Font Awesome to includePaths
module.exports = {
  includePaths: [
    'node_modules/ionic-angular/themes',
    'node_modules/ionicons/dist/scss',
    'node_modules/ionic-angular/fonts',
    'src/app/scss/icons/css',
    'src/app/scss/icons/fonts'
  ],
  excludeFiles: [
    /\.(wp|ios).(scss)$/i,
    /(action-sheet|chip|img|picker|range|refresher|show-hide-when|split-pane)/i
  ]
};
