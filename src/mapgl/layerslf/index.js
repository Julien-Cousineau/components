import Geometry from '../geometry';
import GeometrySLF from '../geometryslf';
import {quad } from '../primitive';
import Style from '../../style';
// import Texture from '../texture';
// import Program from '../program';
// import Camera from '../camera';
// import { clearRect, clearScene } from '../helper';
// const glsl = require('glslify');

import { extend } from '@julien.cousineau/util';

// import GLSL from '../shaders';
import Layer from '../layer';
import Attribute from '../attribute';
import AttributeSLF from '../attributeslf';
import AttributeQuad from '../attributequad';
export default class LayerSLF extends Layer {
    constructor(options){
        super(options)
        if(!options.slf)throw new Error("Needs SLF")
        this.options = options;
        const slf=this.slf=options.slf;
        // this.addAttributes = (typeof options.addAttributes == 'undefined') ? true : options.addAttributes;
        // // this.initialprograms = options.initialprograms || {line:{active:false},fill:{active:false},circle:{active:true}};
        
        // this.initializeslf();
        
        
    }
  createAttributes(){
    const {slf}=this;
    this.geometries[this.id]=new GeometrySLF(extend({gl:this.gl},{slf:slf}));
    this.geometries['quad']=new Geometry(extend({gl:this.gl},quad()));
    
    const self=this;
    // const options = {};
    // options.drawfb = (typeof this.options.drawfb == 'undefined') ? false : this.options.drawfb; //TODO
    this.attributes['quad']=new AttributeQuad({_layer:()=>self,id:'quad'}).createPrograms();;
    
    slf.varnames.forEach((id,index)=>this.addAttribute(id),this);    
    for(let id in slf.binaries)this.addAttribute(id);

    return this;
    
  }
  addAttribute(id){
    const self=this;
    this.attributes[id]=new AttributeSLF(extend({_layer:()=>self,id:id})).createPrograms();
  }
  addValue(id,array,options){
    const self=this;
      this.geometries[this.id].addValue(id,array);
      this.attributes[id]=new Attribute(extend({_layer:()=>self,id:id},options)).createPrograms();
  }

    
}
