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
import Attribute from '../attribute';
import StyleCatalog from  '../../stylecatalog';


export default class Layer {
  constructor(options) {
    if(!options || !options.app)throw new Error("Layer must contain app"); 
    this.id         = options.id || "myid";
    this._app       = options.app;
    this.glsl       = GLSL;
    this.geometries = {};
    this.attributes = {};
    this.slayer     = StyleCatalog.getStyle('layer',options.slayer);
    
    this.geometry = options.geometry || null;

  }
  get active(){return this.slayer.active}
  set active(value){this.slayer.active=value}
  get attactive(){return this.slayer.attactive}
  set attactive(value){this.slayer.attactive=value}  
  get zorder(){return this.slayer.zorder}
  set zorder(value){this.slayer.zorder=value}  
  get app(){return this._app()}
  get gl(){return this.app.gl}
  get u_matrix(){return this.app.u_matrix}
  get v_matrix(){return this.app.v_matrix}
  get worldSize(){return this.app.worldSize}
  get scale(){return this.app.scale}
  get mapbox(){return this.app.mapbox}
  
  createAttributes(){
    const {geometry}=this;
    if(geometry){
      const geo = this.geometries[this.id]=new Geometry(extend({gl:this.gl},geometry));
      for(const id in geo.values)this.addAttribute(id);
    }
    return this;
  }
  
  addAttribute(id,options){
    const self=this;
    this.attributes[id]=new Attribute(extend({_layer:()=>self,id:id},options)).createPrograms();
  }
  getAttribute(id){
    if(!this.attributes[id])return console.warn("Attribute does not exist");
    return this.attributes[id];
  }
  getGeometry(id){
    if(!this.geometries[id])return console.warn("Geometry does not exist");
    return this.geometries[id];
  }  
  
  async checkData(){
    for (const id in this.attributes) {
      if (this.attributes[id].active || this.attributes[id].attactive)await this.attributes[id].checkData();
    }
  }
  drawScene() {
    
    const attributes=this.attributes;
    const array = Object.keys(attributes).map(key=>attributes[key]).filter(attribute=>attribute.active);
    if(array.length==0)return;
    const maxzorder =array.reduce((prev, current)=>(prev.zorder > current.zorder) ? prev : current).zorder;
    const newarray =array.filter(sattribute=>sattribute.zorder>=maxzorder);
    newarray.sort((a,b)=>b.zorder-a.zorder)
    const att = newarray[newarray.length-1];
    att.drawScene()
    
    // atts.forEach(att=>att.drawScene());
   
     
    // for(let i=0;i<keys.length;i++){
      
      // const name = keys[i];
      
      // console.log(this.attributes[name])
      // const attribute = this.attributes[name];
      // if (attribute.active) {
        // attribute.drawScene();
      // }
    // }
  }
  toggle(){this.active = !this.active;}
  show(){this.active=true}
  hide(){this.active=false}
  showAttribute(id){
    if(!this.attributes[id])return console.warn("Attribute does not exist");
    this.attributes[id].show();
  }
  hideAttribute(id){
    if(!this.attributes[id])return console.warn("Attribute does not exist");
    this.attributes[id].hide();
  }
  

  addValue(id,array,options){
    this.geometries[this.id].addValue(id,array);
    this.addAttribute(id,options)
  }
  changeAtt(id,array){
    if(this.getAttribute(id))this.getAttribute(id).changeAtt(array);
  }
  

}
