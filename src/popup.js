'use strict';
const d3 = require('d3');

module.exports = class Popup {
  constructor(){
    
  }
  render(element){
    const containerp = this.containerp = element.append('div').attr('class','popoverparent');
    const container = this.container = containerp.append('div').attr('class','popover');
    const arrow = container.append('div').attr('class','arrow')
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