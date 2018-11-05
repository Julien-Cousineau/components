
import {draw,createProgram,createFrameBuffer} from '../helper';
const {extend} = require('@julien.cousineau/util');
import Texture from '../texture';

import mcafs from '../shaders/quad.mca.js';
export default class Program{
  constructor(options){
    if(!options._attribute)throw new Error("Parent must be defined");
    if(!options.geometryID)throw new Error("geometryID must be defined");
    if(!options.vs)throw new Error("Vertex Source must be defined");
    if(!options.fs)throw new Error("Fragment Source must be defined");
    

    this._attribute = options._attribute;
    this.id         = options.id || null;

    this.geometryID = options.geometryID;
    this.vs         = options.vs;
    this.fs         = options.fs;
   
    this.geoTextureID = options.geoTextureID || null;
    this.textureIDs = ['color'].concat(options.textureIDs || []);
    
    this.fbID       = options.fbID || null; 
    if(this.fbID)this.fb=createFrameBuffer(this.gl);
    
    this.modes      = {circle:'POINTS',line:'LINES',fill:'TRIANGLES',contour:'TRIANGLES'};
    this.mode       = options.mode || this.modes[this.type];

    this._uniforms  = extend({
      base:{ data: [1.0], type: 'float' },
      u_pointsize:{ data: [1.0], type: 'float' },  
      },options.uniforms || {});
    this.colortexture = new Texture(extend({gl:this.gl},{glslvarname:'dtexture'}));

    this.program=createProgram(this.gl, this.vs, this.fs);
    this.program.mode=this.mode;
      
  }
  get wireframe(){return this.type=='line'}
  get layer(){return this.attribute.layer}
  get attributes(){return this.layer.attributes}
  
  get attribute(){return this._attribute()}
  get sattribute(){return this.attribute.sattribute}
  get sprogram(){return this.sattribute.getSProgram(this.id)}
  get active(){return this.sprogram.active}
  set active(value){this.sprogram.active=value;}
  set zorder(value){this.sprogram.zorder=value}  
  get zorder(){return this.sprogram.zorder}
  get type(){return this.sprogram.type}
  
  
  
  get gl(){return this.attribute.gl}
  get geometries(){return this.attribute.geometries||{}}
  get alltextures(){return this.attribute.textures||{}}
  get u_matrix(){return this.attribute.u_matrix}
  get v_matrix(){return this.attribute.v_matrix}
  get worldSize(){return this.attribute.worldSize}
  get zoom(){return this.attribute.zoom}

  get geometry(){
    if(!this.geometries[this.geometryID])throw new Error("Geometry does not exist");
    return this.geometries[this.geometryID]
  }

  checkStyle(){
    this.checkTexture();
    this.checkUniforms();
  }
  checkTexture(){
    const {colortexture,sprogram}=this;
    if(!sprogram.paint.colorbyatt){
      const color = {0:sprogram.paint.color,1:sprogram.paint.color};
      if(JSON.stringify(colortexture.gradient)!==JSON.stringify(color)){
        colortexture.updateGradient(color);
      }
    } else {
      if(JSON.stringify(colortexture.gradient)!==JSON.stringify(sprogram.paint.gradient.obj)){
        colortexture.updateGradient(sprogram.paint.gradient.obj);
      }
    }

  } 
  checkUniforms(){
    const {sprogram}=this;
    this._uniforms.u_pointsize = { data: [sprogram.paint.radius], type: 'float' };
    this._uniforms.minmax      = { data: sprogram.paint.minmax, type: 'float' };
    this._uniforms.base        = { data: [sprogram.paint.exponent], type: 'float' };
  }

  get textures(){
    const {geometries,textureIDs,alltextures,geoTextureID,colortexture}=this;
    const ptextures={color:colortexture};
    
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

  get uniforms(){
    const {geoTextureID,geometries,geometry,_uniforms,program,u_matrix,v_matrix,worldSize,zoom}=this;
    let uniforms = (geoTextureID)?
        extend(geometries[geoTextureID].uniforms,_uniforms):
        extend(geometry.uniforms,_uniforms);
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
    this.checkStyle();
    const gl=this.gl,
          program=this.program;
    gl.useProgram(program.program);
    draw(this);
    gl.useProgram(null);
  }
  
  toggle(){this.active = !this.active;}
  show(){this.active=true}
  hide(){this.active=false}
  setTexture(id,gradient){
    this.colortexture.updateColorRamp(gradient);
  }
  setUniform(id,value){
    this._uniforms[id]=value;
  }
}


// if (module.hot) {
//   // module.hot.dispose(function() {
//   //   button.remove();
//   //   button2.remove();
//   //   button3.remove();
//   //   button4.remove();
//   // });
//   module.hot.accept();
// }
