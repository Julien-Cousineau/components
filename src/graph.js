'use strict';
const d3 = require('../dist/d3.min.js');
export default  class Graph {
  constructor(options){
    if(!options)throw new Error("Graph needs options");
    this._width = options.width || null;
    this._height = options.height || null;
    this._origin = options.origin || null;
    this.extent = options.extent || null;
    
    this.isxaxis = (typeof options.isxaxis=='undefined')?true:options.isxaxis;
    this.isyaxis = (typeof options.isyaxis=='undefined')?true:options.isyaxis;
    this.isclick = (typeof options.isclick=='undefined')?false:options.isclick;
    this.callbacks = options.callbacks || {};
    
    this.x = this.createScale(options.xscale || {name:'scaleLinear'});
    this.y = this.createScale(options.yscale || {name:'scaleLinear'});    
          
    
    
  }
  get SVG(){return this._svg()}
  get svg(){return this.SVG.svg}
  get width(){const {SVG}=this;return this._width || SVG.width - SVG.margin.left - SVG.margin.right;}
  get height(){const {SVG}=this;return this._height || SVG.height - SVG.margin.top - SVG.margin.bottom;} 
  get origin(){const {SVG}=this;return this._origin || [SVG.margin.left,SVG.margin.top]} 
  
  render(){
    this.setRange();
    this.setDomain();
    
    const {svg,isxaxis,isyaxis,callbacks}=this;
    const canvas = this.canvas = svg.append("g");
    if(isxaxis)this.xaxis = canvas.append("g");
    if(isyaxis)this.yaxis = canvas.append("g");  
    if(callbacks.click){      
      svg.on('click',()=>{callbacks.click(d3.event)});
    }
  }
  
  createScale(options){
    if(!d3[options.name])throw new Error(options.name + " is not a scale");      
    const scale = d3[options.name]();
    for(let par in options.pars){
      if(!scale[par]){console.warn(par + " is not a parameter for " + options.id)}
      else{scale[par](options.pars[par]);}      
    }
    return scale;  
  }
  changeScale(id,scale){
    if(!this[id])throw new Error("Scale " + id + " does not exist");
    this[id]=this.createScale(scale);
    this.setRange();
  }  
  setRange(){
    const {x,y,width,height}=this;
    x.rangeRound([0, width])
    y.range([height, 0])
  }  
  setDomain(){
    const {x,y,extent}=this;
    if(extent)x.domain([extent[0],extent[2]])
    if(extent)y.domain([extent[1],extent[3]])
    
  }
  resize(){
    const {height,origin,isxaxis}=this;
    if(isxaxis)this.xaxis.attr("transform", "translate(0," + height + ")");
    this.canvas.attr("transform","translate(" + origin[0] + "," + origin[1] + ")");   
    this.setRange(); 
    this.draw();
    
  }
  draw(){
    const {isxaxis,isyaxis,xaxis,yaxis,x,y}=this;    
    if(isxaxis)xaxis.call(d3.axisBottom(x));
    if(isyaxis)yaxis.call(d3.axisLeft(y)); 
    
  }
    addSlider(id,slider){
    if(!id || !slider)throw new Error("addSlider needs a id & slider")
    const self=this;
    slider._graph=function(){return self};
    if(!this.sliders)this.sliders={};
    this.sliders[id]=slider;
    slider.render();
  }


}