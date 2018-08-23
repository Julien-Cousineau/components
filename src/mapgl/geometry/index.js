// const _GLHelper  = require('./glhelper.js');
// const GLTexture = require('./gltexture.js');
// const util      = require('./util');

// const GLHelper = new _GLHelper();

import {clearRect,clearScene,createArrayBuffer,createElementBuffer} from '../helper';
import Texture from '../texture';

export default class Geometry {
  constructor(options){
    if(!options || !options.gl || !options.position)throw new Error("Geometry must contain gl");     
    this.buffer={position:{},indices:{},normal:{},texcoord:{},values:{}};
    this.vtexture = {};
    this.values={};
    this.att={};
    this.gl = options.gl;
    this.type = options.type || 'surface';
    this.positionNumComponents = options.positionNumComponents || 3;
    this.valuesNumComponents = options.valuesNumComponents || 1;
    
    this.position = options.position;
    this.indices = options.indices || null;
    // this.values = options.values || null;  
    this._defaultvalueID = options.defaultvalueID || null;
    
    this.colIDs=[];
    
  
    
      
  }
  get defaultvalueID(){
    if(this.colIDs.length==0)throw new Error("NoValues")
    if(!this._defaultvalueID)this._defaultvalueID=this.colIDs[0];
    return this._defaultvalueID;
  }
  set defaultvalueID(value){
    if(!this.colIDs.some(item=>item==value))throw new Error("Id does not exist");
    this._defaultvalueID=value;
  }
  get position(){return this._position}
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
    const {gl,indices}=this;
    if(indices){
      this.nelem = indices.length / 3.0;
      this.buffer.indices = {data:createElementBuffer(gl, indices)};
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
    this.colIDs.push(id)
    const {gl,res,valuesNumComponents}=this;
    this.values[id] = value;
    this.buffer[id] = {data:createArrayBuffer(gl, value),numComponents:valuesNumComponents};
    this.vtexture[id] = new Texture({gl:gl,width:res,height:res,min:value.min(),max:value.max(),rawdata:value});
    this.att[id+'minmax'] = new Float32Array([value.min(),value.max()]);
    this.att[id+'att'] = att || new Float32Array([value.min(),value.max(),1.0,1.0]);
  }
  get minmax(){
    if(!this.values[this.defaultvalueID])throw new Error('defaultvalueID does not exist');
    return new Float32Array([this.values[this.defaultvalueID].min(),this.values[this.defaultvalueID].max()]);
  }
  get uniforms(){
    const uniforms = {};
    if(this.minmax)uniforms.minmax={type:'float',data:this.minmax};    
    for(let id in this.values){
      uniforms[id+'minmax'] = {type:'float',data:this.att[id+'minmax']};
      uniforms[id+'att'] = {type:'float',data:this.att[id+'att']};
    }
    return uniforms;
  }
  changeAtt(id,f32array){this.att[id+'att']=f32array;}
  
  get indiceType(){
    if(this.indices instanceof Uint16Array)return this.gl.UNSIGNED_SHORT;
    if(this.indices instanceof Uint32Array)return this.gl.UNSIGNED_INT;
  }
  changeValuesRandom(){
    const values = this.values = new Float32Array(this.npoints);
    for(let i=0;i<this.npoints;i++)values[i]=Math.random()*1.0;
  }
  changeValuesASC(){
    const values = this.values = new Float32Array(this.npoints);
    for(let i=0;i<this.npoints;i++)values[i]=i / this.npoints;
  }
}
