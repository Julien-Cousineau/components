import Gradient from '../gradient'
import Color from '../color';
import {extend} from '@julien.cousineau/util';
export default  class Paint {
  constructor(options){
      if(!options)options={}
      this.id = options.id || 'myid';
      this.active =(typeof options.active === 'undefined') ? true : options.active;
      this.color =  options.color || Color.parseString('#000000').rgba2str();
      this.opacity = (typeof options.opacity === 'undefined') ? 1 : options.opacity;
      this.outlinecolor = options.outlinecolor || Color.parseString('#000000').rgba2str();
      this.cap = options.cap || 'butt';
      this.join = options.cap || 'miter';
      this.width = (typeof options.width === 'undefined') ? 5 : options.width;
      this.radius = (typeof options.radius === 'undefined') ? 5 : options.radius;
      this.blur = (typeof options.blur === 'undefined') ? 0 : options.blur;
      this.filter = options.filter || null;
      this.layout = options.layout || {};
     
  }

  getpaint(type){
      if(!this['paint'+type])throw new Error("type does not exist")
      return this['paint'+type]
  }
  getlayout(type){
      if(!this['layout'+type])throw new Error("type does not exist")
      return this['layout'+type]
  }
  stringify(){return JSON.stringify(this)}
  
  static parseRadius(array,options){
    if(!array)return Color.parseString('#000000').rgba2str();
  }
  static parseColor(array,options){
    if(!array)return Color.parseString('#000000').rgba2str();
    options=options||{}
    
    if(!options.gradient)options.gradient=Gradient.parseName('Skyline');
    if(!options.attributename)throw new Error("requires attributename");
    if(!options.base)options.base=1.0;
    if(Array.isArray(array) || array.byteLength !== undefined){
      if(typeof array[0]==='string')return this.parseCategoricalColor(array,options);
      if(typeof array[0]==='number')return this.parseLinearColor(array,options);
      if(Array.isArray(array[0]))return this.parseStopsColor(array,options);
      
    }
    if(typeof array === 'object') return this.parseObjectColor(array,options);
    return null;
    
    
  }
  static parseCategoricalColor(array,options){
    let {base,gradient,attributename} = options;
    const stops = array.map((item,i,array)=>[item,gradient.interpolate(parseFloat(i)/array.length)]);
    return {
      property:attributename,
      type:'categorical',
      stops:stops
    };
  }
  static parseLinearColor(array,options){
    let {base,gradient,attributename} = options;
    const min=array.min();
    const max=array.max();
    return {
      property:attributename,
      type:'exponential',
      base:base,
      stops:[[min,gradient.interpolate(0)],[max,gradient.interpolate(1)]]
    };
  }
  static parseStopsColor(stops,options){
   
    let {base,gradient,attributename} = options;
    const newstops=stops.map(stop=>[stop[1],gradient.interpolate(stop[0])])
    return {
      property:attributename,
      type:'exponential',
      base:base,
      stops:newstops
    };
  }
  static parseObjectColor(obj,options){
  
    let {base,gradient,attributename} = options;
    const min = obj.min || 0;
    const max = obj.max || 1;
    return {
      property:attributename,
      type:'exponential',
      base:base,
      stops:[[min,gradient.interpolate(0)],[max,gradient.interpolate(1)]]
    };
  }    
  get paintcircle(){
      const obj={};
      obj['circle-color']=this.color;
      obj['circle-opacity']=this.opacity;
      obj['circle-radius']=this.radius;
      obj['circle-blur']=this.blur;
      return obj;
      
  }
  get paintfill(){
      const obj={};
      obj['fill-color']=this.color;
      obj['fill-opacity']=this.opacity;
      obj['fill-outline-color']=this.outlinecolor;
      return obj;      
  }  
  get paintline(){
      const obj={};
      obj['line-color']=this.color;
      obj['line-opacity']=this.opacity;
      obj['line-width']=this.width;
      return obj;      
  }

  get layoutcircle(){return this.layout;}
  get layoutfill(){return this.layout;}  
  get layoutline(){return this.layout;}
  get layoutsymbol(){return this.layout;}
  setProperty(_prop,value){
    let prop=_prop.split('-');
    prop = (prop.length == 1)?_prop:prop[1];
    if(typeof this[prop]==='undefined')throw new Error("Prop does not exist");
    this[prop]=value;
  }
 
  
}