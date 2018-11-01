'use strict';
const d3 = require('../../dist/d3.min.js');
import Scale from './scale';

export default class Axes {
  constructor(options){
    if(!options)options={};
    const xscale = options.xscale || {axis:'x',show:false,type:'scaleLinear',minmax:[0,1]};
    const yscale = options.yscale || {axis:'y',show:false,type:'scaleLinear',minmax:[0,1]};
    
    const self=this;
    const x = this._x = new Scale(xscale);
    const y = this._y =  new Scale(yscale);
    x._axes = ()=>self;
    y._axes = ()=>self;
    

  }
  get graph(){return this._graph()}
  get canvas(){return this.graph.canvas}
  get width(){return this.graph.width}
  get height(){return this.graph.height} 

  

  get isflip(){return this.graph.isflip}
  get x(){return (!this.isflip)?this._x:this._y}
  get y(){return (!this.isflip)?this._y:this._x}
 
  
  render(){
    const {canvas}=this;
    this.element = canvas.append("g");
    this.x.render();
    this.y.render();
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
    this.graph.draw();
  }
  resize(){
    this.setRange(); 
    this.graph.draw();
  }
  draw(){
    const {x,y}=this;
    x.draw();
    y.draw();
  }
  flip(){
    this.x.flip();
    this.y.flip();
  }

  
 
  


}