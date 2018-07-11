'use strict';
import d3 from '../dist/d3.min.js';
import {SVG,Picker,Parent,LContainer} from '../src/index.js';
const lcontainer = LContainer(Parent,275,360,0);


const p1 = new Picker({
     width:275,
     height:360,
     rgba:{r:255,g:0,b:0,a:1},
     callback:(rgba)=>console.log(rgba)
});
p1.render(lcontainer);