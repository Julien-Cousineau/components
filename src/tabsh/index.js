// 'use strict';
// // import style from './style.scss';
// // const d3 = require('../../dist/d3.min.js');
// import Button from '../button';
// import style from './style.scss';
// export default class TabsH {
//   constructor(options) {
//     if (!options) options = {}
//     this.title=options.title || 'MyTitle'
//     this.active = (typeof options.active === 'undefined') ? false : options.active;
//     this.content= options.content || new Button({title:'BTN1',value:1,callback:()=>console.log('btn1')});
//     this.tabs = options.tabs || {
//         layers:{title:'Layers',content:new Button()},
//         properties:{title:'Properties',content:new Button()},
        
//     }
//   }
  
  
// //   show(){
// //     this.tabs.hideAll();
// //     this.changeActive(true);
// //   }
// //   changeActive(active){
// //     this.active=active;
// //     this.a.attr('class','nav-link {0}'.format(this.active?'active':''));
// //     this.tabpane.attr('class','tab-pane fade {0}'.format(this.active?'show active':''));
    
// //   }
  
//   render(element) {
    
    
    
      
//     const {active,content,tabs}=this;
//     const self=this;
    
    
//     const dom = element.append('div').attr('class','accordion')
//     const pg = dom.append('div').attr('class','panel-group')
    
//     for(let id in tabs){
//         tabs[id].panel = pg.append('div').attr('class','panel panel-default')
//         tabs[id].header = tabs[id].panel.append('div').attr('class','panel-heading');
//         tabs[id].titledom =     tabs[id].header.append('h4').attr('class','panel-title')
//         tabs[id].a =     tabs[id].header.append('a').attr('data-toggle','collapse').attr('data-parent="#accordion" href="#collapseOne
        
        
        
//         tabs[id].bodydom = tabs[id].li.append('div').attr('class','accordion-content prop-content')
//         tabs[id].seperator = tabs[id].li.append('div').attr('class','accordion-separator')
        
//         if(tabs[id].content && tabs[id].content.render)tabs[id].content.render(tabs[id].bodydom);
//     }
//   }


// }