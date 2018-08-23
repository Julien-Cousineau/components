'use strict';
import d3 from '../dist/d3.min.js';
import {Tabs,Parent,LContainer,Button} from '../src/index.js';
const lcontainer = LContainer(Parent,275,360,0);


const tabs1 = new Tabs({
    tabs:{
      first:{title:'F',active:true,content:new Button({title:'BTN2',value:1,callback:()=>console.log('btn1')})},
        second:{title:'S',active:false,content:new Button({title:'BTN3',value:1,callback:()=>console.log('btn1')})},
        third:{title:'T',active:false,content:new Button({title:'BTN4',value:1,callback:()=>console.log('btn1')})},
        four:{title:'Four',active:false,content:new Button({title:'BTN5',value:1,callback:()=>console.log('btn1')})},
        five:{title:'Five',active:false,content:new Button({title:'BTN6',value:1,callback:()=>console.log('btn1')})},
    }
     
});
tabs1.render(lcontainer);