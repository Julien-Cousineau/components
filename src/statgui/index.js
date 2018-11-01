import {SVG,GraphSuit,Checkbox,ButtonColor,Tabs,MyTable} from '../index.js';
import Stack from '../webworker/stack.js';
// import StyleProgram from '../style/styleprogram.js';

export default class StatGUI{
  constructor(options){
      options = options || {};
      if(!options.layer)throw new Error("Must contain layer");
      this.layer = options.layer;
      this.doms = {};
      this.stack = new Stack({type:'sortIndices',callback:this.setData.bind(this)});
      this.callbacks = options.callbacks || {updateData:(rows)=>console.log(rows),showLocation:(o)=>console.log(o)}
  }
  render(element){
    this.element=element;
    this.createTable();
    return this;  
  }  
  createTable(){
    const {layer}=this;
    const columns={};
    for(let id in layer.attributes){
      const attribute = layer.attributes[id];
      // columns['x']={title:"Lng",active:true,render:(o)=>o.element.text(o.data.toFixed(4))};
      // columns['y']={title:"Lat",active:true,render:(o)=>o.element.text(o.data.toFixed(4))};
      columns['x']={title:"",width:'40px',sortable:false,active:true,render:(o)=>o.element.append('i').attr('class','fas fa-bullseye').on('click',()=>{console.log(o.row);if(this.callbacks.showLocation)this.callbacks.showLocation(o.row)})};
      if(attribute.id =='quad' || attribute.attactive)columns[id]={title:attribute.title,active:true,render:(o)=>o.element.text(o.data)};
    }
    this.element.html('');
    this.table =new MyTable({className:'table-scroll',small:true,columns:columns}).render(this.element);
    return this.table;
  }
  updateData(){
    const {layer}=this;
    this.addSpinner();
    const array = layer.attributes['quad'].value;
    
    this.stack.push({id:'myid',array:array,desc:true,slice:[0,1000]});
  }  
  setData(err,obj){
    if(err){this.removeSpinner();return console.warn(err);}
    const {id,payload} = obj;
    const rows = new Array(payload.length);
    for(let i=0;i<payload.length;i++){
      const nodeindex = payload[i];
      const obj={};
      obj['x']=this.layer.geometry.slf.MESHX[nodeindex];
      obj['y']=this.layer.geometry.slf.MESHY[nodeindex];
      for(const id in this.layer.attributes){
        if(this.layer.attributes[id].active || this.layer.attributes[id].attactive){
          obj[id]=this.layer.attributes[id].value[nodeindex];
          
        }
      }
      rows[i]=obj;
    }
    
    this.table.updateData(rows);
    this.removeSpinner();
    if(this.callbacks.updateData)this.callbacks.updateData(rows);
  }
  removeSpinner(){}
  addSpinner(){}

    
}