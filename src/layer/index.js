import * as turf from '@turf/turf'
import Style from '../style'
export default  class Layer {
  constructor(options){
      if(!options)options={}
      this.id = options.id || 'myid';
      this.name = options.name || 'name';
      this.isOn = (typeof options.isOn === 'undefined') ? true : options.isOn;
      // this.type = options.type || 'point';
      this.rstyle = options.rstyle || 'point';
      this.source = options.source || {};
      this.style = options.style || new Style()
      this.sizes = options.size || {
        point:2,
        line:2,
        iso:2,
      }
      

      this.layertype='mapbox';
      this.type = this.getType()
      
      
      this.rstyles = {
      point:{
        point:{title:'Point (P)'},
      },
      line:{
        point:{title:'Point (P)'},
        line:{title:'Line (L)'},
        pointline:{title:'P + L'},
      },
      polygon:{
        point:{title:'Point (P)'},
        line:{title:'Line (L)'},
        pointline:{title:'P + L'},
        surface:{title:'Surface (S)'},
        surfacep:{title:'S + P'},
        surfacel:{title:'S + L'},
        surfacepl:{title:'S + P + L'},
      },
      mesh:{
        point:{title:'Point'},
        wireframe:{title:'Wireframe'},
        surface:{title:'Surface'},
        contour:{title:'Contour'},
        contouriso:{title:'Contour-Iso'}
      },
    }

  }
  get mapboxlayers(){return this.getmapboxlayers()}
  getType(){
    if(Object.keys(this.source).length === 0 && this.source.constructor === Object)return 'point';
    const _type=turf.getType(this.source.data);
    if(_type=='FeatureCollection')return turf.getType(this.source.data.features[0]).toLowerCase()
    return turf.getType(this.source.data).toLowerCase()
    
  }
  getmapboxType(type){
    if(type=='point')return 'circle';
    if(type=='line')return 'line';
    if(type=='polygon')return 'fill';
  }
  getpossiblelayers(type){
    if(type=='point')return ['circle']
    if(type=='line')return [...this.getpossiblelayers('point'),'line']
    if(type=='polygon')return [...this.getpossiblelayers('line'),'fill']
  }
  get mapboxrstyle(){
    return this.getmapboxType(this.rstyle)
  }
  get row(){
      const {id,name,isOn,type}=this;
      return {id:id,name:name,isOn:isOn,type:type};
  }

  createmapboxlayer(mapboxtype){
   const {id,style}=this;
   
   const visibility = this.getOnmapboxlayers().some(item=>item==mapboxtype)?'visible':'none';
    console.log(this.getOnmapboxlayers(),mapboxtype)
      return {
        id: id + "-" + mapboxtype,
        type: mapboxtype,
        source: id,
        paint: style.paint[mapboxtype],
        layout:{visibility:visibility},
        isOn:this.isOn
      }
  }
  getmapboxlayers(){
    return {
      circle:this.createmapboxlayer('circle'),
      line:this.createmapboxlayer('line'),
      fill:this.createmapboxlayer('fill'),
    }
  }
  
  getOnmapboxlayers(){
    const {rstyle}=this;
    if(rstyle=='point')return ['circle']
    if(rstyle=='line')return ['line']
    if(rstyle=='pointline')return ['line','circle']
    if(rstyle=='surface')return ['fill']
    if(rstyle=='surfacep')return ['fill','circle']
    if(rstyle=='surfacel')return ['fill','line']
     if(rstyle=='surfacepl')return ['fill','line','circle']
  }
  
}