'use strict';
import style from './style.scss'
export default class DropdownList {
  constructor(options){
    if(!options)throw new Error("Dropdown needs options");   
    if(!options.values)throw new Error("Dropdown needs values");   
    this.className = options.className || '';   
    this.title = options.title || 'Title';   
    this.values = options.values;//{id,title,isOn,callback}
    this.icon = options.icon || 'fas fa-info-circle'

  }
  render(element){
    const {className,values,icon,title} = this;   
    const self = this;
    const group = this.group = element.append('div').style('display','inline-block')
   
    
    const button = this.button = element.append('button')
    .attr('class','btn dropdown-toggle {0}'.format(className))
    .attr('type','button')
    .attr('data-toggle','dropdown')
    .attr('aria-haspopup','true')
    .attr('aria-expanded','false')
    .attr('title',title)
    button.append('i').attr('class',icon)
    
    const menu = this.menu = group.append('div')
    .attr('class','dropdown-menu dropdownlist')
    .attr('aria-labelledby',"dropdownMenuButton")
    .on('click', function () {event.stopPropagation();});
    this.changelist();
    return group;
  }
  changelist(){
    const {values,menu} = this;   
    const items =this.items = {}
    const self = this;
    menu.html("")
    for(let id in values){
      const value = values[id]
      
      const dropdownitem = menu.append('div').attr('class','dropdown-item')
      .on('click',()=>{
        value.isOn=!value.isOn;
        if(value.isOn)input.node().checked=true;
        if(!value.isOn)input.node().checked=false;
        value.callback(id,value.isOn)
      })
      const formgroup = dropdownitem.append('div').attr('class','form-group')
      const formcheck = formgroup.append('div').attr('class','form-check');
      const input = formcheck.append('input').attr('class','form-check-input').attr('type','checkbox').on('click',()=>{
        event.stopPropagation();
        value.isOn=!value.isOn;
        value.callback(id,value.isOn);
      });
      const label = formcheck.append('label').attr('class','form-check-label').text(value.title);
      if(value.isOn)input.attr('checked',true)
    
    }
  }
}