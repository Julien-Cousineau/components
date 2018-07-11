'use strict';
import d3 from '../dist/d3.min.js';
import {ColorSlider,SVG,Graph,Parent,LContainer} from '../src/index.js';
const lcontainer = LContainer(Parent,100,100,10);

const svg = new SVG({
      style:{position:'absolute',padding:'0px',margin:'0px'},
      minwidth:100,
      minheight:100,
      margin:{top: 10, right: 0, bottom: 10, left: 0}});

const graph1 = new Graph({isyaxis:false,isxaxis:false,extent:[0,0,1,1]});


const cl1 =  new ColorSlider({
  rgba:{r:255,g:0,b:0,a:1},
  value:0.5,
  r:7,
  type:'y',
  con:'mid',
  isexterior:true,
  isinterior:true,
  iscursor:false,
  iscursorcircle:true,
  callbacks:{
    value:(value)=>console.log('cl1(value)',value),
    updategradient:(rgba)=>console.log('cl1(updategradient)',rgba)
  }
  
})
svg.render(lcontainer)
svg.addGraph('graph1',graph1)
graph1.addSlider('cl1',cl1);