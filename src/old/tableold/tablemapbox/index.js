import { extend } from '@julien.cousineau/util';
import Table from '../'; 
// import TableAtt from './tableatt'; 
const d3 = require('../../../dist/d3.min.js');
import Row from '../row/'
export default  class TableMapBox extends Table {
  constructor(options){
    options = extend({
            header: `<thead>
            <tr>
                <th>on/off</th>
                <th>Symbol</th>
                <th>Name</th>
                <th>Category</th>
                <th>Properties</th>
            </tr>
        </thead>`,
        style: 'table table-bordered',
            data: {},
            isfilterbtn:false,
            issearchbtn:true,
            isshowbtn:false,
            isshowtext:true,
            ispage:true,
            columns: {
                active:{ title: "on/off", type: 'check',isOn:true, callback: function(id){this.showhide(id)} },
                symbol:{ title: "Symbol", type: 'symbol',isOn:true },
                name:{ title: "Name", type: 'string',isOn:true },
                // type:{ title: "Type", type: 'string',isOn:true },
                category:{ title: "Category", type: 'string',isOn:true },
                properties:{ title: "Properties", type: 'button',icon:'fas fa-cog',isOn:true, callback: function(id){this.showProperties(id)} },
            },
        },options);
      super(options);
      this.rows=options.rows || {};
      this.callbacks = options.callbacks || {};
    //   this.nestedcolor = options.nestedcolor || '#f0f0f0';
      

      
  }
//   createAttTable(element,id){
//       const dom = d3.select(element.child()[0]).select('td');
//       dom.style('background',this.nestedcolor)
//       if(!this.nested[id])this.nested[id] = new TableAtt({id:id,callbacks:this.callbacks,rows:this.rows[id].attributes});
//       this.nested[id].render(dom);
//   }
  showhide(id){
    this.rows[id].toggle()
    
    if(this.callbacks.showhideLayer)this.callbacks.showhideLayer(id);
  }
  showProperties(id){
    if(this.callbacks.showLayerProperties)this.callbacks.showLayerProperties(id);
  }
  showAtts(id){
    // console.log(id)
  }
  addLayer(layer){
    // this.addRow(new Row({_pointer:()=>layer}));
    this.addRow(layer)
  }  
  // addRow(row){
  //   this.rows[row.id]=row;    
  //   super.addRow(row);
  // }
  // render(element){
  //   super.render(element);
  //   this.refresh();
  // }
  // refresh(){
  //   for(const id in this.rows){
  //     // super.addRow(this.rows[id].row);
  //     super.addRow(this.rows[id]);
  //   }
  // }
  
}