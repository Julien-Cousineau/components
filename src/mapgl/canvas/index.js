import Handlers from './handlers';
import {initialisedView,changePView,changeMView} from './helper';
const {extend} = require('@julien.cousineau/util');


export default class Canvas{
  constructor(options){
    if(!options)options={}
    this.iscanvasgl =(typeof options.iscanvasgl === 'undefined') ? false : options.iscanvasgl;
    this.iscanvas2d =(typeof options.iscanvas2d === 'undefined') ? false : options.iscanvas2d;
    this.canvasglid = options.canvasglid || null;
    this.canvas2did = options.canvas2did || 'canvas2d';
    this.containerglid = options.containerglid || 'BODY';
    this.container2did = options.container2did || 'BODY';  
    
    if(!this.iscanvasgl){
      this.containergl = document.getElementById(this.container2did) || document.getElementsByTagName('BODY')[0];
      this.containergl.innerHTML+=`<canvas id="{0}" width="100" height="100"></canvas>`.format(this.canvasgl);
      this.canvasgl = document.querySelector('#{0}'.format(this.canvasglid)); 
      this.gl = this.canvasgl.getContext('webgl');      
    }
    
    if(!this.iscanvas2d){
      this.container2d = document.getElementById(this.container2did) || document.getElementsByTagName('BODY')[0];
      this.container2d.innerHTML+=`<div class="canvas2d"><div class="full"><canvas id="{0}" width="300" height="300"></canvas></div></div>`.format(this.canvas2d);
      this.canvas2d = document.querySelector('#{0}'.format(this.canvas2did));
      this.ctx = this.canvas2d.getContext("2d");
    }
  }
}


