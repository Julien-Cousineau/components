// const _GLHelper  = require('./glhelper.js');
// const GLTexture = require('./gltexture.js');
// const util      = require('./util');

// const GLHelper = new _GLHelper();

import {clearRect,clearScene,createArrayBuffer,createElementBuffer} from '../helper';
import Texture from '../texture';

export default class Geometry {
  constructor(options){
    if(!options || !options.gl)throw new Error("Geometry must contain gl");     
    this.buffer={position:{},indices:{},triarea:{},normal:{},texcoord:{},values:{}};
    this.vtexture = {};
    
    this.att={};
    this.gl = options.gl;
    this.type = options.type || 'surface';
    this.positionNumComponents = options.positionNumComponents || 3;
    this.valuesNumComponents = options.valuesNumComponents || 1;
    
    this.position = options.position || null;
    this.indices = options.indices || null;
    this.windices = options.windices || null;
    this.values= {};
    for(const id in options.values || {}){
      this.addValue(id,options.values[id]);
    }
    this.valID = options.valID || 'default';
  }
  get indicescount(){
    return this.indices.length
  }
  get valID(){
    if(!this.values)throw new Error("NoValues")
    if(!this.values[this._valID]){
      
      this._valID=Object.keys(this.values)[0];
      console.warn(this._valID + ' does not exist')
    }
    return this._valID;
  }
  set valID(value){
    this._valID=value;
  }
  setvalID(value){
    this.valID=value
    
  }
  get position(){if(!this._position)throw new Error("Position is empty");return this._position}
  set position(value){
    this._position=value;
    this.setposition();
  }
  get indices(){return this._indices}
  set indices(value){
    this._indices=value;
    this.setindices();
  }
  setposition(){
    const {gl,position,positionNumComponents}=this;
    this.setnpoints();
    
    this.setvindices();
    this.buffer.position={data:createArrayBuffer(gl, position),numComponents:positionNumComponents};
  }
  setindices(){
    const {gl,indices,windices}=this;
    if(indices){
      this.nelem = indices.length / 3.0;
      this.buffer.indices = {data:createElementBuffer(gl, indices)};
      this.buffer.windices = {data:createElementBuffer(gl, indices)}; // TODO: Change primitive to add this
    }
  }
  setnpoints(){
    const npoints = this.npoints= this.position.length / this.positionNumComponents;
    this.res=Math.ceil(Math.sqrt(npoints));
  }
  setvindices(){
    const {gl,npoints,valuesNumComponents}=this;
    const vindices = this.vindices = new Float32Array(npoints);
    for(let i=0;i<npoints;i++)vindices[i]=i;
    this.buffer.vindices={data:createArrayBuffer(gl, vindices),numComponents:valuesNumComponents};
  }

  deleteTextures(){
    for(let id in this.vtexture)this.vtexture[id].delete();
    this.vtexture = {};
  }
 
  addValue(id,value,att){
    if(!id)throw new Error("Must contain id");
    if(!value)throw new Error("Must contain array");
    const {gl,res,valuesNumComponents}=this;
    this.values[id] = value;
    this.buffer.values[id] = {data:createArrayBuffer(gl, value),numComponents:valuesNumComponents};

    this.vtexture[id] = new Texture({gl:gl,width:res,height:res,min:value.min(),max:value.max(),rawdata:value});
    
    this.att[id]={
      minmax:new Float32Array([value.min(),value.max()]),
    };

  }

  get uniforms(){
    const uniforms = {};
    for(let id in this.values){
      uniforms[id+'minmax'] = {type:'float',data:this.att[id].minmax};
    }
    return uniforms;
  }
  get indiceType(){
    if(this.indices instanceof Uint16Array)return this.gl.UNSIGNED_SHORT;
    if(this.indices instanceof Uint32Array)return this.gl.UNSIGNED_INT;
  }
  changeValuesRandom(id){
    if(!id)throw new Error("Must contain id");
    const values = new Float32Array(this.npoints);
    for(let i=0;i<this.npoints;i++)values[i]=Math.random()*1.0;
    this.addValue(id,values);
    
  }
  changeValuesASC(id){
    if(!id)throw new Error("Must contain id");
    const values = new Float32Array(this.npoints);
    for(let i=0;i<this.npoints;i++)values[i]=i / this.npoints;
    this.addValue(id,values);
  }
}
