import Geometry from '../geometry';
import { grid, randompoints, quad } from '../primitive';

import { extend } from '@julien.cousineau/util';

import Layer from '../layer';
import AttributeQuad from '../attributequad';
export default class LayerQuad extends Layer {
    constructor(options){
        super(options);
    }
  createAttributes(){
    super.createAttributes();
    this.geometries['quad']=new Geometry(extend({gl:this.gl},quad()));
    const self=this;
    this.attributes[this.id]=new AttributeQuad({_layer:()=>self,id:'default'}).createPrograms();
    return this;
  }

}
