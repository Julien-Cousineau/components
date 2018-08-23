'use strict';
// import style from './style.scss';
// const d3 = require('../../dist/d3.min.js');
import Button from '../button';
import style from './style.scss';
export default class Tab {
  constructor(options) {
    if (!options) options = {}
    this.title=options.title || 'MyTitle'
    this.active = (typeof options.active === 'undefined') ? false : options.active;
    this.content= options.content || new Button({title:'BTN1',value:1,callback:()=>console.log('btn1')});
  }
  get tabs(){return this._tabs()}
  hide(){this.changeActive(false)}
  show(){
    this.tabs.hideAll();
    this.changeActive(true);
  }
  changeActive(active){
    this.active=active;
    this.a.attr('class','nav-link {0}'.format(this.active?'active':''));
    this.tabpane.attr('class','tab-pane fade {0}'.format(this.active?'show active':''));
    
  }
  
  render(ul,container) {
    const {active,content,title}=this;
    const self=this;
    this.ul = ul;
    this.container = container;
    const li = this.li = ul.append("li").attr('class','nav-item')
    const a = this.a = li.append("a")
    .attr('href','#')
    .text(title)
    .on("click",()=>self.show())
    const tabpane = this.tabpane = container.append('div')
    this.changeActive(active)
    const tabpanecontent = content.render(tabpane);
  
  }


}