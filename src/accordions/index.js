'use strict';
import style from './style.scss';
// const d3 = require('../../dist/d3.min.js');
import Card  from '../card';
import Button from '../button';
// const { debounceD3Event, transparencyBackground } = require('../d3util');
export default class Accordions {
  constructor(options) {
    if (!options) options = {}
    const cards = this.cards = options.cards || {
        first:{title:'First',footer:null,body:new Button({title:'BTN2',value:1,callback:()=>console.log('btn1')})},
        second:{title:'Second',footer:null,body:new Button({title:'BTN2',value:1,callback:()=>console.log('btn1')})},

    };
  }
//   addCard(id,tab){
//     const {cards,ul,content}=this;

//     cards[id] = new Card(cards[id])
//     cards[id].render(content)
      
//   }
//   hideAll(){
//     const {cards}=this;
//     for(let id in cards)cards[id].hide();
//   }

  hideAll(){
    const {cards}=this;
    for(let id in cards){
      $(cards[id].bodydom.node()).collapse('hide')
    }
  }

  render(element) {
    this.element = element;
    const {cards}=this;

    
    const accordion = this.accordion = element.append("div").attr('class','accordion')
    const self=this;
    for(let id in cards){
        cards[id].card = accordion.append("div").attr('class','card')
        cards[id].header = cards[id].card.append("div").attr('class','card-header').on('click',()=>{self.hideAll();$(cards[id].bodydom.node()).collapse('show')})
        cards[id].headertitle = cards[id].header.append("h5").text(cards[id].title)
        cards[id].bodydom = cards[id].card.append("div").attr('class','collapse')
        cards[id].cardbody = cards[id].bodydom.append("div").attr('class','card-body')
        
        
        if(cards[id].body && cards[id].body.render)cards[id].body.render(cards[id].bodydom)
    }
  }


}