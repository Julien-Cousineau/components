import * as turf from '@turf/turf'
// import Style from '../../style'
// import Layer from '../../mapgl/layerslf'
// import SelafinSync from '../../selafinsync'
// import Paint from '../../style/paint.js'
// import Checkbox from '../../checkbox'

import {SelafinSync,Checkbox,DraggableNumber,GradientBtn} from '../index.js';
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
    this.setCumWeight();
    return this;
    
  }
  addToLegend(element){
    if(!this.active)return;
    const array = Object.keys(this.slayer.sattributes).map(key=>this.slayer.sattributes[key]).filter(attribute=>attribute.active);
    if(array.length==0)return;
    const maxzorder =array.reduce((prev, current)=>(prev.zorder > current.zorder) ? prev : current).zorder;
    const newarray =array.filter(sattribute=>sattribute.zorder>=maxzorder);
    newarray.sort((a,b)=>b.zorder-a.zorder)
    const sattribute = newarray[newarray.length-1];
    for(let pid in sattribute.sprograms){
      const sprogram = sattribute.sprograms[pid];
      if(!sprogram.legendactive)continue;
      const sub = element.append('div').style('display','inline-block')
      sub.append("h5").classed('small',true).text(sattribute.title + ", " + sattribute.units)
      const {gradient,minmax,exponent,color,colorbyatt,radius,width}=sprogram.paint;
      new GradientBtn({left:5,gradient:gradient,minmax:minmax,exponent:exponent,callbacks:{}}).render(sub)
    }    
    
    // for(let id in this.slayer.sattributes){
    //   const sattribute = this.slayer.sattributes[id];
    //   if(!sattribute.active)continue;
    //   for(let pid in sattribute.sprograms){
    //     const sprogram = sattribute.sprograms[pid];
    //     if(!sprogram.legendactive)continue;
    //     const sub = element.append('div').style('display','inline-block')
    //     sub.append("h5").classed('small',true).text(sattribute.title)
    //     const {gradient,minmax,exponent,color,colorbyatt,radius,width}=sprogram.paint;
    //     new GradientBtn({left:5,gradient:gradient,minmax:minmax,exponent:exponent,callbacks:{}}).render(sub)
    //   }
    // }
  }
  get subtable(){
    const columns = { 
        active:{title:"",width:"25px",sortable:false,active:true,render:(o)=>{o.row.cb = new Checkbox({title:'',icons:{on:'far fa-eye',off:'far fa-eye-slash'},value:o.data,callback:(value)=>{o.table.data.forEach(_row=>{_row.active=false;_row.cb.setActive(false)});o.row.active=true;o.row.cb.setActive(true);this.mapboxgl.drawScene();if(o.table.callbacks.updateLegend)o.table.callbacks.updateLegend(this)}}).render(o.element)}},
        symbol:{title:"",width:"25px",sortable:false,active:true,render:(o)=>{if(o.table.callbacks.showSymbol)o.table.callbacks.showSymbol(this,o.row,o.element)}},
        paint:{title:"",width:"25px",sortable:false,sortertype:null,active:true,render:(o)=>{o.element.append('i').attr('class','fas fa-palette').on('click',()=>{if(o.table.callbacks.showPaint)o.table.callbacks.showPaint(this,o.row)})}},
        title:{title:"Name",sortertype:'string',active:true,render:(o)=>{o.element.text(o.data)}},
        // zorder:{title:"ZOrder",sortertype:'number',active:true,render:(o)=>{new DraggableNumber({title:'',value:o.data,callback:(value)=>{o.row[o.id]=value;this.mapboxgl.drawScene();if(o.table.callbacks.updateLegend)o.table.callbacks.updateLegend(this)}}).render(o.element)}},
        attactive:{title:"",width:"25px",sortable:false,active:true,render:(o)=>{if(o.row.id!=='quad')new Checkbox({title:'',icons:{on:'fas fa-calculator',off:'fas fa-calculator'},value:o.data,callback:(value)=>{o.row[o.id]=value;this.setCumWeight();if(o.table.callbacks.refreshT)o.table.callbacks.refreshT(this);if(o.table.callbacks.drawScene)o.table.callbacks.drawScene(this)}}).render(o.element)}},
        graph:{title:"",width:"25px",sortable:false,sortertype:null,active:true,render:(o)=>{if(o.row.id!=='quad')o.element.append('i').attr('class','fas fa-chart-line').on('click',()=>{if(o.table.callbacks.showGraph)o.table.callbacks.showGraph(this,o.row)})}},
        w:{title:"",width:"70px",sortable:false,active:true,render:(o)=>{const show = (o.row.attactive || o.row.id=='quad')?true:false;o.row.dnweight=new DraggableNumber({title:"({0}%)".format(Math.round(o.row.weight)),active:show,value:o.data,callback:(value)=>{o.row[o.id]=value;this.setCumWeight();if(o.table.callbacks.drawScene)o.table.callbacks.drawScene(this);}}).render(o.element)}},
        // rweight:{title:"",width:"35px",active:true,render:(o)=>{o.row.domrweight = o.element.text(o.data)}},
        
      
    }
    return {small:true,columns:columns,data:Object.keys(this.attributes).map(key=>this.attributes[key])}
  }
  setCumWeight(){
    
    let cumWeight=0;
    for(let id in this.attributes){
        const attribute = this.attributes[id];
        if(attribute.id==='quad')continue;
        if(attribute.attactive)cumWeight += attribute.w;    
    }
    this.attributes['quad'].w=cumWeight;
    
    if(this.attributes['quad'].dnweight)this.attributes['quad'].dnweight.setValue(cumWeight);
    for(let id in this.attributes){
      const attribute = this.attributes[id];
      attribute.weight =(attribute.attactive || attribute.id=='quad')?attribute.w / cumWeight * 100.0:0.0;
      
      if(attribute.dnweight){
        (attribute.attactive || attribute.id=="quad")?attribute.dnweight.show():
                                                      attribute.dnweight.hide();
        attribute.dnweight.setTitle("({0}%)".format(Math.round(attribute.weight)));
      }
    }
  }

}