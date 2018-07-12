import {DraggableNumber,Parent,LContainer} from '../src/index.js';

const lcontainer = LContainer(Parent,150,100,0);

const dn1  = new DraggableNumber({
    title:'Point size: ',
    value:1,
    callback:(value)=>console.log('dn1',value)
});

dn1.render(lcontainer);
