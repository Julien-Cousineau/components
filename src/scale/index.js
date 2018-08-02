'use strict';
const d3 = require('../../dist/d3.min.js');
import Input from '../input';
export default  class Scale {
  constructor(options){
    if(!options)options={}
    const axis = this.axis = options.axis || 'x';
    const type = this.type = options.type || 'scaleLinear';
    const pars = this.pars = options.pars || {};
    const minmax = this.minmax = options.minmax || null;
    const editable = this.editable = (typeof options.editable=='undefined')?false:options.editable;
    const show =this.show =  (typeof options.show=='undefined')?false:options.show;
    

          
    if(!d3[type])throw new Error(type + " is not a scale");      
    const scale = this.scale = d3[type]();
    for(let par in pars){
      if(!scale[par]){console.warn(par + " is not a parameter");}
      else{scale[par](pars[par]);}      
    }
  }
  get axes(){return this._axes()}
  get graph(){return this.axes.graph}
  get extent(){return this.graph.extent}
  get element(){return this.axes.element}
  get width(){return this.graph.width}
  get height(){return this.graph.height} 
  get extent(){return this.graph.extent} 
  
  render(){

    this.setRange();
    
    
    
    this.setDomain();
    const {element,editable}=this;
    const dom = this.dom = element.append("g");
    
    if(editable)this.renderEditable();
  }

  renderEditable(){
    
    const {graph,axis,minmax}=this;
    const self=this;
    if(minmax && axis=='x')graph.extent[0]=Math.min(minmax[0],graph.extent[0]);
    if(minmax && axis=='x')graph.extent[2]=Math.max(minmax[1],graph.extent[2]);
    if(minmax && axis=='y')graph.extent[1]=Math.min(minmax[0],graph.extent[1]);
    if(minmax && axis=='y')graph.extent[3]=Math.max(minmax[1],graph.extent[3]);
    
    let min = (axis=='x')?graph.extent[0]:graph.extent[1];
    let max = (axis=='x')?graph.extent[2]:graph.extent[3];
 
     const inputmin = new Input({
        title:'',
        type:'number',
        min:min,
        max:max,
        value:min,
        callback:(value)=>{
          if(axis=='x')graph.extent[0]=parseFloat(value);
          if(axis=='y')graph.extent[1]=parseFloat(value);
          self.setDomain();
          self.draw();
          self.graph.draw();
        }
        
    })
       const inputmax = new Input({
        title:'',
        type:'number',
        min:min,
        max:max,
        value:max,
        callback:(value)=>{
          if(axis=='x')graph.extent[2]=parseFloat(value);
          if(axis=='y')graph.extent[3]=parseFloat(value);
          self.setDomain();
          self.draw();
          self.graph.draw();
          
        }
        
    });
    
    const hitbox = graph.element.append('div').style('position','absolute');
    const mingroup = hitbox.append('div').style('position','absolute').style('display','none');
    const maxgroup = hitbox.append('div').style('position','absolute').style('display','none');
       
    if(axis=='x')hitbox.style('left','0px').style('bottom','10px').style('width','100%').style('min-height','18px').style('padding','36px 0 18px');
    if(axis=='y')hitbox.style('left','0px').style('top','0px').style('bottom','0px').style('min-width','18px').style('padding','0 36px 0 0');
    
    if(axis=='x')mingroup.style('left','15px');
    if(axis=='x')maxgroup.style('right','0px');
    if(axis=='y')mingroup.style('bottom','18px');
    if(axis=='y')maxgroup.style('top','0px');
       

  
      inputmin.render(mingroup).style("float",'left');
      inputmax.render(maxgroup).style("float",'left');
      hitbox.on("mouseover",()=>{
        mingroup.style('display','block')
        maxgroup.style('display','block')
      })
       hitbox.on("mouseout",()=>{
        mingroup.style('display','none')
        maxgroup.style('display','none')
      })
      
    
    
    
  }
  change(type,pars){
    if(!d3[type])throw new Error(type + " is not a scale");      
    const scale = this.scale = d3[type]();
    this.type=type;
    for(let par in pars){
      if(!scale[par]){console.warn(par + " is not a parameter");}
      else{scale[par](pars[par]);}      
    }
    this.setRange();
    this.setDomain();
    this.draw();
  }

  setRange(){
    const {axis,scale,width,height}=this;
    if(axis=='x')scale.rangeRound([0, width]);
    if(axis=='y')scale.range([height, 0]);
  }  
  setDomain(){
    const {axis,scale,extent}=this;
    if(extent && axis=='x')scale.domain([extent[0],extent[2]]);
    if(extent && axis=='y')scale.domain([extent[1],extent[3]]);
  }
  changeDomain(){
    this.setDomain();
    // this.draw();
  }

  draw(){
    const {height,axis,dom,scale,show}=this;
    if(show && axis=='x')dom.attr("transform", "translate(0," + height + ")");
    if(show && axis=='x')dom.call(d3.axisBottom(scale));
    if(show && axis=='y')dom.call(d3.axisLeft(scale));
  }



}