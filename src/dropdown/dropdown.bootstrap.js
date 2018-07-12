'use strict';
export default class Dropdown {
  constructor(options){
    if(!options)throw new Error("Dropdown needs options");   
    if(!options.values)throw new Error("Dropdown needs values");   
    this.classes = options.classes || '';   
    this.values = options.values;//{id,title,callback}    
    this.active = options.active || this.values[Object.keys(this.values)[0]].id;
  }
  render(element){
    const {classes,values,active} = this;   
    const self = this;
    const button = this.button = element.append('button')
    .attr('class','btn btn-primary dropdown-toggle')
    .attr('type','button')
    .attr('data-toggle','dropdown')
    .attr('aria-haspopup','true')
    .attr('aria-expanded','false')
    .text(values[active].title)
    .on('click',()=>self.openDropdown())
    const menu = this.menu = element.append('div')
    .attr('class','dropdown-menu {0}'.format(classes))
    .attr('aria-labelledby',"dropdownMenuButton");
    const items =this.items = {}
    for(let id in values){
      const value = values[id]
      const isactive =(id==active)?'dropdown-item active':'dropdown-item';
      const item = menu.append('a').attr('class','{0}'.format(isactive)).text(value.title);
      item.on("click",function(){self.active=id;self.changeTitle();value.callback(id)})
      items[id]=item;
    }    
  }
  changeTitle(){
    const {button,values,active,items} = this;
    button.text(values[active].title);
    for(let id in values){      
      const isactive =(id==active)?'dropdown-item active':'dropdown-item';
      items[id].attr('class','{0}'.format(isactive));      
    }
  }
  openDropdown(){
      const {menu} = this;
      
  }
}