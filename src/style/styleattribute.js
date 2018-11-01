import {extend} from '@julien.cousineau/util';
import Style from './style.js';
import StyleProgram from './styleprogram.js';

// import Panel from './panel.js';
export default  class StyleAttribute extends Style  {
  constructor(options){
    super(options);
    options=options||{};
    this.attactive =(typeof options.attactive === 'undefined') ? false : options.attactive; 
    this.att = options.att || [0,1,1.0,1.0];
    this.range=options.range || [0,100];
    this.units=options.units || 'unknown',
		this.xlabel = options.xlabel || "Unknown",
    this.sprograms = StyleAttribute.template(options.sprograms)
    
    const self=this;
    for(let id in this.sprograms)this.sprograms[id]._sattribute = ()=>self;
    
  }
  get slayer(){return this._slayer()}
  get weight(){return this.att[3]*100.0}
  set weight(value){
    this.att[3]=value*0.01;
  }
  get obj(){
    const {sprograms,attactive,att,range}=this;
    const _sprograms = {};
    for(const id in sprograms)_sprograms[id]=sprograms[id].obj;
    return extend(super.obj,{attactive:attactive,att:att,range:range,sprograms:_sprograms});
  }
  toJSON(){return JSON.stringify(this.obj)}
  
  static template(obj){
    obj = obj || {};
    
    return {
        fill:new StyleProgram(extend({type:'fill'},obj.fill || {})),
        line:new StyleProgram(extend({type:'line'},obj.line || {})),
        circle:new StyleProgram(extend({type:'circle'},obj.circle || {})),
        symbol:new StyleProgram(extend({type:'symbol'},obj.symbol || {})),
        // contour:new StyleProgram({type:'contour'}),
        // contouriso:new StyleProgram({type:'contouriso'}),
    };
  }
  getSProgram(id){
    if(!this.sprograms[id])throw new Error("Error here, programs should already pre-defined ")
    return this.sprograms[id];
  }
  
  
  

}