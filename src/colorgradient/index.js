'use strict';
const d3 = require('../../dist/d3.min.js');
import  LContainer from '../lcontainer';
import SVG from '../svg';
import Graph from '../graph';
import ColorSlider from '../colorslider';
import Color from '../color';
const {transparencyBackground} = require('../d3util');
import Gradient from '../gradient';

export default  class ColorGradient {
  constructor(options){
    if(!options)options={};
    this.inputsliders = options.sliders || {};
    
    this.padding = options.padding || 8;
    this.width = options.width || 20;
    this.height = (options.height-this.padding) || 200;
    this.background = options.background || 'linear-gradient(rgb(255, 226, 89), rgb(255, 167, 81))';
    this.gradient = new Gradient({stops:[0,1],colors:[new Color(),new Color()]})
    this.rendering=true;
    
    this.callback = options.callback || null; 
    
    const addable = this.addable = (typeof options.addable ==='undefined')?false:options.addable;
    
    this.sliders = {};
    
    const self=this;
    this.counter=1;
    const colorScale = this.colorScale = d3.scaleLinear()
        .domain([0, 1])
        .range(['#d73027', '#1a9850'])
        .interpolate(d3.interpolateRgb); 
    
    const graphcallbacks=(addable)?
          {click:function(event){
            const value=self.graph.axes.y.scale.invert(event.offsetY-8); 
            const {r,g,b,opacity} = d3.color(colorScale(1-value));
            
            const newslider=new ColorSlider({
              color:new Color({r:r,g:g,b:b,a:opacity}),
              value:value,r:8,type:'y',con:'mid',
              isexterior:false,
              isinterior:false,
              iscursor:false,
              iscursorcircle:true,
              callbacks:{
                value:(value)=>console.log('s2',value)}
            });
            self.addSlider(newslider);
          }}:{};
  
    const svg = this.svg = new SVG({
      style:{position:'absolute',padding:this.padding+'px',margin:-this.padding+'px'},
      minwidth:this.width,minheight:this.height,
      margin:{top: 0, right: 0, bottom: 0, left: 0}});
    
    const graph = this.graph = new Graph({
      isyaxis:false,isxaxis:false,callbacks:graphcallbacks
    });
    
    
    
  }
  
  updateColorScale(){
    const {colorScale}=this;
    const array =this.sortSliders();
    const stops = array.map(slider=>1-slider.value);
    const colors = array.map(slider=>slider.color);
    if(stops[0]!=0){stops.unshift(0);colors.unshift(colors[0])}
    if(stops[stops.length-1]!=1){stops.push(1);colors.push(colors[colors.length-1])}
    
    
    const d3colors = array.map(slider=>{      
      const {r,g,b,a}=slider.color.rgba;
      return d3.rgb(r,g,b,a);
    });
    
   
    colorScale.domain(d3colors)
              .range(colors);
    
    const gradient = new Gradient({stops:stops,colors:colors});
    if(this.callback && !this.rendering)this.callback(gradient);
  }

  addSlider(slider){

    const {graph,sliders} = this;
    const _id='s{0}'.format(this.counter++);
    const self=this;
    if(slider.color){
      slider.isremovable = true;
      slider.callbacks.removal=function(){
        // Remove if more than 1 slider
        if(Object.keys(sliders).length>1){
          slider.remove(); delete sliders[_id];  
        }        
      }
      slider.callbacks.updategradient=function(){self.changeBackgroundfromSliders()}
      slider.callbacks.value=function(){self.changeBackgroundfromSliders()}
    }
    sliders[_id]=slider;
    graph.addSlider(_id,slider);
  }
  render(element){
    if(!element)throw new Error("ColorGradient needs an element to render");
    const {svg,graph,padding,height,width,inputsliders,background}=this;
    const bsize =6;
    
    const dom = this.dom=LContainer(element,width,height,padding);

    const gradientb = dom.append('div')
    .style('position','absolute')
    .style('box-sizing','content-box')
    .style('width', (width-2)+'px')
    .style('height', height-2+'px')
    .style('background', transparencyBackground)
    .style('background-size', '{0}px {0}px'.format(bsize))
    .style('background-position', '0 0, 0 {0}px, {0}px -{0}px, -{0}px 0px'.format(bsize*0.5))
      
    const gradient = this.gradient=dom.append('div')
    .style('position','absolute')
    .style('box-sizing','content-box')
    .style('border', '1px solid black')
    .style('border-radius', '5px')
    .style('background', background)    
    .style('width', (width-2)+'px')
    .style('height', height-2+'px')
   
    svg.render(dom);    
    svg.addGraph('graph',graph);
    const self=this;
    for(let id in inputsliders){
      const slider = inputsliders[id];
      this.addSlider(slider);
    }
    if(inputsliders)this.changeBackgroundfromSliders();
    this.rendering=false;
  }
  changeBackground(background){
    this.gradient.style('background',background);
  }
  sortSliders(){
    const {sliders}=this;
    const array=[]
    for(let id in sliders){
      const slider=sliders[id];
      slider.id = id;
      if(slider.color){
        array.push(slider)
      }
    }
    array.sort(function(a, b) {return b.value - a.value;})
    return array;
  }
  changeBackgroundfromSliders(){
    this.updateColorScale();
    const array=this.sortSliders();    
    const strstr = array.map(slider=>{      
      return '{0} {1}%'.format(slider.color.rgba2str(),(1-slider.value)*100)    
    })
    if(strstr.length ==1)this.changeBackground('{0}'.format(strstr.join(',')));       
    if(strstr.length>1)this.changeBackground('linear-gradient({0})'.format(strstr.join(',')));    
  }
}
