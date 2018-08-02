import NavigationPanel from '../navigationpanel';
import NavigationPill from '../navigationpill';
import Pill from '../pill';
import Panel from '../panel';



import ColorGradientPanel from './colorgradientpanel';
import RenderingStylePanel from './renderingstylepanel';
import RenderingAttPanel from './renderingattpanel';
import RenderingLabelPanel from './renderinglabelpanel';



export default class LayerProperty {
  constructor(options){
    if(!options)options={};
    this.title = options.title || 'Layer';
    this.type = options.type || 'mesh';
    
    
    const rsp = this.rsp = new RenderingStylePanel({title:'Style',callbacks:{
      style:function(value){console.log("User has pressed {0}".format(value))},
      options:function(id,value){console.log("User has pressed {0}-{1}".format(id,value))},
    }})
    const rap =this.rap = new RenderingAttPanel({title:'Attribute',callbacks:{
      att:function(){console.log("User has pressed att")},
    }})
    const rlp =this.rlp = new RenderingLabelPanel({title:'Label',callbacks:{
      options:function(id,value){console.log("User has pressed {0}-{1}".format(id,value))},
    }})
    
    const npp = new NavigationPanel({panels:[rsp,rap,rlp]})
    
 

    
    const colorscalepanel = this.colorscalepanel = new ColorGradientPanel({title:'Style',col:6})
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
    this.np =  new NavigationPill({pills:[pill,pill2,query,stats,calc]})
    
  }
  render(element){
    const {title,np,colorscalepanel} = this;
    const container = element.append("div").attr('class','layerproperty')
    const trans = container.append("div").attr('class','background')
    const titlebar = container.append("div").attr('class','title')
    const titledom = titlebar.append("span").append("h2").text(title);
    const nav = titlebar.append("ul").attr('class','nav navbar-right panel_toolbox')
    const close = nav.append('li').append('a').attr('class','close-link')
    const closeicon = close.append('i').attr('class','fa fa-times')
    titlebar.append('div').attr('class',"clearfix");
    const content = titlebar.append('div').attr('class',"content");
    np.render(content)

    
  }
  setStyle(type,active){
    this.rsp.changeDropdown(type,active);
    this.rlp.changeType(type);
  }
  changeAttributes(id,values){
    this.rap.changeDropdown(id,values);
  }
}