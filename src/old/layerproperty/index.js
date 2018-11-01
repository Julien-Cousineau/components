import style from './style.scss';
import NavigationPanel from '../navigationpanel';
import NavigationPill from '../navigationpill';
import Pill from '../pill';
import Panel from '../panel';
import Popover from '../popover';


import RStyle from './rendering/style';
import RProp from './rendering/prop';
import { extend } from '@julien.cousineau/util';
// import ColorGradientPanel from './colorgradientpanel';
// import RenderingStylePanel from './renderingstylepanel';
// import RenderingAttPanel from './renderingattpanel';
// import RenderingLabelPanel from './renderinglabelpanel';

import Layer from '../layer';

export default class LayerProperty extends Popover{
  constructor(options){
    super(options)
    if(!options)options={};
    if(!options._layers)throw new Error("LayerProperty needs layers pointer");
    this._layers = options._layers || function(){return {}};
    this.title = options.title || 'Layer';
    this.type = options.type || 'mesh';
    this.activeid = options.activeid || null;
    
    const self=this;
    const callbacks = this.callbacks = options.callbacks || {};

    const setRStylecallback = (callbacks.setRStyle)?callbacks.setRStyle:null;
    const rsp = this.rsp = new RStyle({_activelayer:()=>self.activelayer,title:'Style',
      callbacks:extend(callbacks,{
            setRStyle:(style)=>{
              if(setRStylecallback)setRStylecallback(style);
              self.setRStyle(style);
              
            }}
            )})
    const rpp = this.rpp = new RProp({_activelayer:()=>self.activelayer,title:'Style Properties',callbacks:callbacks})
    const rap =this.rap = new RProp({_activelayer:()=>self.activelayer,title:'Attribute',callbacks:callbacks})
    // const rlp =this.rlp = new RenderingLabelPanel({title:'Label',callbacks:callbacks})
    
    // const npp = new NavigationPanel({panels:[rsp,rap,rlp]})
    const npp = new NavigationPanel({panels:[rsp,rpp,rap]})

    // const colorscalepanel = this.colorscalepanel = new ColorGradientPanel({title:'Style',col:6,callback:callbacks})
    // const statpanel = new Panel({title:'Colorscale',col:12})
    // const npp2 = new NavigationPanel({panels:[colorscalepanel]})

    const pill = new Pill({id:"Rendering",active:true,navpanels:npp})
    // const pill2 = new Pill({id:"Colorscale",active:true,navpanels:npp2})
    // const stats = new Pill({id:"Statistics",active:false,navpanels:new NavigationPanel({panels:[statpanel]})})
    
    // const query = new Pill({id:"Filter",active:false,navpanels:new NavigationPanel({
    //   panels:[new Panel({title:'Spatial',col:6}),
    //           new Panel({title:'Attributes',col:6}),
    //           new Panel({title:'Properties',col:6})
    //         ]
    // })})
    // const calc = new Pill({id:"Calculator",active:false,navpanels:new NavigationPanel({
    //   panels:[new Panel({title:'Interpolation',col:6}),
    //           new Panel({title:'Attributes',col:6}),
    //           new Panel({title:'Properties',col:6})
    //         ]
    // })})
    // this.np =  new NavigationPill({style:'layerproperty',pills:[pill,pill2,query,stats,calc]})
    this.np =  new NavigationPill({style:'layerproperty',pills:[pill]})
    
  }
  
  get layers(){return this._layers()}
  get activelayer(){if(!this.activeid)return new Layer();return this.layers[this.activeid]}
  
  render(element){
    super.render(element);
    const {content} = this;
    this.np.render(content);
  }
  show(activeid){
    super.show();
    this.activeid=activeid;
    this.rsp.refresh();
     
  }
  setRStyle(rstyle){
    if(!this.activeid)return;
    // this.rsp.refresh();
    this.rpp.refresh();
    console.log("here")
    // this.map.setRStyle(this.activeid,rstyle);

  }
  setGradient(gradient){
    if(!this.activeid)return;
    this.map.setGradient(this.activeid,gradient);
  }

}

