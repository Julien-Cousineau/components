'use strict';
const d3 = require('../../dist/d3.min.js');
import style from './style.scss'
export default  class Tooltip {
  constructor(){
    
  }
  show(e){
    const element = document.getElementsByTagName("body")[0];
    const dom = this.dom = d3.select(element)
                .append("div")
                .style('position','absolute')
                .style('width','100%')
                .style('height','100%')
                .style('z-index',1)
                

    const container = this.container = dom.append('div')
    .style("position","absolute")
    .style("top","0")
    .style("left","0")
    
    const arrow = container.append('div')
    .style("position"," absolute")
    .style("display"," block")
    .style("margin"," 0 -0.5rem")
    .style("left","0")
    .style("border-top"," 0.5rem solid transparent")
    .style("border-bottom"," 0.5rem solid transparent")
    .style("border-right"," 0.5rem solid black");
    

    this.body = container.append('div').attr('class','tooltipbox')
    .style('min-width','1rem')
    .style('min-height','1rem')
    .style('max-Width','40rem')
    .style('max-height','40rem')
    
    
    const self=this;
    dom.on('click mousedown',(e)=>self.hide(d3.event))
    
    e.stopPropagation();
    const domrect = e.target.getBoundingClientRect();
    const top = domrect.top;
    const left = domrect.right;
    
    const dif =domrect.top+100-window.innerHeight;
    const margin=dif<0?10:dif;
    const position = {top:top,left:left,margin:-margin-10}
    

    // this.body.style('margin',position.margin + 'px -5px')

    container.style('transform',' translate3d({0}px, {1}px, 0px)'.format(position.left,position.top))
    container.style('will-change',' transform')   
    container.style('margin-left', '.5rem');
    return this.body;
  }
  hide(e){
    const {dom} = this;
    if(e.target == dom.node()) this.remove();
    // dom.remove();
  }
  remove(){this.dom.remove()}
  
}