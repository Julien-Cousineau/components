import Paint from './paint.js';
import Layout from './layout.js';
import {extend} from '@julien.cousineau/util';
import StylePanel from './panel.js'
export default  class Style {
  constructor(options){
      const self=this;
      if(!options)options={}
      this.styles = options.styles||null;
      this.title = "" || "My Title";
      this.active =(typeof options.active === 'undefined') ? true : options.active;
      this.zorder = options.zorder || 0;
      this.attactive =(typeof options.attactive === 'undefined') ? false : options.attactive; 
      this.att = new Float32Array([0,1,1.0,1.0]);
      
      if(!this.styles){
        // this.id = options.id || 'circle'; 
        this.type = options.type || 'circle'; // 'line','fill','contour'
        this._parent=options._parent;
        this.paint = new Paint(extend({type:this.type},options.paint));
        this.layout = new Layout(extend({_style:()=>self,type:this.type},options.layout));
        this.filter =options.filter || null;  
        const self=this;
        this.panel=new StylePanel({title:this.type,col:6,_style:function(){return self}});
      }
  }
  get parent(){return this._parent()}
  get obj(){
    return {
      paint:this.paint.obj,
      layout:this.layout.obj,
      filter:this.filter,
    }
  }
  getStyle(id){
    if(!this.styles[id])throw new Error("Style does not exist");
    return this.styles[id];
  }
  static Selafin(obj){
    if(!obj)obj={};
    return new Style(extend(obj,{
      styles:{
        fill:new Style(extend({type:'fill'},obj.fill || {})),
        line:new Style(extend({type:'line'},obj.line || {})),
        circle:new Style(extend({type:'circle'},obj.circle || {})),
        // symbol:new Style({type:'symbol'}),
        // contour:new Style({type:'contour'}),
        // contouriso:new Style({type:'contouriso'}),
      }
    }));
    
  }
  toJSON(){
    return JSON.stringify({
      
    });
  }


 
  
}