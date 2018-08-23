import Geometry from '../geometry';
import { grid, randompoints, quad } from '../primitive';
import Texture from '../texture';
import Program from '../program';
import Camera from '../camera';
import { clearRect, clearScene } from '../helper';
const glsl = require('glslify');
import { extend } from '@julien.cousineau/util';

import GLSL from '../shaders';

export default class App {
  constructor(options) {
    
    this.glsl = GLSL;
    this.geometries ={};
    this.programs ={};
    this.textures ={};
  }
  addGeometry(id,geometry){
    if(id in this.geometries)throw new Error("id already exist")
    this.geometries[id]=new Geometry(extend({gl:this.gl},geometry));
    return this.geometries[id];
  }
  addProgram(id,program){
    if(id in this.programs)throw new Error("id already exist")
    const self=this;
    this.programs[id]=new Program(extend({_app:()=>self},program));
    this.camera.onresize();
  }
  addTexture(id, texture){
    if(id in this.textures)throw new Error("id already exist")
    if(!texture)texture={}
    this.textures[id]=new Texture(extend({gl:this.gl},texture));
    return this.textures[id];
  }


  get u_matrix(){return this.camera.u_matrix}
  get v_matrix(){return this.camera.v_matrix}
  
  setCamera(){
    const self=this;
    this.camera = new Camera({ _app: ()=>self});    
  }
  render(element){this.rendergl(element)}
  rendergl(element) {
    const canvasgl = this.canvasgl = element
    .append('div')
      .style('position', 'absolute')
      .style('top', 0)
      .style('bottom', 0)
      .style('right', 0)
      .style('left', 0)
      .style('user-select', 'none')
      .style('pointer-events', 'none')
    // .append('div').attr('width', '100%').attr('height', '100%')
    .append('canvas').attr('width', '100').attr('height', '100');
    this.gl = canvasgl.node().getContext('webgl');
    this.gl.getExtension('OES_element_index_uint');
    if (!this.gl) alert("Unable to initialize WebGL. Your browser or machine may not support it.");
    this.setCamera()
  }
  render2d(element) {
    const canvas2dp = this.canvas2dp = element
      .append('div')
      .style('position', 'absolute')
      .style('bottom', 0)
      .style('right', 0)
      .style('width', '400px')
      .style('height', '400px')
      .style('user-select', 'none')
      .style('pointer-events', 'none')
      .style('z-index',1)
      .append('div').style('width', '100%').style('height', '100%')
    const canvas2d = this.canvas2d =canvas2dp.append('canvas').attr('width', 100).attr('height', 100);
    this.ctx = canvas2d.node().getContext("2d");

  }



  drawScene() {
    if (this.ctx) clearRect(this.ctx);
    if (this.gl) clearScene(this.gl);

    for (const name in this.programs) {
      const program = this.programs[name];
      if (program.active) {
        program.draw();
        if (this.ctx && program.fbID) program.fbtexture.putImageData(this.ctx);
        // if (program.fbID) console.log(program.fbtexture.decodeImage());
      }
    }
  }


}
