const {debounce} = require('@julien.cousineau/util')

module.exports = class SVG{
  constructor(options){
    if(!options)options={};
    this.minwidth = options.minwidth || 300;
    this.minheight = options.minheight || 300;
    this.style = options.style || {};
    this.resizecallback = options.resizecallback;
    this.graphs={};
    
    const self=this;
    window.addEventListener("resize", debounce(function(){return self.resize()},10));
    
  }
  get width(){return Math.max(this.minwidth,this.element.node().getBoundingClientRect().width)}
  get height(){return Math.max(this.minheight,this.element.node().getBoundingClientRect().height)}
  render(element){
    if(!element)throw new Error("SVG needs a element to draw");
    this.element=element;
    const {width,height,style}=this;    
    const svg = this.svg = element
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style('box-sizing','content-box');
    for(let id in style){
      svg.style(id,style[id]);
    }
  }
  resize(){
    const {svg,width,height,graphs,resizecallback}=this;
    svg.attr("width", width)
       .attr("height", height);
    for(let id in graphs){graphs[id].resize();}
    if(resizecallback)resizecallback();
  }
   
  addGraph(id,graph){
    if(!id || !graph)throw new Error("addGraph needs a id & graph");
    const self=this;
    graph._svg=function(){return self};
    this.graphs[id]=graph;
    graph.render();
    this.resize();
    
  }
  add(a,b){
    return a+b;
  }

};