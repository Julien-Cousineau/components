import Program from './program'
import Style from '../../../style'
import { extend } from '@julien.cousineau/util';
export default  class Attribute {
  constructor(options){
      if(!options)options={};
      if(!options._layer)throw new Error("Needs a layer pointer")
      this._layer=options._layer;
      this.id = options.id || 'attid';
      this.title = options.title || 'atttitle';
      this.active = (typeof options.active === 'undefined') ? true : options.active;
      this._program = options.program || 'point';
      // const style = this.style = options.style || new Style()
      
      const self=this;
      
      // if(!style.programs)style.programs={};
      
      this._programs = options.programs ||{
                                            circle:{active:true,title:'Point'},
                                            line:{active:false,title:'Line'},
                                            wireframe:{active:false,title:'Wireframe'},
                                            point:{active:true,title:'Point'},
                                            surface:{active:false,title:'Surface'},
                                            contour:{active:false,title:'Contour'},      
                                            contouriso:{active:false,title:'Contour ISO'}
                                          }
      
      this.programs={};
      for(const id in this._programs)this.programs[id]=new Program(extend({_attribute:()=>self,id:id},this._programs[id]));
      
      this.typestyles = {
      point:['point'],
      line:['point','line'],
      polygon:['point','line','surface'],
      mesh:['point','wireframe','surface','contour','contouriso'],
    }
  }
  
  get layer(){return this._layer()}
  get values(){return this.layer.data[this.id]}
  get type(){return this.layer.type}
  get program(){return this.programs[this._program]}
  get activelist(){
    const {programs}=this;
    const obj={}
    this.typestyles[this.type].forEach(id=>obj[id]=programs[id]);
    return obj;
  }
  
  toggle(){this.active = !this.active}
  show(){this.active=true}
  hide(){this.active=false}
  setProgram(_program){this._program = _program}
  styleObj(){
    const obj={};
    for(const id in this.programs)obj[id]=this.programs.obj;
    return obj;
  }
}