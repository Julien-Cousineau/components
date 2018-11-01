import { extend } from '@julien.cousineau/util';
import Table from '../'; 
import TableAtt from './tableatt'; 
const d3 = require('../../../dist/d3.min.js');
// import RowSLF from '../row/slf'
// import Row from '../row/'
export default  class TableLayer extends Table {
  constructor(options){
    options = extend({
            header: `<thead>
            <tr>
                <th>on/off</th>
                <th>Name</th>
                <th>Z-Order</th>
                <th>Attributes</th>
                <th>Search</th>
            </tr>
        </thead>`,
        style: 'table table-bordered',
            data: {},
            isfilterbtn:true,
            issearchbtn:false,
            isshowbtn:true,
            isshowtext:true,
            ispage:true,
         
            
            columns: {
                active:{ title: "on/off", type: 'check',isOn:true, callback: function(id){this.showhide(id)} },
                name:{ title: "Name", type: 'string',isOn:true },
                zorder:{title: "Z-Order", type: 'dn',isOn:true,callback:(id,value)=>{console.log(id,value)} },
                // type:{ title: "Type", type: 'string',isOn:true },
                // properties:{ title: "Properties", type: 'button',icon:'fas fa-cog',isOn:true, callback: function(id){this.showProperties(id)} },
                pop:{title: "Attributes",type:'button',expand:function(element,id){this.createAttTable(element,id)},icons:{open:'fas fa-plus',close:'fas fa-minus'},isOn:true,callback:function(id){this.showAtts(id)}},
                search:{title: "Search",type:'search',icon:'fas fa-cog',isOn:true,callback:function(id,value){this.searchNested(id,value)}},
            },
        },options);
      super(options);
      // this.rows=options.rows || {};
      this.callbacks = options.callbacks || {};
      this.nestedcolor = options.nestedcolor || '#f0f0f0';
      

      
  }
  createAttTable(element,id){
      const dom = d3.select(element.child()[0]).select('td');
      dom.style('background',this.nestedcolor).style('padding',0);
      if(!this.nested[id])this.nested[id] = new TableAtt({id:id,callbacks:this.callbacks,rows:this.rows[id].attributes});
      this.nested[id].render(dom.append('div').style('width','100%'));
      
      
  }
  showhide(id){
    this.rows[id].toggle()
    
    if(this.callbacks.showhideLayer)this.callbacks.showhideLayer(id);
  }
  showProperties(id){
    if(this.callbacks.showLayerProperties)this.callbacks.showLayerProperties(id);
  }
  showAtts(id){
    this.nested[id].show();
    // this.nested[id].table.columns.adjust().draw();
  }
  addLayer(layer){
    this.addRow(layer)
  }
  // addRow(row){
  //   this.rows[row.id]=row;   
  //   super.addRow(row);
  // }
  // render(element){
  //   super.render(element);
  //   // this.refresh();
  // }
  // refresh(){
  //   for(const id in this.rows){
  //     // super.addRow(this.rows[id].row);
  //     super.addRow(this.rows[id]);
  //   }
  // }
  
}