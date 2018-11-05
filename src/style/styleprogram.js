import {extend} from '@julien.cousineau/util';
import Style from './style.js';
import Paint from './paint.js';
import Layout from './layout.js';
// import Panel from './panel.js';
export default  class StyleProgram extends Style  {
  constructor(options){
      super(options);
      options=options||{};
      const self  = this;
      this.type = options.type || 'circle'; // 'circle',line','fill','contour'
      this.paint  = new Paint(extend({_style:()=>self},options.paint));
      this.layout = new Layout(extend({_style:()=>self},options.layout));
      this.filter = options.filter || null;  
      this.legendactive = (typeof options.legendactive === 'undefined') ? false : options.legendactive;
      // this.panel  = new Panel({_style:()=>self,title:this.type,col:6});  
  }
  get sattribute(){return this._sattribute()}
  get obj(){
    const {type,paint,layout,filter}=this;
    return extend(super.obj,{type:type,paint:paint.obj,layout:layout.obj,filter:filter});
  }
  toJSON(){return JSON.stringify(this.obj)}
  setPaint(paint){this.paint = new Paint(extend({_style:()=>self},paint))}
  setLayout(layout){this.layout = new Layout(extend({_style:()=>self},layout))}
  setFilter(filter){this.filter = filter}
}