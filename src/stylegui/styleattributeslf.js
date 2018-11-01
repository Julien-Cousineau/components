import {SVG,GraphSuit,Checkbox,ButtonColor,DraggableNumber,Tabs,StyleGUIProgram,WebWorker,Table} from '../index.js';
import GUIAttribute from './attribute.js';

export default class StyleGUIAttributeSLF extends GUIAttribute {
  constructor(options){
    options = options || {};
    options._sattribute='dummy';
    super(options);
    if(!options._attribute)throw new Error("StyleGUIAttributeSLF needs an attribute pointer");
    this._attribute = options._attribute;
    this.webworker = new WebWorker({type:'operations'})
  }
  
  get attribute(){return this._attribute()}
  get sattribute(){return this.attribute.sattribute}
  get layer(){return this.attribute.layer}
  get attributes(){return this.layer.attributes}
  get value(){return this.attribute.value}
  async getRows(){
    const topIndices = await this.webworker.get({id:'sort',array:this.value});
    const rows = new Array(topIndices.length);
    for(let i=0;i<topIndices.length;i++){
      const nodeindex = topIndices[i];
      const obj={};
      obj['x']=this.attribute.geometry.slf.MESHX[nodeindex];
      obj['y']=this.attribute.geometry.slf.MESHY[nodeindex];
      for(let id in this.attributes){
        if(this.attributes[id].active || this.attributes[id].attactive)obj[id]=this.attributes[id].value[nodeindex];
      }
      rows[i]=obj;
    }
    return rows;
    
    
  }
  getColumns(){
    let header='';
    const columns={};
    for(let id in this.attributes){
      const attribute = this.attributes[id];
      if(attribute.active || attribute.attactive){
        columns[id]={title:attribute.title,type:'number',isOn:true};
        header =header+"<th>{0}</th>".format(attribute.title)
      }
    }
    return [header,columns];
  }
  async render(element){
    super.render(element);
    const tab= this.tabs.addTab('statistics',{active:false,title:'Statistics',callbacks:{active:()=>this.table.table.columns.adjust().draw()}});
    const rows = await this.getRows();
    
    const [header,col]=this.getColumns()
    const callback = this.callbacks.newgeojson?()=>this.callbacks.newgeojson(this.attribute,rows): null;
    this.table = new Table({
    header:`<thead>
            <tr>{0}</tr>
        </thead>`.format(header),
    isfilterbtn:true,
    style: 'table table-bordered',
    btns:{add:{title:'Create GeoJSON',icon:'fas fa-plus',callback:callback}},
    rows:rows,
    columns:col
    });
    this.table.render(tab.doms.content.append('div'))
    this.table.refresh();
    // const container = tab.doms.content.append('div').attr('class','container-fluid')
    // this.attActive.render(container.append('div').attr('class','row').append('div').attr('class','col-sm-12'))
    // this.weight.render(container.append('div').attr('class','row').append('div').attr('class','col-sm-12'))
  }
 
}