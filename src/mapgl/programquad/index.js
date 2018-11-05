
import {draw,createProgram,createFrameBuffer} from '../helper';
const {extend} = require('@julien.cousineau/util');
import Texture from '../texture';

import mcafs from '../shaders/quad.mca.js';
export default class ProgramQuad{
  constructor(options){
    if(!options._attribute)throw new Error("Parent must be defined");
    if(!options.geometryID)throw new Error("geometryID must be defined");
    if(!options.vs)throw new Error("Vertex Source must be defined");
    if(!options.fs)throw new Error("Fragment Source must be defined");
    if(!options.fbID)throw new Error("programquad needs fbID")

    this._attribute = options._attribute;
    this.geometryID = options.geometryID;
    this.active     = true;
    this.zorder     = options.zorder || -1;
    this.mode       = 'TRIANGLES';
    this.vs         = options.vs;
    this.fs         = options.fs;
    this.geoTextureID = options.geoTextureID || null;
    this._uniforms  = options.uniforms || {};
    this.fbID       = options.fbID;
    this.fb         = createFrameBuffer(this.gl);
    this.program    = createProgram(this.gl, this.vs, this.fs);
    this.program.mode = this.mode;
    
    this.activeAtts =[];
      
  }
  get wireframe(){return false}
  get attribute(){return this._attribute()}
  get attributes(){return this.layer.attributes}
  get layer(){return this.attribute.layer}
  get gl(){return this.attribute.gl}
  get geometries(){return this.attribute.geometries||{}}
  get alltextures(){return this.attribute.textures||{}}
  get u_matrix(){return this.attribute.u_matrix}
  get v_matrix(){return this.attribute.v_matrix}
  get worldSize(){return this.attribute.worldSize}
  get zoom(){return this.attribute.zoom}

  get geometry(){
    if(!this.geometries[this.geometryID])throw new Error("Geometry does not exist");
    return this.geometries[this.geometryID];
  }
  checkShader(){
    const {attributes}=this;
    const _activeAtts=[];
    for(const id in attributes){
        if(attributes[id].sattribute.attactive)_activeAtts.push(id);
    }

    if(JSON.stringify(this.activeAtts)!==JSON.stringify(_activeAtts)){
      this.activeAtts=_activeAtts;
      const fs = mcafs(_activeAtts);
      this.changeSource(this.vs,fs);
    }
  }
 


  get textures(){
    const {geometries,geoTextureID}=this;
    const ptextures={};
    
    if(geoTextureID){
      for(let id in geometries[geoTextureID].vtexture){
        ptextures[id]=geometries[geoTextureID].vtexture[id];
      }      
    }          
    return ptextures;
  }
  get fbtexture(){
    if(!this.alltextures[this.fbID])throw new Error("FrameBuffer Texture does not exist");
    return this.alltextures[this.fbID];
  }  
  

  get uniforms(){
    const {geoTextureID,geometries,geometry,_uniforms,program,u_matrix,v_matrix,worldSize,zoom,attributes}=this;
    let uniforms = (geoTextureID)?
        extend(geometries[geoTextureID].uniforms,_uniforms):
        extend(geometry.uniforms,_uniforms);
    
    // Get Attribute
     for(const id in attributes){
        if(attributes[id].sattribute.attactive){
          const obj={};
          obj[id+'att']={type:'float',data:attributes[id].sattribute.att};
          uniforms=extend(uniforms,obj);   
        };
    }
        
    
        
    if(program.uniforms.u_matrix)uniforms=extend(uniforms,{u_matrix:{type:'matrix',data:new Float32Array(u_matrix)}});
    if(program.uniforms.v_matrix)uniforms=extend(uniforms,{v_matrix:{type:'matrix',data:new Float32Array(v_matrix)}});
    if(program.uniforms.worldSize)uniforms=extend(uniforms,{worldSize:{type:'float',data:new Float32Array([worldSize])}});
    if(program.uniforms.zoom)uniforms=extend(uniforms,{zoom:{type:'float',data:new Float32Array([zoom])}});
    return uniforms;
  }
  changeSource(vs,fs){
    this.vs = vs;
    this.fs = fs;
    this.program=createProgram(this.gl, this.vs, this.fs);    
  }
  draw(){
    if(!this.active)return;
    
    this.checkShader();
    const gl=this.gl,program=this.program;
    gl.useProgram(program.program);
    draw(this);
    gl.useProgram(null);
    this.active=false;
  }
}

