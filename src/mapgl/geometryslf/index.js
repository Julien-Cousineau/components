import {createElementBuffer} from '../helper';
import Geometry from '../geometry';
export default class GeometrySLF extends Geometry {
  constructor(options){
      super(options)
    if(!options || !options.slf)throw new Error("GeometrySLF must contain SLF");     
    const slf = this.slf=options.slf;
    this.setposition();
    this.setindices();
    this.wireframe=false;
    const dvalues = new Float32Array(slf.NPOIN2);
    // for(let i=0;i<slf.NPOIN2;i++)dvalues[i]=i * 1.0/slf.NPOIN2;
    for(let i=0;i<slf.NPOIN2;i++)dvalues[i]=i * 0.0;
    this.addValue('quad',dvalues)
    // console.log(slf.XY)
    // console.log(slf.IKLE3F)
    
  }
  get position(){return this.slf.XY}
  get indices(){return (this.wireframe)?this.slf.IKLEW:this.slf.IKLE3F}
  set position(value){return}//overwrite
  set indices(value){return}//overwrite
  
  setindices(){
    const {gl,slf}=this;
    this.nelem = slf.IKLE3F.length / 3.0;
    this.buffer.indices = {data:createElementBuffer(gl, slf.IKLE3F)};
    this.buffer.windices = {data:createElementBuffer(gl, slf.IKLEW)};
  }

 
  
  // changeValue(frameid,varid,att){
  //   const id = 'value';
  //   const value = this.values[id] = this.slf.getFrame(frameid,varid);
  //   this.att[id+'minmax'] = new Float32Array([value.min(),value.max()]);
  //   this.att[id+'att'] = att || new Float32Array([value.min(),value.max(),1.0,1.0]);
  // }
  // changeValueFromBinary(){
  //   const id = 'value';
    
  //   const value = this.values[id] = this.slf.getFrame(frameid,varid);
  //   this.att[id+'minmax'] = new Float32Array([value.min(),value.max()]);
  //   this.att[id+'att'] = att || new Float32Array([value.min(),value.max(),1.0,1.0]);
  // }
 
}
