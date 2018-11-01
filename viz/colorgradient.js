'use strict';
import {ColorSlider,Slider,ColorGradient,Parent,LContainer} from '../src/index.js';


const cg1 =new ColorGradient({height:100,width:10,sliders:{
  s1: new Slider({
      value:0.5,
      r:5,
      type:'y',
      con:'mid',
      isexterior:false,
      isinterior:false,
      iscursor:true,
      callbacks:{
          value:(value)=>console.log('value'),
          color:()=>console.log('color')}
  }),
}});
const cg2 =new ColorGradient({height:20,width:100,sliders:{
  s1: new Slider({
      value:0.5,
      r:5,
      type:'x',
      con:'mid',
      isexterior:false,
      isinterior:false,
      iscursor:true,
      callbacks:{
          value:(value)=>console.log('value'),
          color:()=>console.log('color')}
  }),
}});
const cg3 =new ColorGradient({height:100,width:10,sliders:{
  s1: new Slider({
      value:1,
      r:5,
      type:'y',
      con:'mid',
      isexterior:false,
      isinterior:false,
      iscursor:false,
      iscursorcircle:true,
      callbacks:{
          value:(value)=>console.log('value'),
          color:()=>console.log('color')}
  }),
  s2: new Slider({
      value:0,
      r:5,
      type:'y',
      con:'mid',
      isexterior:false,
      isinterior:false,
      iscursor:false,
      iscursorcircle:true,
      callbacks:{
          value:(value)=>console.log('value'),
          color:()=>console.log('color')}
  }),  
}});

const cg4 =new ColorGradient({
    addable:true,
    height:150,
    width:10,
    callback:()=>console.log("callback from gradient"),

sliders:{
  s1: new ColorSlider({
      rgba:{r:255,g:0,b:0,a:1},
      value:0,
      r:5,
      type:'y',
      con:'mid',
      isexterior:false,
      isinterior:false,
      iscursor:false,
      iscursorcircle:true,
      callbacks:{
          value:(value)=>console.log('value'),
          color:()=>console.log('color')}
  }),
  s2: new ColorSlider({
      rgba:{r:255,g:255,b:0,a:1},
      value:1,
      r:5,
      type:'y',
      con:'mid',
      isexterior:false,
      isinterior:false,
      iscursor:false,
      iscursorcircle:true,
      callbacks:{
          value:(value)=>console.log('value'),
          color:()=>console.log('color')}
  }),  
}});

cg1.render(Parent);    
cg2.render(Parent);
cg3.render(Parent); 
cg4.render(Parent); 