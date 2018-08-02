'use strict';
const d3 = require('../../dist/d3.min.js');
import Axes from '../axes';
import Input from '../input';
export default  class Graph {
  constructor(options){
    if(!options)throw new Error("Graph needs options");
    this._width = options.width || null;
    this._height = options.height || null;
    this._origin = options.origin || null;
    const extent = this.extent = options.extent || [0,0,1,1];

    this.isclick = (typeof options.isclick=='undefined')?false:options.isclick;
    this.callbacks = options.callbacks || {};
    
  
    const self=this;
    this.axes = new Axes(options);
    this.axes._graph =()=>self;
   
  }
  get SVG(){return this._svg()}
  get svg(){return this.SVG.svg}
  get element(){return this.SVG.element}
  get width(){const {SVG}=this;return this._width || SVG.width - SVG.margin.left - SVG.margin.right;}
  get height(){const {SVG}=this;return this._height || SVG.height - SVG.margin.top - SVG.margin.bottom;} 
  get origin(){const {SVG}=this;return this._origin || [SVG.margin.left,SVG.margin.top]}
  get x(){return this.axes.x.scale}
  get y(){return this.axes.y.scale}
  


  render(){
    const {svg,axes,callbacks}=this;
    this.canvas = svg.append("g");
    axes.render();
    if(callbacks.click)svg.on('click',()=>{callbacks.click(d3.event)});
  }

  resize(){
    const {canvas,origin,axes}=this;
    canvas.attr("transform","translate(" + origin[0] + "," + origin[1] + ")");
    axes.resize();
  }

  addSlider(id,slider){
    if(!id || !slider)throw new Error("addSlider needs a id & slider");
    const self=this;
    slider._graph=function(){return self};
    if(!this.sliders)this.sliders={};
    this.sliders[id]=slider;
    slider.render();
  }


}