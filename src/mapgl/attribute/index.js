
import Texture from '../texture';
import Program from '../program';
import { extend } from '@julien.cousineau/util';
import StyleCatalog from  '../../stylecatalog';
export default class Attribute {
  constructor(options) {
    if(!options || !options._layer)throw new Error("Attribute must contain layer"); 
    this._layer   = options._layer;
    this.id       = options.id;
    this.programs = {};
    this.textures = {};
    if(!this.layer.slayer.getSAttribute(this.id)){
      if(!options.sattribute)console.warn(this.id + " does not exist in the styles, adding" + options.sattribute);
      this.layer.slayer.addSAttribute(this.id,StyleCatalog.getStyle('attribute',options.sattribute,true));
    }
  }
  get layer(){return this._layer()}
  
  get sattribute(){return this.layer.slayer.getSAttribute(this.id)}
  get title(){return this.sattribute.title}
  get active(){return this.sattribute.active}
  set active(value){this.sattribute.active=value}
  set zorder(value){this.sattribute.zorder=value}  
  get zorder(){return this.sattribute.zorder}
  get attactive(){return this.sattribute.attactive}
  set attactive(value){this.sattribute.attactive=value}
  get att(){return this.sattribute.att}
  set att(value){this.sattribute.att=value}
  get weight(){return this.sattribute.weight}
  set weight(value){this.sattribute.weight=value}
  get w(){return this.sattribute.w}
  set w(value){this.sattribute.w=value}
  get value(){return this.geometry.values[this.id]}
  
  get gl(){return this.layer.gl}
  get app(){return this.layer.app}
  get u_matrix(){return this.app.u_matrix}
  get v_matrix(){return this.app.v_matrix}
  get ctx(){return this.app.ctx}
  get worldSize(){return this.app.worldSize}
  get zoom(){return this.app.zoom}
  get geometries(){return this.layer.geometries}
  get geoID(){return this.layer.id}
  get geometry(){return this.geometries[this.geoID]}
  
  createPrograms(){
    const {geoID} = this;
    ['fill','line','circle'].forEach((name)=>{
      const vs = this.layer.mapbox?this.layer.glsl.mapbox.points.vs:this.layer.glsl.points.vs;
      const fs = this.layer.mapbox?this.layer.glsl.mapbox.points.fs:this.layer.glsl.points.fs;
      
      const program ={
        geometryID:geoID,
        vs:vs,
        fs:fs,
        };
      this.addProgram(name,program); 
    },this);
    return this;
  }


  addProgram(id,program){
    if(id in this.programs)throw new Error("id already exist");
    const self=this;
    this.programs[id]=new Program(extend({id:id,_attribute:()=>self},program));
    return this.programs[id];
  }
  addTexture(id, texture){
    if(id in this.textures)throw new Error("id already exist");
    if(!texture)texture={};
    this.textures[id]=new Texture(extend({gl:this.gl},texture));
    return this.textures[id];
  }
  async getData(){
    if(!this.geometry.values[this.id]){
      throw new Error("Error here - Not sure how to obtain the data") 
    }
  }
  async getAllData(program){
    for(let id in program.program.textures){
      if(id=='dtexture')continue;
      if(!program.textures[id]){
        if(!this.layer.attributes[id])throw new Error("Error here");
        await this.layer.attributes[id].getData();
      }
    }
    await this.getData();
  }
  async checkData(){await this.getData()}
  drawScene() {
    if(!this.active)return;
    
    this.geometries[this.geoID].setvalID(this.id);
    const programs=this.programs;
    const keys = Object.keys(programs).sort((a,b)=>{return programs[a].zorder-programs[b].zorder});
     
    for(let i=0;i<keys.length;i++){
      const name = keys[i];
      const program = this.programs[name];
      if (program.active) {
        program.draw();
        if (this.ctx && program.fbID) program.fbtexture.putImageData(this.ctx);
        // if (this.drawfb && this.ctx && program.fbID) program.fbtexture.putImageData(this.ctx);
        if (program.fbID)this.geometry.values[this.id]=program.fbtexture.decodeImage();
      }
    }
  }
  toggle(){(this.active)?this.hide():this.show()}
  show(){this.active=true}
  hide(){this.active=false}
  getProgram(id){
    if(!this.programs[id])throw new Error("Program does not exist");
    return this.programs[id];
  }
  showProgram(id){this.getProgram(id).active=true}
  hideProgram(id){this.getProgram(id).active=false}
  changeAtt(array){this.att = array}
}
