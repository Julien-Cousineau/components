(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ui = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.util = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

// String :Formatter, Python approach to add values in strings. 
if (!String.prototype.format) {
    String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined' ?
                args[number] :
                match;
        });
    };
}

// Extract host name from url
if (!String.prototype.getHostName) {
    String.prototype.getHostName = function() {
        let match = this.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
        if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) return match[2];
        return null;
    };
}

// String : replaceAll
if (!String.prototype.replaceAll) {
    String.prototype.replaceAll = function(search, replacement) {
        let target = this;
        return target.replace(new RegExp(search, 'g'), replacement);
    };
}

// String : Add zeros(or c) infront of numbers.
if (!String.prototype.padZero) {
    String.prototype.padZero= function(_len, _c){
        let s= '', 
            c= _c || '0', 
            len= (_len || 2)-this.length;
        while(s.length<len) s+= c;
        return s+this;
    };
}

// Date : Add hours
if (!Date.prototype.addHours) {
    Date.prototype.addHours = function(h) {    
        this.setTime(this.getTime() + (h*60*60*1000)); 
        return this;   
    };
}

// Number : Convert to String, add zeros(or c) infront of numbers.
if (!Number.prototype.padZero) {
    Number.prototype.padZero= function(len, c){
        return String(this).padZero(len,c);
    };
}

// Number : Clamp number between min and max
if (!Number.prototype.clamp) {
    Number.prototype.clamp = function(min, max) {
        return Math.min(Math.max(this, min), max);
    };
}

// Number : Create simple range
if (!Array.prototype.range) {
    Array.prototype.range = function() {
        const len = this.length;
        for(let i=0;i<len;i++)this[i]=i;
        return this;
    };
}

// Array : Calculate max value
if (!Array.prototype.max) {
    Array.prototype.max = function(){
        var max = -Infinity, len = this.length;
        for (let i=0 ; i < len; i++ )
            if ( this[i] > max ) max = this[i];
        return max;
    };
}

// Array : Calculate min value
if (!Array.prototype.min) {
    Array.prototype.min = function(){
        let min = +Infinity,len = this.length;
        for (let i=0 ; i < len; i++ )
            if ( this[i] < min ) min = this[i];
        return min;
    };
}

// Float32Array : Calculate max value
if (!Float32Array.prototype.max) {
    Float32Array.prototype.max = function(){
        let max = -Infinity, len = this.length;
        for (let i=0 ; i < len; i++ )
            if ( this[i] > max ) max = this[i];
        return max;
    };
}

// Float32Array : Calculate min value
if (!Float32Array.prototype.min) {
    Float32Array.prototype.min = function(){
        let min = +Infinity,len = this.length;
        for (let i=0 ; i < len; i++ )
            if ( this[i] < min ) min = this[i];
        return min;
    };
}

// Float32Array : Clamp number between min and max
if (!Float32Array.prototype.clamp) {
    Float32Array.prototype.clamp = function(min, max) {
        for(let i=0;i<this.length;i++)this[i]=i.clamp(min,max);
        return this;
    };
}

// Float32Array : Create simple range
if (!Float32Array.prototype.range) {
    Float32Array.prototype.range = function() {
        for(let i=0;i<this.length;i++)this[i]=i;
        return this;
    };
}



// Create simple range
module.exports.range = function (n){
    return Array.from(new Array(n), function(x,i) {return i;});
};

// Copy/Replace properties from another
module.exports.extend = function (dest, src) {
    for (var i in src) dest[i] = src[i];
    return dest;
};





// Convert hex string to rgba object 
module.exports.hex2rgba = function (hex) {
    hex = hex.replace(/\s/g, '');

    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b + 'ff';
    });
    var noTransRegex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
    hex = hex.replace(noTransRegex, function(m, r, g, b) {
        return r + g + b + 'ff';
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
        a: Math.round(parseInt(result[4], 16) / 255.0 * 100.0) * 0.01
    } : null;
};

// Convert rgb object to hsv object 
module.exports.rgb2hsv = function (rgb) {
    let rr, gg, bb,
        r = rgb.r / 255,
        g = rgb.g / 255,
        b = rgb.b / 255,
        h, s,
        v = Math.max(r, g, b),
        diff = v - Math.min(r, g, b),
        diffc = function(c) {
            return (v - c) / 6 / diff + 1 / 2;
        };

    if (diff == 0) {
        h = s = 0;
    }
    else {
        s = diff / v;
        rr = diffc(r);
        gg = diffc(g);
        bb = diffc(b);

        if (r === v) {
            h = bb - gg;
        }
        else if (g === v) {
            h = (1 / 3) + rr - bb;
        }
        else if (b === v) {
            h = (2 / 3) + gg - rr;
        }
        if (h < 0) {
            h += 1;
        }
        else if (h > 1) {
            h -= 1;
        }
    }
    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100) * 0.01,
        v: Math.round(v * 100) * 0.01
    };
};

},{}]},{},[1])(1)
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){
'use strict';

module.exports.SVG = require('./svg.js');
},{"./svg.js":3}],3:[function(require,module,exports){
const util = require('@julien.cousineau/util')

module.exports = class SVG{
  constructor(options){
    if(!options)options={};
    this.minwidth = options.minwidth || 300;
    this.minheight = options.minheight || 300;
    this.style = options.style || {};
    this.resizecallback = options.resizecallback;
    this.graphs={};
    
   
    const self=this;
    // window.addEventListener("resize", debounce(function(){return self.resize()},10));
    
  }
  get width(){return Math.max(this.minwidth,this.element.node().getBoundingClientRect().width)}
  get height(){return Math.max(this.minheight,this.element.node().getBoundingClientRect().height)}
  render(element){
    if(!element)throw new Error("SVG needs a element to draw");
    this.element=element;
    const {width,height,style}=this;    
    const svg = this.svg = element
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style('box-sizing','content-box');
    for(let id in style){
      svg.style(id,style[id]);
    }
  }
  resize(){
    const {svg,width,height,graphs,resizecallback}=this;
    svg.attr("width", width)
       .attr("height", height);
    for(let id in graphs){graphs[id].resize();}
    if(resizecallback)resizecallback();
  }
   
  addGraph(id,graph){
    if(!id || !graph)throw new Error("addGraph needs a id & graph");
    const self=this;
    graph._svg=function(){return self};
    this.graphs[id]=graph;
    graph.render();
    this.resize();
    
  }
  add(a,b){
    return a+b;
  }

};
},{"@julien.cousineau/util":1}]},{},[2])(2)
});
