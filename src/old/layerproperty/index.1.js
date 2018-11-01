import style from './style.scss';
import NavigationPanel from '../navigationpanel';
import NavigationPill from '../navigationpill';
import Pill from '../pill';
import Panel from '../panel';
import Popover from '../popover';


import ColorGradientPanel from './colorgradientpanel';
import RenderingStylePanel from './renderingstylepanel';
import RenderingAttPanel from './renderingattpanel';
import RenderingLabelPanel from './renderinglabelpanel';

import Layer from '../layer';

export default class LayerProperty extends Popover{
  constructor(options){
    super(options)
    if(!options)options={};
    this._map=options._map || function(){return {}};
    this.title = options.title || 'Layer';
    this.type = options.type || 'mesh';
    this.activeid = options.activeid || null;
    
    const self=this;
    const callbacks = this.callbacks = options.callbacks || {
      changeRStyle:(style)=>self.setRStyle(style),
      changePointSize:(size)=>{self.activelayer.sizes.point = size;self.map.changePaint(self.activeid + "-circle",'circle-radius',size)},
      changeLineSize:(size)=>{self.activelayer.sizes.line = size;self.map.changePaint(self.activeid + "-line",'line-width',size)},
      changeIsoSize:(size)=>{self.activelayer.sizes.iso = size;self.map.changePaint(self.activeid + "-line",'line-width',size)},
    };
    
    
    const rsp = this.rsp = new RenderingStylePanel({_lp:()=>self,title:'Style',callbacks:callbacks})
    const rap =this.rap = new RenderingAttPanel({title:'Attribute',callbacks:{
      att:function(){console.log("User has pressed att")},
    }})
    const rlp =this.rlp = new RenderingLabelPanel({title:'Label',callbacks:{
      options:function(id,value){console.log("User has pressed {0}-{1}".format(id,value))},
    }})
    
    const npp = new NavigationPanel({panels:[rsp,rap,rlp]})

    const colorscalepanel = this.colorscalepanel = new ColorGradientPanel({title:'Style',col:6,callback:(gradient)=>self.setGradient(gradient)})
    const statpanel = new Panel({title:'Colorscale',col:12})
    const npp2 = new NavigationPanel({panels:[colorscalepanel]})

    const pill = new Pill({id:"Rendering",active:false,navpanels:npp})
    const pill2 = new Pill({id:"Colorscale",active:true,navpanels:npp2})
    const stats = new Pill({id:"Statistics",active:false,navpanels:new NavigationPanel({panels:[statpanel]})})
    
    const query = new Pill({id:"Filter",active:false,navpanels:new NavigationPanel({
      panels:[new Panel({title:'Spatial',col:6}),
              new Panel({title:'Attributes',col:6}),
              new Panel({title:'Properties',col:6})
             ]
    })})
    const calc = new Pill({id:"Calculator",active:false,navpanels:new NavigationPanel({
      panels:[new Panel({title:'Interpolation',col:6}),
              new Panel({title:'Attributes',col:6}),
              new Panel({title:'Properties',col:6})
             ]
    })})
    this.np =  new NavigationPill({style:'layerproperty',pills:[pill,pill2,query,stats,calc]})
    
  }
  
  get map(){return this._map()}
  get activelayer(){if(!this.activeid)return new Layer();return this.map.layers[this.activeid]}
  
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
    this.rsp.refresh();
    this.map.setRStyle(this.activeid,rstyle);

  }
  setGradient(gradient){
    if(!this.activeid)return;
    this.map.setGradient(this.activeid,gradient);
  }

}

