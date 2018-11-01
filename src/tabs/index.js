'use strict';
import style from './style.scss';
// const d3 = require('../../dist/d3.min.js');
import Tab  from '../tab';
import Button from '../button';
// const { debounceD3Event, transparencyBackground } = require('../d3util');
export default class Tabs {
  constructor(options) {
    if (!options) options = {}
    this.tabs={};
    this.doms={};
    
  }

  addTab(id,obj){
    const {tabs,doms}=this;
    const self=this;
    tabs[id] = new Tab(obj);
    tabs[id]._tabs = ()=>self;
    tabs[id].render(doms.ul,doms.content);
    this[id]=tabs[id];
    return this[id];
  }
  hideAll(){
    const {tabs}=this;
    for(let id in tabs)tabs[id].hide();
  }

  render(element) {
    this.element=element;
    this.doms.ul = element.append("ul")
    .attr('class','nav nav-tabs')
    .attr('role','tablist');
    
    this.doms.content = element.append("div")
                               .attr('class','tab-content')
    return this;
  }


}