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

export default class App {
  constructor(options) {
    
    this.glsl = GLSL;
    this.geometries ={};
    this.programs ={};
    this.textures ={};
    this.layers={};
    
  }
  addSLF(id,slf){
    
    this.geometries[id]=new GeometrySLF(extend({gl:this.gl},{slf:slf}));
    slf.VARNAMES.forEach(name=>{
      name = name.replace(/\s/g, ''); //TODO replace function with @julien.cousineau/util;
      const circle=this.addTexture('{0}-circle-color-{1}'.format(id,name),{glslvarname:'dtexture'})
      const line = this.addTexture('{0}-line-color-{1}'.format(id,name),{glslvarname:'dtexture'})
      const fill=this.addTexture('{0}-fill-color-{1}'.format(id,name),{glslvarname:'dtexture'})
      circle.todefaultcolor()
      line.todefaultcolor()
      this.textures['{0}-fill-color-{1}'.format(id,name)].todefaultcolor()
    },this)
     

    this.addProgram(id+"-line",{
        active:true,
        mode:'LINES',
        wireframe:true,
        geometryID:id,
        // textureIDs:['dtexture2'],
        textureIDs:['{0}-line-color-MAILLAGE'.format(id)],
        vs:this.glsl.mapbox.points.vs,
        fs:this.glsl.mapbox.points.fs,
    })
    this.addProgram(id+"-fill",{
        active:false,
        mode:'TRIANGLES',
        geometryID:id,
        // textureIDs:['dtexture2'],
        textureIDs:['{0}-fill-color-MAILLAGE'.format(id)],
        vs:this.glsl.mapbox.points.vs,
        fs:this.glsl.mapbox.points.fs,
    }) 
    this.addProgram(id+"-circle",{
        active:true,
        mode:'POINTS',
        geometryID:id,
        // textureIDs:['dtexture2'],
        textureIDs:['{0}-circle-color-MAILLAGE'.format(id)],
        vs:this.glsl.mapbox.points.vs,
        fs:this.glsl.mapbox.points.fs,
    })     
     

     return this.geometries[id];
  }
  addLayer(id,geoids,proids){
    if(id in this.layers)throw new Error("id already exist");
    this.layers[id]={geometriesids:geoids,programids:proids};
    return this.layers[id];
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
    this.setExtension();
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
  setExtension(){
    console.log(this.gl)
    this.gl.getExtension('OES_element_index_uint');
    this.gl.getExtension('OES_standard_derivatives');
    this.gl.getExtension('EXT_shader_texture_lod');
    if (!this.gl) alert("Unable to initialize WebGL. Your browser or machine may not support it.");
  }
  setGL(gl){
    this.gl=gl;
  }

  clear(){
    if (this.ctx) clearRect(this.ctx);
    if (this.gl) clearScene(this.gl);    
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
  setPaintProperty(geometryid, prop, value){
    // prop : circle-color,line-color,fill-color
    // value : {attid:{gradient}}
    // if(!this.programs[id])throw new Error("Program does not exist")
    // const program = this.programs[id];
    if(prop=="rstyle")this.setPrograms(geometryid,prop,value);
    if(prop.includes("color"))this.setTexture(geometryid,prop,value);
    
  }
  setTexture(geometryid, prop, gradients){
    if(typeof gradients !== 'object')throw new Error("Error here");
    for(const attid in gradients){
      const tid = geometryid+'-'+prop+'-'+attid;
      if(!this.textures[tid])throw new Error('Ummmm error');
      if(this.textures[tid])this.textures[tid].updateColorRamp(gradients[attid].obj)  ;  
    }
  }
  setPrograms(geometryid,prop,value){
    this.hide();
    if(value=='point')return this.programs[geometryid+"-circle"].active=true;
    if(value=='wireframe')return this.programs[geometryid+"-line"].active=true;
    if(value=='surface')return this.programs[geometryid+"-fill"].active=true;
    if(value=='contour')return null;
    if(value=='contourison')return null;
    
  }
  hide(){
     for(let pid in this.programs)this.programs[pid].active=false;
  }
}
