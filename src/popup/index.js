'use strict';
const d3 = require('../../dist/d3.min.js');

export default  class Popup {
  constructor(){
    
  }
  render(element){
    const containerp = this.containerp = element.append('div')
    .style("position",'absolute')
    .style("z-index",'1060')
    .style("display",'none')
    .style("height",'100%')
    .style("width",'100%');

    const container = this.container = containerp.append('div')
    .style("position","absolute")
    .style("top","0")
    .style("left","0")
    .style("z-index"," 1061");
    
    const arrow = container.append('div')
    .style("position"," absolute")
    .style("display"," block")
    .style("margin"," 0 -0.5rem")
    .style("left","0")
    .style("border-top"," 0.5rem solid transparent")
    .style("border-bottom"," 0.5rem solid transparent")
    .style("border-right"," 0.5rem solid black");
    

    this.body = container.append('div').style('margin','-5px')
    const self=this;
    containerp.on('click mousedown',(e)=>self.hide(d3.event))

    
  }
  show(position){
    const {containerp,container,body} = this;
    body.style('margin',position.margin + 'px -5px')
    containerp.style('display','block')
    container.style('transform',' translate3d({0}px, {1}px, 0px)'.format(position.left,position.top))
    container.style('will-change',' transform')   
    container.style('margin-left', '.5rem');
  }
  hide(e){
    const {containerp,container} = this;

    if(e.target == containerp.node()) containerp.style('display','none');

    
    
  }
  
}