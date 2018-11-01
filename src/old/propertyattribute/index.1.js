import style from './style.scss';
import NavigationPanel from '../../navigationpanel';
import NavigationPill from '../../navigationpill';
import Pill from '../../pill';
// import Panel from '../panel';
import Popover from '../../popover';


import RStyle from './rendering/style';
import RColor from './rendering/color';
import { extend } from '@julien.cousineau/util';
// import ColorGradientPanel from './colorgradientpanel';
// import RenderingStylePanel from './renderingstylepanel';
// import RenderingAttPanel from './renderingattpanel';
// import RenderingLabelPanel from './renderinglabelpanel';

import Layer from '../layer';

export default class PropertyAttribute extends Popover{
  constructor(options){
    super(options)
    if(!options)options={};
    if(!options._layers)throw new Error("PropertyAttribute needs a pointer");
    this._layers = options._layers;
    this._layer = options.layer || 'default';
    this._attribute = options.attribute || 'default';
    
    const self=this;
    const _callbacks =  options.callbacks || {};
    
    
    const callbacks = this.callbacks = extend(_callbacks,{refreshPanels:()=>self.refresh()}) 

    
    const rsp = this.rsp = new RStyle({ _attribute:()=>self.attribute,title:'Style',callbacks:callbacks});
    const rpp = this.rpp = new RColor({_attribute:()=>self.attribute,title:'Color',callbacks:callbacks})
    // const rap =this.rap = new RProp({_activelayer:()=>self.activelayer,title:'Attribute',callbacks:callbacks})

    // const npp = new NavigationPanel({panels:[rsp]})
    const npp = new NavigationPanel({panels:[rsp,rpp]})
    // const npp = new NavigationPanel({panels:[rsp,rpp,rap]})


    const pill = new Pill({id:"Rendering",active:true,navpanels:npp})

    this.np =  new NavigationPill({style:'layerproperty',pills:[pill]})
    
  }
  // get activeAttribute(){
  //   if(!this.attributes[this._activeAttribute])
  //   throw new Error("_activeAttribute does not exist");
  //   return this.attributes[this._activeAttribute]
    
  // }
  get layers(){return this._layers()}
  get layer(){
    if(!this.layers[this._layer])return new Layer();
    return this.layers[this._layer];
  }
  get attributes(){return this.layer.attributes}
  get attribute(){return this.attributes[this._attribute]}
  render(element){
    super.render(element);
    const {content} = this;
    this.np.render(content);
  }
  refresh(){
    this.rsp.refresh();
    this.rpp.refresh();
  }
  show(_layer,_attribute){
    this._layer=_layer;
    this._attribute=_attribute;
    super.show();
    this.refresh()
  }
  
//   setGradient(gradient){
//     if(!this._activeAttribute)return;
//     this.map.setGradient(this.activeid,gradient);
//   }

}

