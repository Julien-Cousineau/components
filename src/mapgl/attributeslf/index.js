import { extend } from '@julien.cousineau/util';
import Attribute from '../attribute';

export default class AttributeSLF extends Attribute {
  constructor(options) {
    super(options);
  }
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

  get slf(){return this.layer.slf}
  async getData(){
    if(!this.geometry.values[this.id]){
     const {slf}=this;
     const data = await slf.getFrame(0,this.id);
     this.geometry.addValue(this.id,data);
    }    
  }
}
