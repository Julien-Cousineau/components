'use strict';
const d3 = require('../../../dist/d3.min.js');
import Input from '../../input';
import Slider from '../../slider';
import SVG from '../../svg';
import Graph from '../../graph';
export default  class Scale {
  constructor(options){
    if(!options)options={}
    const axis = this.axis = options.axis || 'x';
    const type = this.type = options.type || 'scaleLinear'; //scalePow,scaleLog
    const pars = this.pars = options.pars || {};
    const minmax = this.minmax = options.minmax || [0,1];
    const label = this.label = options.label || null;
    const viewable = this.viewable = options.viewable || [this.minmax[0],this.minmax[1]];
    const editable = this.editable = (typeof options.editable=='undefined')?false:options.editable;
    // const editable=false;
    const show =this.show =  (typeof options.show=='undefined')?false:options.show;
    const axisposition = this.axisposition = (typeof options.axisposition=='undefined')?null:options.axisposition;
    const flipaxisdirection =this.flipaxisdirection = (typeof options.flipaxisdirection=='undefined')?false:options.flipaxisdirection;
    const callbacks =this.callbacks= options.callbacks || {};
    
          
    if(!d3[type])throw new Error(type + " is not a scale");      
    const scale = this.scale = d3[type]();
    for(let par in pars){
      if(!scale[par]){console.warn(par + " is not a parameter");}
      else{scale[par](pars[par]);}      
    }
    const self=this;
       const inputmin = this.inputmin = new Input({
        title:'',
        type:'number',
        // min:minmax[0],
        // max:minmax[1],
        value:viewable[0],
        callback:(value)=>{
          self.setDomain([parseFloat(value),self.viewable[1]]);
          if(self.callbacks.minmax)self.callbacks.minmax([parseFloat(value),self.viewable[1]]);
          self.graph.draw();
          // self.graph.draw();
        }
        
    })
       const inputmax = this.inputmax = new Input({
        title:'',
        type:'number',
        // min:minmax[0],
        // max:minmax[1],
        value:viewable[1],
        callback:(value)=>{
          self.setDomain([self.viewable[0],parseFloat(value)]);
          if(self.callbacks.minmax)self.callbacks.minmax([self.viewable[0],parseFloat(value)]);
          self.graph.draw();
          // self.graph.draw();
          
        }
        
    });
    
    this.doms={};
  }
  get axes(){return this._axes()}
  get SVG(){return this.graph.SVG}
  get graph(){return this.axes.graph}
  
  get element(){return this.axes.element}
  get width(){return this.graph.width}
  get height(){return this.graph.height} 

  
  render(){
    this.setRange();
    this.setDomain();
    const {element}=this;
    for(let id in this.doms){this.doms[id].remove();delete this.doms[id]}
    

    
    this.doms.graph = element.append("g");
  }

  renderEditable(){
    
    const {graph,axis,minmax,viewable}=this;
    const self=this;

    
    
    const _hitbox = this.doms.axis.node().getBoundingClientRect()
    const ticks = this.doms.axis.selectAll('text').nodes();
    
    
    // console.log()
    if(this.doms.hitbox)return;
    
    const hitbox =this.doms.hitbox = self.graph.element.append('div')
    .style('position','fixed')
    .style('top',_hitbox.top +'px')
    .style('left',_hitbox.left+'px')
    .style('width',_hitbox.width+'px')
    .style('height',_hitbox.height+'px')
    // console.log(_hitbox.top,_hitbox.left,_hitbox.width,_hitbox.height)
    
    const _minhitbox=ticks[0].getBoundingClientRect()
    const mingroup = hitbox.append('div')
    .style('display','none')
    .style('position','fixed')
    .style('top',_minhitbox.top +'px')
    .style('left',_minhitbox.left+'px')
    .style('width',_minhitbox.width+'px')
    .style('height',_minhitbox.height+'px')
    const _maxhitbox = ticks[ticks.length-1].getBoundingClientRect()
    const maxgroup = hitbox.append('div')
    .style('display','none')
    .style('position','fixed')
    .style('top',_maxhitbox.top +'px')
    .style('left',_maxhitbox.left+'px')
    .style('width',_maxhitbox.width+'px')
    .style('height',_maxhitbox.height+'px')
    
    
    // const maxgroup =  hitbox.append('div').style('position','absolute').style('display','none');
    
    // // const _axis = (!graph.isflip)?axis:axis=='x'?'y':'x';
    // if(axis=='x')hitbox.style('left','0px').style('bottom','10px').style('width','100%').style('min-height','18px').style('padding','36px 0 18px');
    // if(axis=='y')hitbox.style('left','0px').style('top','0px').style('bottom','0px').style('min-width','18px').style('padding','0 36px 0 0');
    // if(axis=='x')mingroup.style('left','15px');
    // if(axis=='x')maxgroup.style('right','0px');
    // if(axis=='y')mingroup.style('bottom','18px');
    // if(axis=='y')maxgroup.style('top','0px');
    
       

  
      // inputmin.render(mingroup).style("float",'left');
      // inputmax.render(maxgroup).style("float",'left');
      hitbox.on("mouseover",()=>{
        mingroup.style('display','block')
        maxgroup.style('display','block')
        hidebox.style('display','block')
        // hitbox.style('background','white')
      })
      hitbox.on("mouseout",()=>{
        // hitbox.style('background','')
        mingroup.style('display','none')
        maxgroup.style('display','none')
        hidebox.style('display','none')
      })
      const hidebox = hitbox.append('div').style('display','none').style('width','100%').style('height','100%')
      
      const svg = new SVG({
      style:{position:'absolute',padding:'0px',margin:'0px'},
      minwidth:_hitbox.width,
      minheight:_hitbox.height,
      margin:{top: 50, right: 0, bottom: 50, left: 0}});

      const graph1 = new Graph({yscale:{axis:'y',minmax:[0.1,10],viewable:[0.1,10],type:'scaleLinear',pars:{}},isyaxis:false,isxaxis:false,extent:[-1,0.1,1,10]});
      // yscale:{axis:'y',show:true,type:'scaleLinear',minmax:[0,1],editable:true},
      
      const s1= new Slider({
          value:1,
          r:10,
          width:1,
          type:'y',
          con:'mid',
          offset:0,
          isexterior:false,
          isinterior:false,
          iscursor:true,
          callbacks:{
              value:(value)=>{
                // console.log(value)
                self.scale.exponent(value);
                if(self.callbacks.exponent)self.callbacks.exponent(value);
                self.graph.draw();
                
                
              },
              color:()=>console.log('s1')}
          
      })
      
      svg.render(hidebox)
      svg.addGraph('graph1',graph1)
      graph1.addSlider('s1',s1);
      this.inputmin.render(mingroup);
      this.inputmax.render(maxgroup);
      
      // <input type="range" orient="vertical" />
    //   const s1= new Slider({
    // value:50,
    // width:2,
    // r:5,
    // type:'y',
    // con:'end',
    // offset:_hitbox.width*3/4,
    // isexterior:true,
    // isinterior:true,
    // iscursor:true,
    // callbacks:{
    //     value:(value)=>console.log('s1',value),
    //     color:()=>console.log('s1')}
    
    // })
    // this.graph.addSlider('mysldier',s1);
      
    
    
    
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
    this.graph.draw();
  }

  setRange(){
    const {axis,scale,width,height}=this;
    if(axis=='x')scale.rangeRound([0, width]);
    if(axis=='y')scale.range([height, 0]);
  }  
  setDomain(array){
    const {axis,scale}=this;
    if(array)this.viewable = array;
    if(this.inputmin)this.inputmin.setValue(this.viewable[0]);
    if(this.inputmax)this.inputmax.setValue(this.viewable[1]);
    this.scale.domain(this.viewable)
   
  }
  draw(){
    const {height,axis,doms,scale,show,axisposition,flipaxisdirection,editable,label}=this;
    if(show && axis=='x'){
      this.doms.graph.attr("transform", "translate(0," + height + ")");
      if(axisposition)this.doms.graph.attr('transform', 'translate(0,0)'.format(this.axes.y.scale(axisposition)))
      this.doms.axis = (flipaxisdirection)?this.dom.call(d3.axisTop(scale).ticks(6,'s')):this.doms.graph.call(d3.axisBottom(scale).ticks(6,'s'));
    }
    
    if(show && axis=='y'){
      if(axisposition)doms.graph.attr('transform', 'translate({0},0)'.format(this.axes.x.scale(axisposition)));
      this.doms.axis = (flipaxisdirection)?doms.graph.call(d3.axisRight(scale).ticks(6,'s')):this.doms.graph.call(d3.axisLeft(scale).ticks(6,'s'));
    }
    if(editable)this.renderEditable()
    
        // Label
      // text label for the y axis
    if(this.label){
      if(this.doms.label)this.doms.label.remove();
      if(axis=='y'){
        this.doms.label = this.doms.axis.append("text")
            .attr("transform", "rotate(-90)")
            .attr("fill", "black")
            .attr("y", 0 - this.SVG.margin.left)
            .attr("x",0 - (this.graph.height / 2))
            .attr("dy", "1em")
            .style("font-size", "1rem")
            .style("text-anchor", "middle")
            .text(this.label);     
      }
      if(axis=='x'){
        this.doms.label = this.doms.axis.append("text")
            .attr("fill", "black")
            .attr("y", 0 + this.SVG.margin.bottom/2)
            .attr("x",0 + (this.graph.width / 2))
            .attr("dy", "1em")
            .style("font-size", "1rem")
            .style("text-anchor", "middle")
            .text(this.label);     
      }      
         
    }

    
    
  }

  flip(){
    (this.axis=='x')?this.axis='y':this.axis='x';
    this.render();
    
  }



}