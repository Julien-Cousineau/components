'use strict';
import d3 from '../dist/d3.min.js';
import {Popover,Parent,LContainer} from '../src/index.js';
const lcontainer = LContainer(Parent,275,360,0);


const po1 = new Popover({
     width:275,
     height:360,
});
po1.render(lcontainer);