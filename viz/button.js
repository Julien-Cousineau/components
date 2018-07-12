import {Button,Parent,LContainer} from '../src/index.js';

const lcontainer = LContainer(Parent,150,100,0);

const btn1  = new Button({
    title:'BTN1',
    value:1,
    callback:()=>console.log('btn1')
});

btn1.render(lcontainer);
