'use strict';
import d3 from '../dist/d3.min.js';
import {SVG,Graph,Slider,Parent,LContainer} from '../src/index.js';
const lcontainer = LContainer(Parent,100,100,10);

const svg = new SVG({
      style:{position:'absolute',padding:'0px',margin:'0px'},
      minwidth:100,
      minheight:100,
      margin:{top: 10, right: 0, bottom: 10, left: 0}});

const graph1 = new Graph({isyaxis:false,isxaxis:false,extent:[-1,-1,1,1]});

const s1= new Slider({
    value:0.5,
    r:5,
    type:'y',
    con:'mid',
    isexterior:true,
    isinterior:true,
    iscursor:true,
    callbacks:{
        value:(value)=>console.log('s1',value),
        color:()=>console.log('s1')}
    
})

svg.render(lcontainer)
svg.addGraph('graph1',graph1)
graph1.addSlider('s1',s1);