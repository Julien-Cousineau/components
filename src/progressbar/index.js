/*global $*/
'use strict';
import style from './style.scss'
export default class ProgressBar {
  constructor(options) {
    if (!options) options = {}
    this.istext = (typeof options.istext == 'undefined') ? true : options.istext;
    }
  render(element) {
    const dom =this.dom=element.append('div').attr('class','progress')
    const text = this.text =  dom.append('div')
    .style('width','100%')
    .style('justify-content','center')
    .style('text-align','center')
    .style('white-space','nowrap')
    .style('display','flex')
    .style('flex-direction','column')
    .style('position','absolute')
    .style('font-weight','bold')
    
    if(this.istext)text.text('0%')
    
    const bar = this.bar = dom.append('div')
    .attr('class','progress-bar progress-bar-striped progress-bar-animated')
    .attr('role','progressbar')
    .attr('aria-valuenow','0')
    .attr('aria-valuemin','0')
    .attr('aria-valuemax','100')
    .style("width","0%")
     return dom;
    
  }
  update(con,value){
      value = con==0?0:value;
      value = con==2?1:value;
      if(this.istext)this.text.text((Math.ceil(value*100)).toString() + '%');
      this.bar.attr('aria-valuenow', value.toString()).style("width",(value*100).toString() + '%');
  }
}


