'use strict';
const d3 = require('../../dist/d3.min.js');
import Input from '../input';
export default  class Graph {
  constructor(options){
    if(!options)throw new Error("Graph needs options");
    this._width = options.width || null;
    this._height = options.height || null;
    this._origin = options.origin || null;
    const extent = this.extent = options.extent || null;
    
    this.isxaxis = (typeof options.isxaxis=='undefined')?true:options.isxaxis;
    this.isyaxis = (typeof options.isyaxis=='undefined')?true:options.isyaxis;
    this.isclick = (typeof options.isclick=='undefined')?false:options.isclick;
    this.callbacks = options.callbacks || {};
    
    const x = this.x = this.createScale(options.xscale || {name:'scaleLinear'});
    const y = this.y = this.createScale(options.yscale || {name:'scaleLinear'});   
    
    this.isxaxisminmax = (typeof options.isxaxisminmax=='undefined')?false:options.isxaxisminmax;
    this.isyaxisminmax = (typeof options.isyaxisminmax=='undefined')?false:options.isyaxisminmax;
          

    
    
  }
  get SVG(){return this._svg()}
  get svg(){return this.SVG.svg}
  get element(){return this.SVG.element}
  get width(){const {SVG}=this;return this._width || SVG.width - SVG.margin.left - SVG.margin.right;}
  get height(){const {SVG}=this;return this._height || SVG.height - SVG.margin.top - SVG.margin.bottom;} 
  get origin(){const {SVG}=this;return this._origin || [SVG.margin.left,SVG.margin.top]} 
  
  render(){
    this.setRange();
    this.setDomain();
    
    const {element,svg,isxaxis,isyaxis,isxaxisminmax,isyaxisminmax,xaxismin,xaxismax,extent,callbacks}=this;
    const canvas = this.canvas = svg.append("g");
    if(isxaxis)this.xaxis = canvas.append("g");
    if(isyaxis)this.yaxis = canvas.append("g");  
    if(isxaxisminmax && isxaxis){
          const self=this;
   const xaxismin = new Input({
        title:'',
        type:'number',
        min:0,
        max:100,
        value:extent[0],
        callback:(value)=>{extent[0]=value;self.changeDomain()}
        
    })
       const xaxismax = new Input({
        title:'',
        type:'number',
        min:0,
        max:100,
        value:extent[2],
        callback:(value)=>{extent[2]=value;self.changeDomain()}
        
    })
      const hitbox = element.append('div')
       .style('position','absolute')
       .style('left','0px')
       .style('bottom','10px')
       .style('width','100%')
       .style('min-height','18px')
       .style('padding','18px')
      const mingroup = hitbox.append('div')
        .style('position','absolute')
        .style('left','15px')
        .style('display','none')
      const maxgroup = hitbox.append('div')
        .style('position','absolute')
        .style('right','0px')
        .style('display','none')
  
      xaxismin.render(mingroup).style("float",'left');
      xaxismax.render(maxgroup).style("float",'left');
      hitbox.on("mouseover",()=>{
        mingroup.style('display','block')
        maxgroup.style('display','block')
      })
       hitbox.on("mouseout",()=>{
        mingroup.style('display','none')
        maxgroup.style('display','none')
      })
      
    }
    
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
    this.resize();
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
  changeDomain(){
    this.setDomain();
    this.draw();
  }
  resize(){
    const {height,origin,isxaxis}=this;
    if(isxaxis)this.xaxis.attr("transform", "translate(0," + height + ")");
    this.canvas.attr("transform","translate(" + origin[0] + "," + origin[1] + ")");   
    this.setRange(); 
    this.draw();
    
  }
  draw(){
    const {isxaxis,isyaxis,xaxis,yaxis,x,y,isxaxisminmax}=this;    
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