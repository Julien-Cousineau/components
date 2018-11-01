import Layer from '../layer';
import LayerSLF from '../layerslf';
import LayerQuad from '../layerquad';
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
    this.layers={};
    this.mapbox = (typeof options.mapbox == 'undefined') ? false : options.mapbox;
    this.error = {id:new Error("ID does not exist")};
    this.layerType = {layer:Layer,quad:LayerQuad,slf:LayerSLF};
  }


  addLayer(id,options){return this._addLayer('layer',id,options)}
  addLayerSLF(id,options){return this._addLayer('slf',id,options)}
  addLayerQuad(id,options){return this._addLayer('quad',id,options)}
  _addLayer(type,id,options){
    if(id in this.layers)throw new Error("id already exist");
    const self=this;
    this.layers[id]=new this.layerType[type](extend({id:id,app:()=>self},options)).createAttributes();
    return this.layers[id];
  }

  getLayer(id){
     if(!this.layers[id])throw new Error("id does not exist");
     return this.layers[id];
  }

  get u_matrix(){return this.camera.u_matrix}
  get v_matrix(){return this.camera.v_matrix}
  
  setCamera(){
    const self=this;
    this.camera = new Camera({ _app: ()=>self});    
  }
  render(element){this.rendergl(element)}
  rendergl(element) {
    const canvasglparent = this.canvasglparent = element
    .append('div')
      .style('position', 'absolute')
      .style('top', 0)
      .style('bottom', 0)
      .style('right', 0)
      .style('left', 0)
      .style('user-select', 'none')
      .style('pointer-events', 'none')
    const width = canvasglparent.node().getBoundingClientRect().width;
    const height = canvasglparent.node().getBoundingClientRect().height;
    const canvasgl = this.canvasgl =canvasglparent.append('canvas').attr('width', width).attr('height', height);
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
    this.gl.getExtension('OES_element_index_uint');
    this.gl.getExtension('OES_standard_derivatives');
    this.gl.getExtension('EXT_shader_texture_lod');
    if (!this.gl) alert("Unable to initialize WebGL. Your browser or machine may not support it.");
  }
  setGL(gl){this.gl=gl;}

  clear(){
    if (this.ctx) clearRect(this.ctx);
    if (this.gl) clearScene(this.gl);    
  }
  async checkData(){
    for (const id in this.layers) {
      const layer = this.layers[id];
      if (layer.active)await layer.checkData();
    }
  }
  drawScene() {
    for (const id in this.layers) {
      const layer = this.layers[id];
      if (layer.active)layer.drawScene();
    }

  }
  getLayer(layerid){
    if(!this.layers[layerid])throw this.error.id;
    return this.layers[layerid];
  }
  toggle(layerid){
    const layer = this.getLayer(layerid);
    layer.active = !layer.active;
    (layer.active)?this.show(layerid):this.hide(layerid);
  }
  hide(layerid){this.getLayer(layerid).hide();}
  show(layerid){this.getLayer(layerid).show();}
}


  // setPaintProperty(layerid, prop, value){
  //   if(prop.includes("color"))this.setTexture(layerid,prop,value);
  //   if(prop=="rstyle")this.showhidePrograms(layerid,value);
  // }
  // setTexture(layerid, prop, gradients){this.getLayer(layerid).setTexture(prop,gradients)}
  // showhidePrograms(layerid,value){this.getLayer(layerid).showhidePrograms(value)}
  // addLayer(id,options){
  //   if(id in this.layers)throw new Error("id already exist");
  //   const self=this;
  //   this.layers[id]=new Layer(extend({id:id,app:()=>self},options)).createAttributes();
  //   return this.layers[id];
  // }
  // addLayerSLF(id,options){
  //   if(id in this.layers)throw new Error("id already exist");
  //   const self=this;
  //   this.layers[id]=new LayerSLF(extend({id:id,app:()=>self},options)).createAttributes();
  //   return this.layers[id];
  // }
  // addLayerQuad(id,options){
  //   if(id in this.layers)throw new Error("id already exist");
  //   const self=this;
  //   this.layers[id]=new LayerQuad(extend({id:id,app:()=>self},options)).createAttributes();
  //   return this.layers[id];
  // }