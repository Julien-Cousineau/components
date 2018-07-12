import {Panel,Parent,LContainer} from '../src/index.js';

const lcontainer = LContainer(Parent,150,100,0);


const p1  = new Panel({title:'Spatial',col:6});

p1.render(lcontainer);