'use strict';
import style from './style.scss';
const d3 = require('../../dist/d3.min.js');
const { debounceD3Event, transparencyBackground } = require('../d3util');
export default class BarContainer {
  constructor(options) {
    if (!options) options = {}
    this.position = options.position || 'top';
    this._size = options.size || 100;
    // this.isOn =  (typeof options.isOn === 'undefined') ? true : options.isOn;
    this.priority =  (typeof options.priority === 'undefined') ? 0 : options.priority;
    this.isIcon = (typeof options.isIcon === 'undefined') ? false : options.isIcon;
    this.isHandle = (typeof options.isHandle === 'undefined') ? false : options.isHandle;
    this.isShow = (typeof options.isShow === 'undefined') ? true : options.isShow;
    this.cursormargin = options.cursormargin || 40;
  }
  get barcontainer(){return this._barcontainer()}
  get parentwidth() { return this.parent.node().getBoundingClientRect().width }
  get parentheight() { return this.parent.node().getBoundingClientRect().height }
  get icon(){
    const {position,isShow}=this;
    if(position=='top')return (isShow)?'\f077':'\f078';
    if(position=='bottom')return (isShow)?'\f077':'\f078';
    if(position=='left')return (isShow)?'\f053':'\f053';
    if(position=='right')return (isShow)?'\f054':'\f054';
  }
  get size(){return this._size;}
  get sizewithmargin(){return this._size+this.cursormargin}
  get osize(){return (this.type=='vertical')?this.width:this.height;}
  get oposition(){
     const {bars}=this.barcontainer;
    return (this.type=='horizontal' && bars.top.isShow)?bars.top.size:0;
  }
  get width(){return '100%';}
  get height(){
      const {bars}=this.barcontainer;
      let height=0;
      if(bars.top.isShow) height+=bars.top.size;
      if(bars.bottom.isShow) height+=bars.bottom.size;
      return height==0?'100%':'calc(100% - {0}px)'.format(height);
  }
  get type(){
    return (this.position=='top' || this.position=='bottom')? 'vertical':'horizontal';
  }
  get positiontype(){return (this.type=='vertical')?'left':'top';}
  get sizetype(){return (this.type=='vertical')?'height':'width';}
  get osizetype(){return (this.type=='vertical')?'width':'height';}
  getMarginStyle(){
    const {position,size,elementmargin,oposition,osize,positiontype,sizetype,osizetype}=this;
    elementmargin.style(position,0).style(positiontype,oposition+"px").style(sizetype,size + "px").style(osizetype,osize);
  }
  getStyle(){
       const {position,size,element,positiontype,sizetype,osizetype}=this;
       element.style(position,0).style(positiontype,0).style(sizetype,size + "px").style(osizetype,"100%").style('background','blue');
  }
  mouseover(){
    const {sizewithmargin,elementmargin,sizetype}=this;
    if(this.isShow)elementmargin.style(sizetype,sizewithmargin + "px");
    if(!this.isShow)elementmargin.style(sizetype,"2.25rem")//.style('background','black');
  }
  mouseout(){
    const {size,elementmargin,sizetype}=this;
    if(this.isShow)elementmargin.style(sizetype,size + "px");
    if(!this.isShow)elementmargin.style(sizetype,"16px")//.style('background','black');
    
  }
  onclick(){
    const {element,elementmargin,size,type,position,sizetype}=this;
    this.isShow =!this.isShow;
    this.mouseover()
    if(this.isShow)element.style('margin','');
    (!this.isShow)?element.attr('class','bar bar' + position + ' unactive'):
                   element.attr('class','bar bar' + position);
    if(!this.isShow){
      (type=='vertical')?element.style('margin','-{0}px 0'.format(size)):
                         element.style('margin','0 -{0}px'.format(size));
      
      
    }
    if(type=='vertical'){
        this.barcontainer.bars.left.getMarginStyle();this.barcontainer.bars.left.getStyle();
        this.barcontainer.bars.right.getMarginStyle();this.barcontainer.bars.left.getStyle();
      }
      
    
  }
  
  render(parent) {
    this.parent = parent;
    const {position,priority}=this;
    const elementmargin = this.elementmargin = parent.append("div")
    .attr('class','barcontainer')
    .style('position','absolute')
    .style('z-index',priority)
    .style('overflow','hidden')
        this.getMarginStyle();
    
    
    const element = this.element = elementmargin.append("div")
    .style('position','absolute')
      .attr('class', 'bar bar' + position)
      // .style('width','100%')
      // .style('height','100%')

this.getStyle();

    if(this.isHandle)this.renderHandle()
      


    const self=this;
    
    if(this.isIcon){
    
      const button = this.button=element.append('div')
      .attr('class','button')
      .on('click',()=>self.onclick())
      
      
      
        elementmargin.on('mouseover',()=>{
          self.mouseover();
          button.attr('class','button show')
        })
        elementmargin.on('mouseout',()=>{
          self.mouseout();
          button.attr('class','button')})
    }
    
    // if(!this.isOn)element.style('display','none')

    
  }
  renderHandle(){
    
  }

}