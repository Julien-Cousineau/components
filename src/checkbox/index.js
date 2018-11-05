'use strict';
import style from "./style.scss";
export default class Checkbox {
  constructor(options){
    if(!options)options={};
    if(!options.callback)throw new Error("Checkbox needs a callback");
    this.title = options.title || '';
    this.icons = options.icons || null; // {on:'fa',off:'fa'}
    this.disabled = options.disabled || null;
    this.callback=options.callback;
    this.value =(typeof options.value==='undefined')?false:options.value;
    
  }
  render(element){
    if(!element)throw new Error("Checkbox needs an element to render");
    const {title,value,callback}=this;
    const div =  element.append('div').attr('class','mycheckbox');
    
    if(!this.icons){
      div.classed('form-check',true);
      const input = this.input = div.append('input')
      .attr('class','form-check-input')
      .attr('type','checkbox')
      .attr('{0}'.format(value?'checked':'unchecked'),'');
      
      if(this.disabled)input.attr('disabled',true)
      
      const label = this.label = div.append('label').text(title);
      
      const self=this;
      input.on("click",function(){self.value=this.checked;callback(this.checked)});      
    }  else {
      const i =this.i= div.append('i');
      this.setStyle()
      i.on("click",()=>{this.value=!this.value;this.setStyle();callback(this.value)});      
    }
    return this;
  }
  setStyle(){
    
    (this.value)?this.i.attr('class', 'on ' + this.icons.on):
                 this.i.attr('class', 'off ' + this.icons.off);
  }
  setActive(value){
    this.value=value;
    this.setStyle();
    return this;
  }
}