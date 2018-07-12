'use strict';
const d3 = require('../dist/d3.min.js');
export default  class DraggableNumber {
  constructor(options){
    if(!options)options={};
    if(!options.callback)throw new Error("DraggableNumber need a callback");
    this.callback = options.callback;
    this.title = options.title || '{title}';
    this.min = options.min || 0;
    this.max = options.max || 100;
    this.step = options.step || 1;
    this.f = options.f || 0.1;
    this.dy = options.dy || 0.0;
    this.value=options.value || 0;
    this.enable=(typeof options.enable==='undefined')?true:options.lock;  

  }
  render(element){
    if(!element)throw new Error("DraggableNumber needs an element to render");       
   let {title,min,max,f,value,step,dy,callback} = this;
    const dom = this.dom = element.append('p')
        .text(title)
        .append('span')
        .style("cursor","row-resize")
        .style("line-height"," 30px")
        .style("text-decoration-line"," underline")
        .style("text-decoration-style"," dotted")
        .style("user-select"," none")
        .text(value);
    
    const self=this;
    const ondrag = function(d){
      dy += d3.event.dy*f;
      if(Math.abs(dy)>1.0){
        dy = parseInt(dy);
        value = (value-dy*step).clamp(min,max);
        dy=0.0;
        dom.text(value);
        self.value=value;
        callback(value);
        
      }
    };  
    
    const d3drag = this.d3drag = d3.drag()
    .on("start",ondrag)
    .on("drag",ondrag)
    .on("end",ondrag);
    dom.call(d3drag);
  }
}
