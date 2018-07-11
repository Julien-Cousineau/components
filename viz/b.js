const d3 = require('../dist/d3.min.js')
const ui = require('../src/index.js');
console.log('Melanie');
console.log("Julien");
const body = document.getElementsByTagName("body")[0];
const element = d3.select(body).append('div')
const svg = new ui.SVG({});
svg.render(element)
