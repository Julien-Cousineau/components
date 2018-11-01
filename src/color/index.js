const {parseCSSColor} =require('csscolorparser');
import util from '@julien.cousineau/util';
import materialcolors from 'material-colors';

export default class Color {
    constructor(color) {
        this.update(color)
    }
    static parseString(input) {
        if (!input)return undefined;
        if (typeof input !== 'string')return undefined;
        if (input instanceof Color)return input;
        
        let rgba = (input[0]==="#" && input.length==9)?Color.hex2rgba(input):parseCSSColor(input);
        if (!rgba)return undefined;
        rgba = (Array.isArray(rgba))?{r:rgba[0],g:rgba[1],b:rgba[2],a:rgba[3]}:rgba;
        return new Color(rgba);
    }
    static materialcolors(){
        return materialcolors;
    }
    update(color){
        if(!color)color='#ffffffff';
        if(typeof color.r !== 'undefined') return this.parseRGBA(color);
        if(typeof color.h !== 'undefined' || typeof color.s !== 'undefined' || typeof color.v !== 'undefined') return this.parseHSVA(color);
        if(typeof color.a !== 'undefined') return this.parseRGBA(color);
       
        return this.parseHex(color)
    }
    
    parseRGBA(rgba) {
        if(!this.rgba)this.rgba={};
        const r=(typeof rgba.r !== 'undefined')? rgba.r : this.rgba.r || 0;
        const g=(typeof rgba.g !== 'undefined')? rgba.g : this.rgba.g || 0;
        const b=(typeof rgba.b !== 'undefined')? rgba.b : this.rgba.b || 0;
        const a=(typeof rgba.a !== 'undefined')? rgba.a :this.rgba.a || 0;
        this.rgba = {r:r,g:g,b:b,a:a};
        this.hsva = this.rgba2hsva(this.rgba);
        this.hex = this.rgba2hex(this.rgba);
        this.colorgroup = this.colorDetector(this.hsva)
        return this;
    }
    parseHSVA(hsva) {
        if(!this.hsva)this.hsva={};
        const h=(typeof hsva.h !== 'undefined')? hsva.h : this.hsva.h || 0
        const s=(typeof hsva.s !== 'undefined')? hsva.s : this.hsva.s || 0;
        const v=(typeof hsva.v !== 'undefined')? hsva.v : this.hsva.v || 0;
        const a=(typeof hsva.a !== 'undefined')? hsva.a :this.hsva.a || 0;
        this.hsva = {h:h,s:s,v:v,a:a};
        this.rgba = this.hsva2rgba(this.hsva)
        this.hex = this.rgba2hex(this.rgba)
        return this;
    }
    parseHex(hex){
        this.hex=hex;
        this.rgba = Color.hex2rgba(this.hex)
        this.hsva = this.rgba2hsva(this.rgba)
        return this;
        
    }
    get luminance(){
      const {r,g,b,a} = this.rgba;
      return ( 0.299 * r + 0.587 * g + 0.114 * b)/255;
    }
    fontColor(){
        if(this.luminance>0.58){return Color.parseString('black')};
        return Color.parseString('white');
    }
    rgb2str() {
        const {r, g, b, a} = this.rgba;
        return 'rgb({0},{1},{2})'.format(r,g,b); 
    }
    rgba2str() {
        const {r, g, b, a} = this.rgba;
        return 'rgba({0},{1},{2},{3})'.format(r,g,b,a); 
    }
    hsva2str() {
        const {h,s,v,a}=this.hsva;
        return 'hsla({0},{1}%,{2}%,{3})'.format(h,s*100,v*100,a); 
    }
    copy(){
        const {r,g,b,a}=this.rgba;
        return new Color({r:r,g:g,b:b,a:a});
    }
    rgba2hsva(rgba) {
        const r = rgba.r / 255 || 0;
        const g = rgba.g / 255 || 0;
        const b = rgba.b / 255 || 0;
        const a = rgba.a || 0;
        
        let rr, gg, bb,h, s,
            v = Math.max(r, g, b),
            diff = v - Math.min(r, g, b),
            diffc = function(c) {return (v - c) / 6 / diff + 1 / 2;};
    
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
            v: Math.round(v * 100) * 0.01,
            a:a
        };
    }
    hsva2rgba(hsva) {
        const h = hsva.h / 360.0 || 0;
        const s = hsva.s || 0;
        const v = hsva.v || 0;
        const a = hsva.a || 0;
      
        
        let r, g, b;
        
        let i = Math.floor(h * 6);
        let f = h * 6 - i;
        let p = v * (1 - s);
        let q = v * (1 - f * s);
        let t = v * (1 - (1 - f) * s);
        
        switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
        }
        
        return {r:Math.floor(r*255), g:Math.floor(g*255), b:Math.floor(b*255),a:a};
    
    }
    rgba2hex(rgba){
        const trans = (typeof rgba.a !== 'undefined')?("0" + parseInt(Math.round(rgba.a*255),10).toString(16)).slice(-2):'';
     
        return "#" +
      ("0" + parseInt(rgba.r,10).toString(16)).slice(-2) +
      ("0" + parseInt(rgba.g,10).toString(16)).slice(-2) +
      ("0" + parseInt(rgba.b,10).toString(16)).slice(-2) +
      trans;
    }
    static hex2rgba(hex) {
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
    colorDetector(hsva) {
      const h = hsva.h || 0;
      const s = hsva.s || 0;
      const v = hsva.v || 0;
      const a = hsva.a || 0;  
      
      if (v  < 0.2) return "black";
      if (v  > 0.9 && s  < 0.2) return "white";
      if (s  < 0.2) return "gray";
    
      if (h < 30) return "red";
      if (h < 60) return "orange";
      if (h < 90) return "yellow";
      if (h < 150) return "green";
      if (h < 210) return "cyan";
      if (h < 270) return "blue";
      if (h < 330) return "magenta";
    
      return "red";
}
   
}
