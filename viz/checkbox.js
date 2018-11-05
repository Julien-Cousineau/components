import {Checkbox,Parent,LContainer} from '../src/index.js';

const lcontainer = LContainer(Parent,150,100,0);

const cb1  = new Checkbox({
    title:'Point ID',
    value:true,
    callback:(value)=>console.log("cb1",value)}).render(lcontainer)
 new Checkbox({
    title:'Point ID',
    value:true,
    icons:{on:'far fa-eye',off:'far fa-eye-slash'},
    callback:(value)=>console.log("cb1",value)}).render(lcontainer)

