import GUISLayer from './slayer.js';
import {LayerMapbox} from '../index.js';
export default class GUILayer extends GUISLayer{
  constructor(options){
      options = options || {};
      if(!options.layer)console.warn("StyleGUILayer needs a layer");
      options.layer = options.layer || new LayerMapbox();
      options.slayer = options.layer.slayer;
      super(options);
      this.layer=options.layer;
  }
}