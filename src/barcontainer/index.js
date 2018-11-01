'use strict';
// import style from './style.scss';
const d3 = require('../../dist/d3.min.js');
import Bar  from '../bar';
const {extend} = require('@julien.cousineau/util');
const { debounceD3Event, transparencyBackground } = require('../d3util');
export default class BarContainer {
  constructor(options) {
    if (!options) options = {}
    const bars = this.bars = options.bars || {top:{isOn:true,priority:1},bottom:{isOn:true,priority:1},left:{isOn:true,priority:0},right:{isOn:true,priority:0}};
    const self=this;
    for(let id in bars){
 
        bars[id] = new Bar(extend(bars[id],{position:id}))
        bars[id]._barcontainer = ()=>self;
 

      
    };

  }

  get parentwidth() { return this.parent.node().getBoundingClientRect().width }
  get parentheight() { return this.parent.node().getBoundingClientRect().height }
  
  // addBar(bar){
  //   if(!bar)throw new Error("addBar needs a Bar Object");
  //   if(this.bars[bar.id])throw new Error("Bar already exist in BarContainer"); 
    
  //   const self=this;
  //   bar._barcontainer = ()=>self;
  //   this.bars[bar.id]=bar;
  // }
  
  render(parent) {
    const {bars}=this;
    this.parent = parent;
    const element = this.element = parent.append("div")
      .attr('class', 'barcontainer')
      .style('width', '100%')
      .style('height','100%');
      
      
 
    
    const content = this.content = element.append("div")
      .attr('class', 'barcontainercontent')
      .style('position','absolute')
      .style('width', 'calc(100% - {0}px)'.format(bars.left.size+bars.right.size))
      .style('height','calc(100% - {0}px)'.format(bars.top.size+bars.bottom.size))
      .style('top','{0}px'.format(bars.top.size))
      .style('left','{0}px'.format(bars.left.size))
    for(let id in bars){
     if(bars[id].isOn){
      bars[id].render(element);
     }
    }
    
    return this;
  }


}