import { extend } from '@julien.cousineau/util';
import Table from '../../'; 

export default  class TableAtt extends Table {
  constructor(options){
    options = extend({
        header:`<thead>
                <tr>
                <th>on/off</th>
                <th>Name</th>
                <th>Z-Order</th>
                <th>Suitability?</th>
                <th>Weight?</th>
                <th>Properties</th>
            </tr>
        
        </thead>`,
        style:'table-hover',
        // rowstyle:"col-sm-11  offset-sm-1",
        rowstyle:"",
        isfilterbtn:false,
        isshowbtn:false,
        isshowtext:false,
        ispage:false,
        issearchbtn:false,
        btns:{},
        hascontainer:false,
      
        columns:{
            // pop:{title: "title",type:'button',expand:expandhtml,icons:{open:'fas fa-plus-circle',close:'fas fa-minus-circle'},isOn:true,callback:(id)=>console.log('mda',id)},
            active:{title: "on/off",type:'check',isOn:true,callback:function(id){this.showhide(id)}},
            title:{title: "Name",type:'string',isOn:true},
            zorder:{title: "ZOrder",type:'dn',isOn:true,callback:(id,value)=>{this.drawScene()}},
            attactive:{title: "Suitability?",type:'check',isOn:true,callback:function(id){this.showhideatt(id)}},
            weight:{title: "Weight",type:'dn',isOn:true,callback:(id)=>this.setWeight()},
            // type:{title: "Type",type:'string',isOn:true},
            properties:{title: "Properties",type:'button',icon:'fas fa-cog',isOn:true,callback:function(id){this.showProperties(id)}}
        }},options);
      super(options);
      this.id = options.id;
      this.callbacks = options.callbacks || {}
  }
  drawScene(){
     if(this.callbacks.refresh)this.callbacks.refresh()
  }
  showhide(id){
      this.rows[id].active= !this.rows[id].active;
      if(this.callbacks.showhideAttribute)this.callbacks.showhideAttribute(this.id,id)
  }
  setWeight(){
    if(this.callbacks.setWeight)this.callbacks.setWeight(this.id);
    this.drawScene();
  }
  showhideatt(id){
      this.rows[id].attactive= !this.rows[id].attactive;
      if(this.callbacks.setWeight)this.callbacks.setWeight(this.id);
      this.drawScene();
  }  
  showProperties(attid){
    if(this.callbacks.showAttProperties)this.callbacks.showAttProperties(this.id,attid)
  }
  // addRow(row){
  //   this.rows[row.id]=row;    
  //   super.addRow(row.row);
  // }
  // render(element){
  //     super.render(element);
  //     this.refresh();
  // }
  // refresh(){
  //   for(const id in this.rows){
  //     super.addRow(this.rows[id]);
  //   }
  // }
  
}