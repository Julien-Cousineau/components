'use strict';
export default  class Popover {
  constructor(options){
    if(!options)options={}
    this.title = options.title || "{Name}";
    this.width = options.width || 275;
    this.height = options.height || 360;
    this.header = (typeof options.header==='undefined')?true:options.heaer;
    
  }
  render(element){
    const {title,width,height,header} = this;
    const container = this.container = element.append("div")
    .style('position','absolute')
    .style('width',width + 'px')
    .style('height',height + 'px')
    .style('margin','5px')
    .style('color','#73879C')
    .style('transition','absolute')
    .style('box-shadow', '0 2px 5px rgba(0,0,0,.26)')
    .style('overflow', 'hidden')
    .style('-webkit-column-break-inside', 'avoid')
    .style('-moz-column-break-inside', 'avoid')
    .style('column-break-inside', 'avoid')
    .style('pointer-events', 'auto')
 
    const trans = container.append("div")
    .style('position','position')
    .style('width','100%')
    .style('heght','100%')
    .style('background','#fff')
    .style('opacity',0.75)
    .style('border','1px solid #E6E9ED')
     
    if(header){
          const titlebar = container.append("div")
    .style('padding','1px 6px 0px 6px')
    .style('margin','0')    
    .style('height','26px')
    .style('color','#73879C')
    .style('opacity','0.99')
    
    const titledom = titlebar.append("span").append("h2")
    .style('display', 'inline-block')
    .style('white-space', 'nowrap')
    .style('text-overflow', 'ellipsis')
    .style('font-size', '15px')
    .style('margin-bottom', '0')
    .text(title);
    
    const nav = titlebar.append("ul")
    .attr('class','nav navbar-right panel_toolbox')
    .style('float', 'right!important')
    .style('margin-right', 0)
    
    const close = nav.append('li').append('a').attr('class','close-link')
    const closeicon = close.append('i').attr('class','fa fa-times')
    titlebar.append('div').attr('class',"clearfix");
      
    }
    const content = this.content = container.append('div').attr('class',"content");
  }
}