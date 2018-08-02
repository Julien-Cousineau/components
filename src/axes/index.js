'use strict';
const d3 = require('../../dist/d3.min.js');
import Scale from '../scale';

export default class Axes {
  constructor(options){
    if(!options)options={};
    this.xscale = options.xscale || {axis:'x',show:false,type:'scaleLinear',minmax:[0,1]};
    this.yscale = options.yscale || {axis:'y',show:false,type:'scaleLinear',minmax:[0,1]};
    this.addAxes()
    

  }
  get graph(){return this._graph()}
  get canvas(){return this.graph.canvas}
  get width(){return this.graph.width}
  get height(){return this.graph.height} 
  get extent(){return this.graph.extent} 
  
  addAxes(){
  const {xscale,yscale}=this;
    const self=this;
    const x = this.x = new Scale(xscale);
    const y = this.y =  new Scale(yscale);
    x._axes = ()=>self;
    y._axes = ()=>self;
      
  }
  
  render(){
    const {canvas}=this;
    this.element = canvas.append("g");
    this.x.render();
    this.y.render();
    this.setRange();
    this.setDomain();
    
  }
  

  changeScale(axis,type){
    if(!this[axis])throw new Error("Scale " + axis + " does not exist");
    this[axis].change(type);
  }  
  setRange(){
    const {x,y}=this;
    x.setRange();
    y.setRange();
  }  
  setDomain(){
    const {x,y}=this;
    x.setDomain();
    y.setDomain();
    this.draw();
  }
  resize(){
    this.setRange(); 
    this.draw();
  }
  draw(){
    const {x,y}=this;
    x.draw();
    y.draw();
  }



}