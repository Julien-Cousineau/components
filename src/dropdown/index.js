'use strict';
export default class Dropdown {
  constructor(options){
    if(!options)throw new Error("Dropdown needs options");   
    if(!options.values)throw new Error("Dropdown needs values");   
    this.className = options.className || '';   
    this.values = options.values;//{id,title,callback}
    this.active = options.active || this.values[Object.keys(this.values)[0]];
    this.callback = options.callback;
  }
  render(element){
    const {className,values,active,callback} = this;   
    const self = this;
    const group = this.group = element.append('div')
   
    
    const button = this.button = group.append('button')
    .attr('class','btn dropdown-toggle')
    .attr('type','button')
    .attr('data-toggle','dropdown')
    .attr('aria-haspopup','true')
    .attr('aria-expanded','false')
    .text(values[active].title)
    .on('click',()=>self.openDropdown())
    
    const menu = this.menu = group.append('div')
    .attr('class','dropdown-menu {0}'.format(className))
    .attr('aria-labelledby',"dropdownMenuButton");
    this.changelist();
    return group;
  }
  changelist(){
    const {values,active,callback,menu} = this;   
    const items =this.items = {}
    const self = this;
    menu.html("")
    for(let id in values){
      const value = values[id]
      const isactive =(id==active)?'dropdown-item active':'dropdown-item';
      const item = menu.append('a').attr('class','{0}'.format(isactive)).text(value.title);
      item.on("click",function(){
        self.changeTitle(id);
        if(callback)callback(id)
      })
      items[id]=item;
    }
  }
  changeTitle(id){
    const {button,values,items} = this;
    this.active=id;
    button.text(values[this.active].title);
    for(let id in values){      
      const isactive =(id==this.active)?'dropdown-item active':'dropdown-item';
      items[id].attr('class','{0}'.format(isactive));      
    }
  }
  openDropdown(){
      const {menu} = this;
  }
  
}