'use strict';
export default class Checkbox {
  constructor(options){
    if(!options)options={};
    if(!options.callback)throw new Error("Checkbox needs a callback");
    this.title = options.title || '';
    this.callback=options.callback;
    this.value =(typeof options.value==='undefined')?false:options.value;
    
  }
  render(element){
    if(!element)throw new Error("Checkbox needs an element to render");
    const {title,value,callback}=this;
    const div =  element.append('div')
    .attr('class','form-check');
    
    const input = this.input = div.append('input')
    .attr('class','form-check-input')
    .attr('type','checkbox')
    .attr('{0}'.format(value?'checked':'unchecked'),'');
    
    const label = this.label = div.append('label').text(title);
    
    const self=this;
    input.on("click",function(){self.value=this.checked;callback(this.checked)});
  }
}