const d3 = require('../../dist/d3.min.js');
import Color from '../color';
import uigradients from 'uigradients.gradients';
export default  class Gradient {
  constructor(options){
      if(!options)options={}
      this.id = options.id || 'myid';
      const stops=options.stops || [0];
      const colors= options.colors || [new Color()];
      this.interpolateType=options.interpolateType || 'interpolateRgb';
      this.update(stops,colors);
  }
  update(stops,colors){
    this.stops=stops;
    this.colors=colors;
    
    const rgba = colors.map(color=>color.rgba2str());
   
    if(!d3[this.interpolateType])throw new Error("Does not exist")
    this.interpolator = d3.scaleLinear()
                          .domain(stops)
                          .range(rgba)
                          .interpolate(d3[this.interpolateType]); //interpolateHsl interpolateHcl interpolateRgb
  }
  static uigradients(){
    return JSON.parse(JSON.stringify(uigradients.gradients));
  }
  static parseuigradients(){
    const gradients = Gradient.uigradients();
    for(const id in gradients)gradients[id]=Gradient.parseName(id);
    return gradients;
  }
  static parseObj(obj){
    
    const stops = [];
    const colors = [];
    for(const stop in obj){
      stops.push(parseFloat(stop));
      colors.push(Color.parseString(obj[stop]));
    }
    // console.log('parseObj', new Gradient({stops:stops,colors:colors}))
    return new Gradient({stops:stops,colors:colors});
  }
  static parseName(name){
    const gradients = uigradients.gradients;
    if(!gradients[name]){console.warn("name does not exist");console.log(gradients);return null;}
    const hexs = gradients[name];
    // console.log(hexs)
    
    const n = hexs.length;
    const stops = [];
    const colors = [];    
    for(let i=0;i<n;i++){
      const hex = hexs[i];
      stops.push(i / (n-1));
      colors.push(Color.parseString(hex));
    }
    return new Gradient({stops:stops,colors:colors});
    
  }
  get background(){
    const strstr = this.stops.map((stop,i)=>[stop,this.colors[i]]).sort((a,b)=>a[0]-b[0]).map((item)=>{      
      
      return '{0} {1}%'.format(item[1].rgba2str(),item[0]*100)    
    })
   
    if(strstr.length ==1)return '{0}'.format(strstr.join(','));       
    if(strstr.length>1)return 'linear-gradient({0})'.format(strstr.join(','));    
  }
  get obj(){
      const {stops,colors}=this;
      const obj={};
      stops.forEach((s,i)=>obj[s]=colors[i].hex); 
      return obj;
  }
  interpolate(value){
    const {interpolator}=this;
    if(!Array.isArray(value))return interpolator(value);
    if(Array.isArray(value))return value.map(v=>interpolator(v));
  }
  get fontColor(){
    const color = Color.parseString(this.interpolate(0.5));
    return color.fontColor();
  }
  fontColorstr(){
    return this.fontColor.rgba2str();
    
  }
  colorgroups(){
    return this.colors.map(color=>color.colorgroup)
  }
  toJSON(){return JSON.stringify(this.obj)}
  
  static parse(obj){
    if(typeof obj==='string')return Gradient.parseName(obj);
    return Gradient.parseObj(obj);
  }
}