import * as turf from '@turf/turf'

// import Fetch from '../fetch'
import Attribute from './attribute';
import { extend } from '@julien.cousineau/util';
export default  class Layer {
  constructor(options){
      if(!options)options={}
      // this.id = options.id || 'myid';
      // this.name = options.name || 'name';
      // this.group = options.group || 'gis';
      // this.active = (typeof options.active === 'undefined') ? true : options.active;
      // this.type = options.type || 'point';
      // this.rstyleid = options.rstyleid || 'point';
      // this.source = options.source || {}; // {type:'geojson',data:''}
      
      // this.sizes = options.size || {
      //   point:2,
      //   line:2,
      //   wireframe:2,
      //   iso:2,
      // }
      // this._data = options._data || null;
      // this.fetch = new Fetch({callbacks:{progress:()=>{}}})
      // this.attributes = options.attributes || {};
      // this.addAttribute('default',{title:'Default'})
      // this._attribute='default';
      

      // this.layertype='mapbox';
      // this.type = options.type || this.getType()
      
    //   this.rstyles = {
    //     point:{id:'point',title:'Point',active:true,size:2},
    //     line:{id:'line',title:'Line',active:true,size:2},
    //     wireframe:{id:'wireframe',title:'Wireframe',active:true,size:2},
    //     surface:{id:'surface',title:'Surface',active:true,size:0},
    //     contour:{id:'contour',title:'Contour',active:true,size:0},
    //     contouriso:{id:'contouriso',title:'Contour ISO',active:true,size:2},
    //   }
      
    //   this.typestyles = {
    //   point:['point'],
    //   line:['point','line'],
    //   polygon:['point','line','surface'],
    //   mesh:['point','wireframe','surface','contour','contouriso'],
    // }

  }
  // get attribute(){
  //   return this.attributes[this._attribute];
  // } 
  // get data(){return (this._data)?this._data():undefined;}
  // get rstyle(){return this.rstyles[this.rstyleid]}
  // get activelist(){
  //   const {rstyles}=this;
  //   const obj={}
  //   this.typestyles[this.type].forEach(id=>obj[id]=rstyles[id]);
  //   return obj;
  // }
  // getType(){
  //   if(this.source.type=='slf')return 'mesh';
  //   if(Object.keys(this.source).length === 0 && this.source.constructor === Object)return 'point';
  //   const _type=turf.getType(this.source.data);
  //   if(_type=='FeatureCollection')return turf.getType(this.source.data.features[0]).toLowerCase();
  //   return turf.getType(this.source.data).toLowerCase();
    
  // }

  // toggle(){this.active = !this.active}
  // show(){this.active=true}
  // hide(){this.active=false}
  
  
  // setPaintProperty(prop,value){this.style.setPaintProperty(prop,value)}


  // addAttribute(id,options){
  //   const self=this;
  //   if(!options)options={};
  //   this.attributes[id]=new Attribute(extend(options,{id:id,_layer:()=>self}))
  // }
  // setAttribute(_attribute){
  //   if(!this.attributes[_attribute])return;
  //   this._attribute = _attribute;
  // }
}