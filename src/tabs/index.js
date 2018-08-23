'use strict';
import style from './style.scss';
// const d3 = require('../../dist/d3.min.js');
import Tab  from '../tab';
import Button from '../button';
// const { debounceD3Event, transparencyBackground } = require('../d3util');
export default class Tabs {
  constructor(options) {
    if (!options) options = {}
    const tabs = this.tabs = options.tabs || {
        first:{title:'First',active:true,content:new Button({title:'BTN2',value:1,callback:()=>console.log('btn1')})},
        second:{title:'Second',active:false,content:new Button({title:'BTN3',value:1,callback:()=>console.log('btn1')})},
        third:{title:'Third',active:false,content:new Button({title:'BTN4',value:1,callback:()=>console.log('btn1')})},
        four:{title:'Four',active:false,content:new Button({title:'BTN5',value:1,callback:()=>console.log('btn1')})},
        five:{title:'Five',active:false,content:new Button({title:'BTN6',value:1,callback:()=>console.log('btn1')})},
    };
  }
  addTab(id,tab){
    const {tabs,ul,content}=this;
    const self=this;
    tabs[id] = new Tab(tabs[id])
    tabs[id]._tabs = ()=>self;
    tabs[id].render(ul,content)
      
  }
  hideAll(){
    const {tabs}=this;
    for(let id in tabs)tabs[id].hide();
  }

  render(parent) {
    this.parent = parent;
    const {tabs}=this;

    

    const ul = this.ul = parent.append("ul")
    .attr('class','nav nav-tabs')
    .attr('role','tablist')
    
const content = this.content = parent.append("div")
    .attr('class','tab-content')
    
    for(let id in tabs)this.addTab(id,tabs[id])
    
    
  }


}