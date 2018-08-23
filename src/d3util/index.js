'use strict';
const d3 = require('../../dist/d3.min.js');
// let currentevent = require('d3-selection').event;


// Transparency background
export const transparencyBackground = `linear-gradient(45deg, #808080 25%, transparent 25%), 
                    linear-gradient(-45deg, #808080 25%, transparent 25%), 
                    linear-gradient(45deg, transparent 75%, #808080 75%), 
                    linear-gradient(-45deg, transparent 75%, #808080 75%)`;
                    
// Debounce for D3 Event
export function debounceD3Event(func, wait, immediate) {
    var timeout;
    
    return function() {
        var context = this;
        var args = arguments;
        var evt  = d3.event;

        var later = function() {
            timeout = null;
            if (!immediate) {
                var tmpEvent = d3.event;
                d3.event = evt;
                func.apply(context, args);
                d3.event = tmpEvent;
            }
        };

        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) {
            var tmpEvent = d3.event;
            d3.event = evt;
            func.apply(context, args);
            d3.event = tmpEvent;
        }

    };
};


// async function
export async function getJson(url){
  let data = await (await (fetch(url)
    .then(res => {
      return res.json()
    })
    .catch(err => {
      console.log('Error: ', err)
    })
  ))
  return data
}


