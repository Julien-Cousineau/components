import GUISAttribute from './sattribute.js';
import {LayerMapBox} from '../index.js';
export default class GUIAttribute extends GUISAttribute{
  constructor(options){
      options = options || {};
      if(!options.attribute)throw Error("GUIAttribute needs a attribute");
      
      options.sattribute = options.attribute.sattribute;
      super(options);
      this.attribute=options.attribute;
  }
}