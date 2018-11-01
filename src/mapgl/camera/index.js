import Handlers from '../handlers';
import {initialisedView,changePView,changeMView} from '../helper';
const {extend} = require('@julien.cousineau/util');


export default class Camera{
  constructor(options){
    if(!options || !options._app)throw new Error("Must contain _app")
    this._app=options._app;
    this.modelview={x:0.,y:0.,z:-10.0,};
    this.perspectiveview = {fieldOfView : 45 * Math.PI / 180,aspect : this.gl.canvas.clientWidth / this.gl.canvas.clientHeight,zNear : 0.01,zFar : 1000.0};
    const view = initialisedView(this.gl,this.modelview,this.perspectiveview);
    this.u_matrix = view[0];
    this.v_matrix = view[1];
    const self=this;
    this.handlers = new Handlers({element:this.app.canvasgl,debug:false,callback:function(position){return self.changeView(position)}});
    window.onresize = function(e) { return self.onresize(e)};  
    this.changePView();
    this.changeMView(0,0,0);
    this.lastUpdateCall = null;
    }
  get app(){return this._app()}
  get gl(){return this.app.gl}
  
  onresize(e){
     
    // const {height,width} = this.canvasgl.node().getBBox()
    const {height,width} = this.app.canvasglparent.node().getBoundingClientRect()
    this.app.canvasgl.attr('width', width);
    this.app.canvasgl.attr('height', height);
    if(this.app.canvas2d){
      console.log(this.app.canvas2dp.node())
      const {height,width} = this.app.canvas2dp.node().getBoundingClientRect()
      this.app.canvas2d.attr('width', width);
      this.app.canvas2d.attr('height', height);
    }
    this.changePView();
    this.app.clear();
    this.app.drawScene();    
  }
  changeView(position){
  
    if(this.lastUpdateCall) cancelAnimationFrame(this.lastUpdateCall); 
    
     this.lastUpdateCall = requestAnimationFrame(()=>{
       console.time('cousineau')
      this.changeMView(position.delta);
      this.app.clear();
      this.app.drawScene();
      this.lastUpdateCall=null;
      console.timeEnd('cousineau')
     });
  }
  changePView(options){
    const pv  = this.perspectiveview = extend(Object.create(this.perspectiveview), options);
    changePView(this.gl,this.u_matrix,pv)
  }
  changeMView(options){
    const mv  = this.modelview = extend(Object.create(this.modelview), options);    
    changeMView(this.gl,this.u_matrix,this.v_matrix,mv);
  }
 

}


