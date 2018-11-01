
import Color from '../color';
export default  class Gradient {
  constructor(options){
      if(!options)options={}
      this.id = options.id || 'myid';
      this.stops = options.stops || [0];
      this.colors = options.colors || [new Color()];
  }
  update(stops,colors){
    this.stops=stops;
    this.colors=colors;
  }
  static parsefromObj(obj){
    const stops = [];
    const colors = [];
    for(const stop in obj){
      stops.push(stop);
      colors.push(Color.parseString(obj[stop]));
    }
    return new Gradient({stops:stops,colors:colors});
  }
  get obj(){
      const {stops,colors}=this;
      const obj={};
      stops.forEach((s,i)=>obj[s]=colors[i].hex); 
      return obj;
  }
}