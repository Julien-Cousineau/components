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
    this.callbacks = options.callbacks || {active:null};
    this.doms={};
  }
  get tabs(){return this._tabs()}
  hide(){this.changeActive(false);return this;}
  show(){
    this.tabs.hideAll();
    this.changeActive(true);
    return this;
  }
  changeActive(active){
    this.active=active;
    this.doms.a.attr('class','nav-link {0}'.format(this.active?'active':''));
    this.doms.content.attr('class','tab-pane fade {0}'.format(this.active?'show active':''));
    if(active && this.callbacks.active)this.callbacks.active();
    return this;
  }
  
  render(ul,container) {
    const {title}=this;
    const self=this;
    this.doms.ul = ul;
    this.doms.container = container;
    const li = this.doms.li = ul.append("li").attr('class','nav-item');
    const a = this.doms.a = li.append("a")
                              .attr('href','#')
                              .text(title)
                              .on("click",()=>self.show());
    this.doms.content = container.append('div');
    this.changeActive(this.active);
    return this;
  }


}