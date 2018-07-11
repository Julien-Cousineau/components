'use strict';
const d3 = require('../dist/d3.min.js');
import {debounceD3Event} from './d3util.js';


export default class Slider {
  constructor(options){
    
    if(options.type){if(!(options.type =='x' || options.type =='y'))throw new Error("Type must be x or y");}
    if(options.con){if(!(options.con =='start' || options.con =='end' || options.con=='mid'))throw new Error("Type must be start or end or mid");}
    if(!options.callbacks)throw new Error("Slider has no callbacks");
    
    this.type = options.type || 'x';
    this.con = options.con || 'end';
    this.isinterior = (typeof options.isinterior==='undefined')?true:options.isinterior;
    this.isexterior = (typeof options.isexterior==='undefined')?true:options.isexterior;
    this.iscursor = (typeof options.iscursor==='undefined')?true:options.iscursor;
    this.iscursorcircle = (typeof options.iscursorcircle==='undefined')?false:options.iscursorcircle;
    this.isremovable = (typeof options.isremovable==='undefined')?false:options.isremovable;
    this.r = options.r || 7;
    this.value = options.value || 0.0;
    this.callbacks = options.callbacks;
    
  }
  get graph(){return this._graph()}
  get x(){return this.graph.x}
  get y(){return this.graph.y}
  get canvas(){return this.graph.canvas}
  get translation(){
    const {type,con,x,y}=this;
  
    
    if(type=='x' && con=='start')return 'translate(' + 0 +',' + y.range()[0] +')';
    if(type=='x' && con=='end')return 'translate(' + 0 +',' + 0 +')';
    if(type=='x' && con=='mid')return 'translate(' + 0 +',' + (y.range()[0]+y.range()[1])*0.5 +')';
    if(type=='y' && con=='start')return 'translate(' + 0 +',' + 0 +')';
    if(type=='y' && con=='end')return 'translate(' + x.range()[1] +',' + 0 +')';
    if(type=='y' && con=='mid')return 'translate(' + (x.range()[0]+x.range()[1])*0.5 +',' + 0 +')';
    
  }
  remove(){
    this.slider.remove();
  }
  draw(){      
    const {slider,isexterior,isinterior,iscursor,circle,value,type,translation}=this;
    const scale = this[type] // x or y
  
    slider.attr('transform', translation);
    const doms=[];
    if(isexterior)doms.push('exterior');
    if(isinterior)doms.push('interior');
    if(iscursor)doms.push('cursor');
    
    doms.forEach(item=>{
       this[item].attr(type+'1', scale.range()[0])  // x1 or y1
                 .attr(type+'2', scale.range()[1]); // x2 or y2
    },this);    
    circle.attr("c" + type, scale(value)); // cx or cy
    
  }
  render(){    
    const {canvas,isexterior,isinterior,iscursorcircle,iscursor,r}=this;    
    const slider = this.slider = canvas.append('g');
    
    if(isexterior){
      this.exterior=slider.append('line')
      .style('stroke', '#000000')
      .style('stroke-opacity', '0.25')
      .style('stroke-width', '8px')
      .style('stroke-linecap', 'round');
    }
    if(isinterior){
    this.interior=slider.append('line')
    .style('stroke', '#dddddd')
    .style('stroke-opacity', '0.5')
    .style('stroke-width', '6px')
    .style('stroke-linecap', 'round');
    }
    
    const circle = this.circle=slider.append('circle')
      .style('fill', '#fff')
      .style('stroke', 'rgb(0, 0, 0)')
      .style('stroke-opacity', '0.5')
      .style('stroke-width', '1.25px')
      .style('fill-opacity', '1')
      .style('r', r + 'px');    
    
    const self=this;
    const ondrag = function(d){
      const {type,isremovable}=self;
      const scale = self[type]; // x or y
      
      const value = self.value = scale.invert(d3.event[type]).clamp(scale.domain()[0],scale.domain()[1]);   
      circle.attr("c" + type, scale(value)); // cx or cy 
      self.callbacks.value(value);
      if(isremovable){
        const inversetype = (type=='x')?'y':'x';   
        if(Math.abs(d3.event[inversetype]-d3.event.subject[inversetype]) >10)
        {
          if(self.callbacks.removal)self.callbacks.removal();
        }
      }

    };  
    
    const d3drag = this.d3drag = d3.drag()
    .on("start",debounceD3Event(ondrag,10))
    .on("drag",debounceD3Event(ondrag,10))
    .on("end",debounceD3Event(ondrag,10));
    
    if(iscursor){
      const cursor=this.cursor=slider.append('line')
        .attr('class', 'track-overlay')
        .style('stroke-linecap', 'round')
        .style('pointer-events', 'stroke')
        .style('stroke-width', '16px')
        .style('stroke', 'transparent')
        .style('cursor', 'crosshair')
        .call(d3drag)
    }
    if(iscursorcircle){
      circle.style('cursor', 'crosshair')
      .on('click',self.callbacks.color)
      .call(d3drag)
    }
    this.draw();
  }
  changeValue(value){
    const {circle,type} = this;
    const scale = this[type];
    circle.attr("c" + type, scale(value)); // cx or cy 
  }
}