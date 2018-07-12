import {Checkbox,Parent,LContainer} from '../src/index.js';

const lcontainer = LContainer(Parent,150,100,0);

const cb1  = new Checkbox({
    title:'Point ID',
    callback:(value)=>console.log("cb1",value)})

cb1.render(lcontainer);
