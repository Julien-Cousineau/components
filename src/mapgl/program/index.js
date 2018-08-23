
import {draw,createProgram,createFrameBuffer} from '../helper';
const {extend} = require('@julien.cousineau/util');

export default class Program{
    constructor(options){
      if(!options._app)throw new Error("Parent must be defined");
      if(!options.geometryID)throw new Error("geometryID must be defined");
      if(!options.vs)throw new Error("Vertex Source must be defined");
      if(!options.fs)throw new Error("Fragment Source must be defined");
      
      this._app    = options._app;
      this.geometryID = options.geometryID;
      this.vs         = options.vs;
      this.fs         = options.fs;
      this.geoTextureID = options.geoTextureID || null;
      this.textureIDs = options.textureIDs || {};
      this.fbID       = options.fbID || null; 
      this.active     = (options.active === true)? true:false;
      this.mode       = options.mode || 'POINTS';
      this._uniforms  = options.uniforms || {};  
      
      this.program=createProgram(this.gl, this.vs, this.fs);
      this.program.mode=this.mode;
      if(this.fbID)this.fb=createFrameBuffer(this.gl);
        
    }
    
    get app(){return this._app()}
    get gl(){if(!this.app.gl)throw new Error("GL Program must contain gl");return this.app.gl}
    get geometries(){return this.app.geometries||{}}
    get alltextures(){return this.app.textures||{}}
    get u_matrix(){return this.app.u_matrix}
    get v_matrix(){return this.app.v_matrix}
    get worldSize(){return this.app.worldSize}
  
    get geometry(){
      if(!this.geometries[this.geometryID])throw new Error("Geometry does not exist");
      return this.geometries[this.geometryID]
    }
    
  get textures(){
    const {geometries,textureIDs,alltextures,geoTextureID}=this;
    const ptextures={};
    textureIDs.forEach(id=>{
       if(alltextures[id])ptextures[id]=alltextures[id];
    });
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
    const {geoTextureID,geometries,geometry,_uniforms,program,u_matrix,v_matrix,worldSize}=this;
    let uniforms = (geoTextureID)?
        extend(geometries[geoTextureID].uniforms,_uniforms):
        extend(geometry.uniforms,_uniforms);
    if(program.uniforms.u_matrix)uniforms=extend(uniforms,{u_matrix:{type:'matrix',data:new Float32Array(u_matrix)}});
    if(program.uniforms.v_matrix)uniforms=extend(uniforms,{v_matrix:{type:'matrix',data:new Float32Array(v_matrix)}});
    if(program.uniforms.worldSize)uniforms=extend(uniforms,{worldSize:{type:'float',data:new Float32Array([worldSize])}});
    return uniforms;
  }
  changeSource(vs,fs){
    this.vs = vs;
    this.fs = fs;
    this.program=createProgram(this.gl, this.vs, this.fs);    
  }
  draw(){
    const gl=this.gl,
          program=this.program;
    gl.useProgram(program.program);
    draw(this);
    gl.useProgram(null);
  }
}


