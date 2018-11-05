'use strict';
export default function(element,width,height,padding){
     return element
    .append('div')
    .style('width',(width+2*padding)+'px')
    .style('height',(height+2*padding)+'px')
    .append('div')
    .style('position','absolute')
    .style('height',height+'px')
    .style('margin',padding + 'px')
    .style('width',width+'px')
 };

    