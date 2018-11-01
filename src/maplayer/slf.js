import * as turf from '@turf/turf'
// import Style from '../../style'
// import Layer from '../../mapgl/layerslf'
// import SelafinSync from '../../selafinsync'
// import Paint from '../../style/paint.js'
// import Checkbox from '../../checkbox'
// import DraggableNumber from '../../draggablenumber'
import {SelafinSync,Checkbox,DraggableNumber} from '../index.js';
import {extend} from '@julien.cousineau/util';
export default  class LayerSLF {
  constructor(options){
      options = options || {};
      this._mapboxgl = options._mapboxgl;
      const id = this.id = options.id || 'myid'
      
      this._slayer = options.slayer || 'debug-slf';
      const images = this.images = options.images || {};
      const sourceid = this.sourceid = options.sourceid || null; 
      const source = this.source = options.source || null; // {type:'geojson',data:''}
      this.showdetail = false;
      this.type='slf';
  }
  get mapboxgl(){return this._mapboxgl();}
  get mapGL(){return this.mapboxgl.mapGL}
  get active(){return (this.glLayer)?this.glLayer.active:false}
  set active(value){if(this.glLayer)this.glLayer.active=value;}  
  get slayer(){return (this.glLayer)?this.glLayer.slayer:null}
  get zorder(){
    return (this.glLayer)?this.glLayer.slayer.zorder:0}
  set zorder(value){this.glLayer.slayer.zorder=value}  
  get name(){return (this.glLayer)?this.glLayer.slayer.title:''}
  get title(){return this.name}
  async getSourceSync(){
    const {type, data} = this.source;
    if(type != 'slf')throw new Error("Type is not slf")
    const slf = this.source.data = (typeof data==='string')?await SelafinSync.url(data,this.source):data;
    return slf;
  } 
  get geometry(){return this.glLayer.geometries[this.glLayer.id]}
  get attributes(){return this.glLayer.attributes}
  toggle() {this.glLayer.toggle()}
  show(){this.glLayer.show()}
  hide() {this.glLayer.hide()}
  addToMap(){
    const {id,source,_slayer,mapGL}=this
    const slf = source.data;
    this.glLayer = mapGL.addLayerSLF(id,{slf:slf,slayer:_slayer});
    return this;
    
  }
  
  get subtable(){
    const columns = { 
        active:{title:"",width:"30px",sortable:false,active:true,render:(o)=>{new Checkbox({title:'',value:o.data,callback:(value)=>{o.row[o.id]=value;this.mapboxgl.drawScene();console.log(o.row)}}).render(o.element)}},
        title:{title:"Name",sortertype:'string',active:true,render:(o)=>{o.element.text(o.data)}},
        zorder:{title:"ZOrder",sortertype:'number',active:true,render:(o)=>{new DraggableNumber({title:'',value:o.data,callback:(value)=>{o.row[o.id]=value;this.mapboxgl.drawScene()}}).render(o.element)}},
        attactive:{title:"Suitability?",active:true,render:(o)=>{new Checkbox({title:'',value:o.data,callback:(value)=>{o.row[o.id]=value;this.setCumWeight();if(o.table.callbacks.drawScene)o.table.callbacks.drawScene(this);if(o.table.callbacks.refreshT)o.table.callbacks.refreshT(this)}}).render(o.element)}},
        weight:{title:"Weight",active:true,render:(o)=>{o.row.dnweight=new DraggableNumber({title:'',value:o.data,callback:(value)=>{o.row[o.id]=value;this.setCumWeight();if(o.table.callbacks.drawScene)o.table.callbacks.drawScene(this);}}).render(o.element)}},
        properties:{title:"",width:"25px",sortable:false,sortertype:null,active:true,render:(o)=>{o.element.append('i').attr('class','fas fa-cog').on('click',()=>{if(o.table.callbacks.showAttribute)o.table.callbacks.showAttribute(this,o.row)})}},
      
    }
    return {small:true,columns:columns,data:Object.keys(this.attributes).map(key=>this.attributes[key])}
  }
  setCumWeight(){
    
    let cumWeight=0;
    for(let id in this.attributes){
        const attribute = this.attributes[id];
        if(attribute.id==='quad')continue;
        if(attribute.attactive)cumWeight += attribute.weight;    
    }
    this.attributes['quad'].weight=cumWeight;
    this.attributes['quad'].dnweight.setValue(cumWeight);
  }

}