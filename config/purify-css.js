import purifycss from "purify-css";
const purifycss = require("purify-css");
let content = ['../www/build/*.js'];
let css = ['../www/build/main.*.css'];

let options = {
  output: './dist/purified.css',

  // Will minify CSS code in addition to purify.
  minify: true,

  // Logs out removed selectors.
  rejected: true
};

purify(content, css, options);
