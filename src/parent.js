'use strict';
// import {d3} from '../dist/d3.min.js';
const d3 = require('../dist/d3.min.js');
const element = document.getElementsByTagName("body")[0];
console.log(d3)
const dom = d3.select(element)
              .append("div")
                .style('position','absolute')
                .style('width','100%')
                .style('height','100%')
                .style('background','white')
export default dom