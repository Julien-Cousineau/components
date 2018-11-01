import Geometry from '../geometry';
import GeometrySLF from '../geometryslf';
import { grid, randompoints, quad } from '../primitive';
import Texture from '../texture';
import Program from '../program';
import Camera from '../camera';
import { clearRect, clearScene } from '../helper';
const glsl = require('glslify');
import { extend } from '@julien.cousineau/util';

import GLSL from '../shaders';

export default class Layer {
  constructor(options) {
    if(!options || !options.app)throw new Error("Layer must contain app"); 
    this.id = options.id || "myid";
    this._app = options.app;
    this.glsl = GLSL;
    this.geometries ={};
    this.programs ={};
    this.textures ={};
    this.active=(typeof options.active == 'undefined') ? true : options.active;
  }
  get app(){return this._app()}
  get gl(){return this.app.gl}
  get u_matrix(){return this.app.u_matrix}
  get v_matrix(){return this.app.v_matrix}
  get worldSize(){return this.app.worldSize}

  addSLF(id,slf){
    
    this.geometries[id]=new GeometrySLF(extend({gl:this.gl},{slf:slf}));
    this.geometries[id+'-wireframe']=new GeometrySLF(extend({gl:this.gl},{slf:slf,wireframe:true}));
    slf.VARNAMES.forEach(name=>{
      name = name.replace(/\s/g, ''); //TODO replace function with @julien.cousineau/util;
      const _default=this.addTexture('color-default'.format(name),{glslvarname:'dtexture'})
      const circle=this.addTexture('circle-color-0}'.format(name),{glslvarname:'dtexture'})
      const line = this.addTexture('line-color-{0}'.format(name),{glslvarname:'dtexture'})
      const fill=this.addTexture('fill-color-{0}'.format(name),{glslvarname:'dtexture'})
      _default.todefaultcolor()
      circle.todefaultcolor()
      line.todefaultcolor()
      fill.todefaultcolor()
    },this)
     

    this.addProgram("line",{
        active:true,
        mode:'LINES',
        geometryID:id+'-wireframe',
        // textureIDs:['dtexture2'],
        textureIDs:['color-default'],
        vs:this.glsl.mapbox.points.vs,
        fs:this.glsl.mapbox.points.fs,
    })
    this.addProgram("fill",{
        active:false,
        mode:'TRIANGLES',
        geometryID:id,
        // textureIDs:['dtexture2'],
        textureIDs:['color-default'],
        vs:this.glsl.mapbox.points.vs,
        fs:this.glsl.mapbox.points.fs,
    }) 
    this.addProgram("circle",{
        active:true,
        mode:'POINTS',
        geometryID:id,
        // textureIDs:['dtexture2'],
        textureIDs:['color-default'],
        vs:this.glsl.mapbox.points.vs,
        fs:this.glsl.mapbox.points.fs,
    })     
     

     return this.geometries[id];
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
    if(this.camera)this.camera.onresize();
  }
  addTexture(id, texture){
    if(id in this.textures)throw new Error("id already exist")
    if(!texture)texture={}
    this.textures[id]=new Texture(extend({gl:this.gl},texture));
    return this.textures[id];
  }
  drawScene() {
    for (const name in this.programs) {
      const program = this.programs[name];
      
      if (program.active) {
        program.draw();
        // if (this.ctx && program.fbID) program.fbtexture.putImageData(this.ctx);
        // if (program.fbID) console.log(program.fbtexture.decodeImage());
      }
    }
  }
  show(){this.active=true}
  hide(){this.active=false}
  showProgram(id){
    if(!this.programs[id])throw new Error("Program does not exist");
    this.programs[id].active=true;
  }
  hideProgram(id){
    if(!this.programs[id])throw new Error("Program does not exist");
    this.programs[id].active=false;
  }
  setTexture(prop, gradients){
    if(typeof gradients !== 'object')throw new Error("Error here");
    for(const attid in gradients){
      const tid = prop+'-'+ attid;
      if(!this.textures[tid])throw new Error('{0} does not exist in textures'.format(tid));
      if(this.textures[tid])this.textures[tid].updateColorRamp(gradients[attid].obj)  ;  
    }
  }  
  showhidePrograms(values){
    if(typeof values !== 'object')throw new Error("Error here");
    for(const id in values){
      if(id=='point' || id=='circle')this.programs["circle"].active=values[id];
      if(id=='wireframe'|| id=='line') this.programs["line"].active=values[id];
      if(id=='surface'|| id=='fill')this.programs["fill"].active=values[id];
      if(id=='contour') null;
      if(id=='contouriso') null;
    }
    
  }
}
