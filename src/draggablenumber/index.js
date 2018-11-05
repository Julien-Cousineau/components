'use strict';
const d3 = require('../../dist/d3.min.js');
import Input from '../input';
export default  class DraggableNumber {
  constructor(options){
    if(!options)options={};
    // if(!options.callback)throw new Error("DraggableNumber need a callback");
    this.callback = options.callback || null;
    this.title = (typeof options.title==='undefined')?'{title}':options.title;
    this.min = options.min || 0;
    this.max = options.max || 100;
    this.step = options.step || 1;
    this.active = (typeof options.active==='undefined')?true:options.active;
    this.after = (typeof options.after==='undefined')?true:options.after;
    this.f = options.f || 0.1;
    this.dy = options.dy || 0.0;
    this.value=options.value || 0;
    this.enable=(typeof options.enable==='undefined')?true:options.lock;  

  }
  render(element){
    if(!element)throw new Error("DraggableNumber needs an element to render");       
   let {title,f,value,dy,callback} = this;
    const dom = this.dom = element.append('div')
    if(!this.after)this.createTitle();
    const span = this.span = dom.append('span')
        .style('float','left')
        .attr('class','draggablenumber')
        .style('cursor','row-resize')
        .style('text-decoration-line','underline')
        .style('text-decoration-style','dotted')
        .style('user-select','none')
        .text(value);
    if(this.after)this.createTitle();
    const self=this;
    const ondrag = function(d){
      const {min,max,step}=self;
      dy += d3.event.dy*f;
      if(Math.abs(dy)>1.0){
        dy = parseInt(dy);
        value = (value-dy*step).clamp(min,max);
        dy=0.0;
        span.text(value);
        self.value=value;
        if(callback)callback(value);
        
      }
    };  
    
    const d3drag = this.d3drag = d3.drag()
    .on("start",ondrag)
    .on("drag",ondrag)
    .on("end",ondrag);
    dom.call(d3drag);
    span.on('dblclick',()=>{
      const hitbox=span.node().getBoundingClientRect();

      const h=dom.append('div')
        .style('position','fixed')
        .style('top',hitbox.top +'px')
        .style('left',hitbox.left+'px')
        .style('width',hitbox.width+'px')
        .style('height',hitbox.height+'px');
      const input = new Input({
        title:'',
        type:'numberenter',
        value:this.value,
        callback:(value)=>{
          this.setValue(value);
          input.remove();
          h.remove();
          
          if(callback)callback(parseInt(value));
          }
      });
      input.render(h);
      input.input.node().focus();
      
      
    })
    if(!this.active)this.hide();
    return this;
  }
  hide(){this.dom.style('display','none');}
  show(){this.dom.style('display','');}
  setTitle(title){this.titledom.text(" " +title);}
  changeMin(value){this.min=value; this.reset();}
  changeMax(value){this.max=value; this.reset();}
  changeStep(value){this.step=value; this.reset();}
  setValue(value){this.value=parseInt(value);this.span.text(parseInt(value))}
  createTitle(){
        this.titledom =this.dom.append('p')
        .attr("class",'small')
        .style('float','left')
        .style('padding',0)
        .style('margin-bottom',0)
        .style('margin-top','4px')
        .style('margin-left','2px')
        .text(" " + this.title) 
    
  }
  reset(){
    const {min,max}=this;
    const value = this.value = this.value.clamp(min,max);
    this.span.text(value);
    this.callback(value);
    
  }
}
