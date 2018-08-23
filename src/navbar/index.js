'use strict';
import style from './style.scss';
// const d3 = require('../../dist/d3.min.js');
// const { debounceD3Event, transparencyBackground } = require('../d3util');
import logo from "../../assets/sig-eng.png";


export default class Navbar {
  constructor(options) {
    if (!options) options = {}
    this.title = options.title || 'My Title'
    this.items = options.items || {
      home:{title:'Name of Application',className:'active mr-md-2'},
      lang:{title:'en',callback:()=>console.log("language")},
      
      profile:{dropdown:{
        settings:{title:'Settings',icon:'fas fa-cog',callback:()=>console.log("setings")},
        info:{title:'Info',icon:'fas fa-info-circle',callback:()=>console.log("info")},
        divider:{className:"dropdown-divider"},
        sign:{title:'Sign In',icon:"fas fa-sign-in-alt",callback:()=>{console.log('sign')}},
      }}
    };
    
    
    }
  render(parent) {
    const { items,title } = this;
    this.parent = parent;
    const nav = this.nav = parent.append('nav')
    .attr('class','navbar navbar-expand-lg navbar-dark bg-dark')
    const span = nav.append('a').attr('class',"navbar-brand")
    const img  = span.append('img').attr('class','invert mr-md-4').attr('src',logo).style('opacity',0.75)
    // span.append('div').attr('class','navbar-text').text(title)
    const navbartoggler = nav.append('button').attr('class','navbar-toggler')        
    .attr('type','button').attr('data-toggle','collapse').attr('data-target','#navbarNavDropdown').attr('aria-controls','navbarNavDropdown').attr('aria-label','Toggle navigation').attr('aria-expanded','false')
    const navbartogglerspan = navbartoggler.append('span').attr('class','navbar-toggler-icon')        
    const collapse = nav.append('div').attr('class','collapse navbar-collapse').attr('id','navbarNavDropdown')
    const ul = collapse.append('ul').attr('class','nav navbar-nav ml-auto')
    
    for(let id in items){
      const {title,className,icon,callback,dropdown} = items[id];
      
      if(!dropdown){
        const item = items[id].element = ul.append('li').attr('class','nav-item').append('a').attr('href',"#")
        if(title && !icon)item.attr('class','nav-link ' + className).text(title)
        if(icon){
          const span = item.attr('class','nav-link p-2').append('span')
          span.append('i').attr('class',icon)
          span.append('span').attr('class','ml-2').text(title)
        }
        if(callback)item.on('click',callback)
      } else {
        const item = items[id].element = ul.append('li').attr('class','nav-item dropdown')
        item.append('a').attr('class',"nav-link dropdown-toggle")
        .attr('href',"#") 
        .attr('id',"navbarDropdownMenuLink") 
        .attr('role',"button") 
        .attr('data-toggle',"dropdown") 
        .attr('aria-haspopup',"true") 
        .attr('aria-expanded',"false")
        .append('i').attr('class','fas fa-user-circle fa-lg')
        const dropdownmenu = item.append('div').attr('class','dropdown-menu dropdown-menu-right').attr('aria-labelledby',"navbarDropdownMenuLink")
        for(let i in dropdown){
          const {title,icon,className,callback}=dropdown[i];
          if(i=='divider'){dropdownmenu.append('div').attr('class',"dropdown-divider")}
          else {
          const ddmi =dropdown[i].element= dropdownmenu.append('a').attr('class',"dropdown-item").attr('href',"#")
            if(className)ddmi.attr('class',className)
            if(title && !icon)ddmi.text(title)
            if(icon){
              const span = ddmi.append('span')
              span.append('i').attr('class',icon)
              span.append('span').attr('class','ml-2').text(title)
            }
            if(callback)ddmi.on('click',callback)  
          }
          
        }
      }
      
    }
    
                
                
  }


}