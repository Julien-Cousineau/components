'use strict';
export default class Dropdown {
  constructor(options){
    if(!options)throw new Error("Dropdown needs options");   
    if(!options.values)throw new Error("Dropdown needs values");   
    this.classes = options.classes || '';   
    this.values = options.values;//{id,title,callback}    
    this.active = options.active || this.values[Object.keys(this.values)[0]];
    this.callback = options.callback || null;
  }
  render(element){
    const {classes,values,active,callback} = this;   
    // const self = this;
    const dom = this.dom = element.append('select');
    if(callback)dom.on('change',()=>callback(dom.node().value));
    for(let id in values){
        const value = values[id];
        const option = dom.append('option')
                          .attr('value',id)
                          .text(value.title);
      if(active==id)option.attr('selected',true);
    }
    
  }
}