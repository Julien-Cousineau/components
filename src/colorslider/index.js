'use strict';
const d3 = require('../../dist/d3.min.js');
import Slider from '../slider';
import Popup from '../popup';
import Picker from '../picker';

export default  class ColorSlider extends Slider {
  constructor(options){
    super(options);
    const rgba = this.rgba = options.rgba || {r:255,g:0,b:0,a:1};
    this.popup = new Popup();    
    const self = this;
    this.picker = new Picker({
     isstatic:true,
     isresize:false,
     isheader:false,
     width:275,
     height:360,     
      rgba:rgba,
      callback:function(rgba){self.changeColor(rgba)}
      
    })    
    
    this.callbacks.color = function(dom){
      d3.event.stopPropagation();
      const domrect = this.getBoundingClientRect();
      const top = domrect.top;
      const left = domrect.right;
      const dif =domrect.top+self.picker.height-window.innerHeight;
      const margin=dif<0?10:dif;
      self.showPicker({top:top,left:left,margin:-margin-10})
    }
    
    
  }
  showPicker(position){
    const {circle,popup,callbacks}=this;
    if(circle)popup.show(position);    
  }
  changeColor(rgba){
    const {circle}=this;
    this.rgba = rgba;
    const {r,g,b,a}=rgba;   
    circle.style('fill','rgba({0},{1},{2},{3})'.format(r,g,b,a))
    this.callbacks.updategradient(rgba);
  }
  render(){       
    super.render();
    const {circle,callbacks,picker}=this;
    const element = document.getElementsByTagName("body")[0];
    this.popup.render(d3.select(element))
    picker.render(this.popup.body);
  }
}