import PropertyAttribute from '../propertyattribute';
import Layer from '../layer';
import { extend } from '@julien.cousineau/util';
export default class PropertyLayer{
  constructor(options){
    if(!options)options={};
    if(!options._layers)throw new Error("PropertyLayer needs a pointer");
    this._layers = options._layers || function(){return {}};
    this._layer = options.layer || 'default'
    this.callbacks = options.callbacks || {};
    
    const self=this;
    this.propertyattribute = new PropertyAttribute({
        _layer:()=>self.layer,
         width: 400,
        height: 400,
         callbacks:extend(this.callbacks,{ setRStyle:(style)=>console.log('callback answer=',style),
                                           setActive:(value)=>console.log('callback answer=',value),
                                           changePointSize:(size)=>console.log('callback answer=',size),
                                           changeLineSize:(size)=>console.log('callback answer=',size),
                                           changeIsoSize:(size)=>console.log('callback answer=',size),})
        
    })
  }
  get layer(){
      if(!this.layers[this._layer]){
        if(!this.layers){this._layer = Object.keys(this.layers)[0];}
        else{return new Layer()}
      }
      return this.layers[this._layer];
  }
  get layers(){return this._layers()}
  render(element){
    this.propertyattribute.render(element);
  }
  show(_layer,_attribute){
    this._layer=_layer;
    this.layer.showAttribute(_attribute);
    this.propertyattribute.show();
  }


}

