'use strict';
const $ =require('jquery')
const dt = require('../../dist/datatables.min.js');
import style from './style.scss';
const d3 = require('../../dist/d3.min.js');
import DropdownList from '../dropdownlist'
import DraggableNumber from '../draggablenumber';

export default  class Table {
  constructor(options){
      this.header = options.header || '';
      this.style = options.style || 'table table-striped table-bordered table-responsive table-body';
      this.type = options.type || 'propertycontainer';
      this.columns =options.columns || [{ title: "Name" },{ title: "Position" },{ title: "Office" },{ title: "Extn." },{ title: "Start date" },{ title: "Salary" }];
      // this.data = options.data || [[ "Tiger Nixon", "System Architect", "Edinburgh", "5421", "2011/04/25", "$320,800" ],
      //                             [ "Garrett Winters", "Accountant", "Tokyo", "8422", "2011/07/25", "$170,750" ],
      //                             ];
      this.isfilterbtn = (typeof options.isfilterbtn === 'undefined') ? false : options.isfilterbtn;
      this.hascontainer = (typeof options.hascontainer === 'undefined') ? false : options.hascontainer;
      this.issearchbtn = (typeof options.issearchbtn === 'undefined') ? true : options.issearchbtn;
      this.isshowbtn = (typeof options.isshowbtn === 'undefined') ? true : options.isshowbtn;
      this.isshowtext = (typeof options.isshowtext === 'undefined') ? true : options.isshowtext;
      this.ispage = (typeof options.ispage === 'undefined') ? true : options.ispage;
      this.rowstyle = options.rowstyle || '';
      this.title = options.title || '';
      this.searchtext = options.searchtext || '';
      this.nested = options.nested || {};
      this.rows=options.rows || {};
      
     this.btns = options.btns || null;//{add:{title:'Add',icon:'fas fa-plus',callback:()=>console.log('click add')}}
     
      this.dtcolumns = this.getdtcolumns();
  }
  get data(){return Object.keys(this.rows).map(key=>this.rows[key])}
  render(element){
    this.element=element;
    const {data,dtcolumns,type,header}=this;
    const {hascontainer,title,issearchbtn,isshowbtn,isshowtext,ispage,rowstyle}=this;
    
    const d3dom = this.dom = element.append('div').append('table')
    .style("width",'340px').style("height",'100%')
    .attr("class",'fixed {0} {1}'.format(this.style,this.type))
    
    if(header)$(d3dom.node()).append(header); // Add Header Information
    
    const containerrow =hascontainer?"'container'":''; 
    const row0 = title ? `<'row'<'h5 title'>>`:``;
    const row1 = issearchbtn?`<'container'<'row'<'col-sm-8 table-btn-group'><'col-sm-4'f>>>`:``;
    const row2 = isshowtext?`<'row'<'col-sm-12'i>>`:``;
    const row3 = isshowbtn?`<'row'<'col-sm-5'l><'col-sm-7'p>>`:``;
    
    const dom = "<{2}{0}{1}".format(row0,row1,containerrow) + 
                          "<''<'{0}'tr>>".format(rowstyle) + 
                          "{0}".format(row2) +
                          "{0}>".format(row3)
        
    
    this.table = $(d3dom.node()).DataTable( 
        {
          dom:dom,
            // sScrollX: "100%",
            // sScrollY: "100vh",
            autoWidth: false,
            scrollCollapse: false,
            bAutoWidth: false,
            paging:         false,
            // columnDefs: [{ width: 1, targets: 0 }],
            // "columnDefs": [{ "width": "10px", "targets": 0 }],
            fixedColumns: true,
            data: [],
            columns: dtcolumns,
            language: {search: "",searchPlaceholder:'Search'}
        });
        
    this.wrapper = this.table.table().container();

    this.createtitle();
    this.changePagination();
    this.createbtngroup();
    this.createCallbacks();
    // this.createDoms();
    this.refresh();

   
    
  }
  changePagination(){
    const {table,wrapper} = this;
    $(wrapper).find('.pagination').addClass('pagination-sm');
    table.on('draw',()=> $(wrapper).find('.pagination').addClass('pagination-sm'));    
  }
  remove(){
    if(this.table)this.table.destroy();
    this.element.html('');
  }
  // reload(){
  //   this.element.html('')
  //   if(this.table)this.table.destroy();
  //   this.render(this.element)
    
  // }
  // createDom(row){
  //   const {table,columns}=this;
  //   for(let id in columns){
  //     const {type,callback,expand,icons}=columns[id];
  //       if(type=='dn'){
  //       // TODO - MAKE all dom compnenets like this.
  //       const element = d3.select($(this)[0]);
         
  //         const tr = $(this).closest('.col_{0}'.format(id));
          
  //         const rowid = row.data().id;
  //         if(!columns[id].dns)columns[id].dns={};
  //         const dn = columns[id].dns[rowid] = new DraggableNumber({title:'', value:self.rows[rowid][id],callback:(value)=>{
  //           self.rows[rowid][id]=value;
  //           callback(rowid,value)
  //         }
  //         })  
  //         columns[id].dom = dn.render(element);
  //       }
  //   }
    
  // }
  createDoms(){
    const self=this;
    const {table,columns,elementype,actiontype}=this;
    for(let id in columns){
      const {type,callback,expand,icons}=columns[id];
        if(type=='dn'){
        // TODO - MAKE all dom compnenets like this.
       
        var rows = table.rows().nodes();
        
        $('.col_{0}'.format(id),rows).each(function(){
           
          const element = d3.select($(this)[0]);
         
          const tr = $(this).closest('tr');
          const row = table.row( tr );
          const rowid = row.data().id;
          if(!columns[id].dns)columns[id].dns={};
          if(!columns[id].dns[rowid]){
          const dn = columns[id].dns[rowid] = new DraggableNumber({title:'', value:self.rows[rowid][id],callback:(value)=>{
            self.rows[rowid][id]=value;
            callback(rowid,value)
            }
            })  
            
          }
          columns[id].dom = columns[id].dns[rowid].render(element);
        })
        

       }      
      
    }
    
    
  }
  createCallbacks(){
    const {table,columns,elementype,actiontype}=this;
    const self=this;
 
    for(let id in columns){
       const {type,callback,expand,icons}=columns[id];
       console.log(type)
       if(type=='dn'){
         var rows = table.rows().nodes();
         console.log(rows)
         table.column( '{0}:name'.format(id)).data();
         $('.col_{0}'.format(id)).each(function(){
           
            const element = d3.select($(this)[0]);
            // const tr = $(this).closest('tr');
            const idx = table.cell(this).index()
            const data = table.rows( idx.row ).data();
            console.log(idx,data)
            // const row = table.row( tr );
            // if(!row.data())return;//TODO FIX this, error during nesting
            // const rowid = row.data().id;
            // console.log('here',row)
            // const dn = new DraggableNumber({title:'', value:self.rows[rowid][id],callback:(value)=>{
            //   self.rows[rowid][id]=value;
            //   callback(rowid,value)
            // }
            // }).render(element);  
           
         });
       }
       else{
       
       
        if(callback){
          table.on('{0}'.format(actiontype(type)), '.col_{0} {1}'.format(id,elementype(type)), function () {
            const tr = $(this).closest('tr');
            const row = table.row( tr );
            if(!row.data())return;//TODO FIX this, error during nesting
            const id = row.data().id;
            if(expand){
              const icon = d3.select(this).select('i');
              if ( row.child.isShown() ) {
                icon.attr('class',icons.open)
                row.child.hide();tr.removeClass('shown');
                
              } else {
                icon.attr('class',icons.close)
                const element = row.child('').show();
                expand.bind(self)(element,row.data().id);tr.addClass('shown');
              }
            }
            const value = type=='search'?$(this).val():undefined;
            callback.bind(self)(id,value);
            
         });
        }
      }
    }
  }
  createtitle(){
    const {wrapper,title} = this;
    const titleelement = d3.select($(wrapper).find('.title')[0]);
    titleelement.text(title)
    titleelement.style("position",'relative')
  }
  createbtngroup(){
    const {table,wrapper,isfilterbtn,btns,columns} = this;
    const btngroup = d3.select($(wrapper).find('.table-btn-group')[0])
    for(let id in btns){
      const btn=btns[id];
      const btndom = btngroup.append('button')
      .attr('class','btn btn-secondary btn-xm btn-circle')
      .attr('title',btn.title)
      .on('click',btn.callback)
      btndom.append('i').attr('class',btn.icon)
      
    }
   
    
    if(isfilterbtn){
      
      const copy = JSON.parse(JSON.stringify(columns))
      for(let id in copy){
        
        copy[id].callback=(id,isOn)=>{
        const index = Object.keys(copy).findIndex(key=>key==id)
        let column =table.column(index);
        column.visible(!column.visible());
        }
      }
      const filterbtn  = new DropdownList({
          className:'btn btn-secondary btn-xm',
          title:'Filter',
          values:copy,
          icon:'fas fa-filter'
      });
      filterbtn.render(btngroup)
    }
  }
  search(value){
    this.searchtext = value;
     this.table.search(value).draw();
  }
  searchNested(id,value){
    if(this.nested[id])this.nested[id].search(value);
  }
  actiontype(type){
    if(type=='button')return 'click';
    if(type=='check')return 'input';
    if(type=='search')return 'input';
    return '';
  }
  elementype(type){
    if(type=='button')return 'button';
    if(type=='check')return 'input';
    if(type=='search')return 'input';
    return '';
  }
  getdtcolumns(){
      const {columns}=this;
      return Object.keys(columns).map(id=>{
          const column = columns[id];
          const {type}=column;
          if(type=='string')return {"data":id};
          if(type=='number')return {"data":null,"render":(data,type,full,meta)=>parseFloat(data[id]).toFixed(2)};
          // if(type!=="button" && type!=="check" && type!=="search" && type!=="symbol" && type!=="dn")return {"data":id};
          if(type=='check')return this.checkObj(id);
          if(type=='button')return this.buttonObj(id,column);
          if(type=='search')return this.searchObj(id,column);
          if(type=='symbol')return this.symbolObj(id,column);
          if(type=='dn')return this.draggablenumber(id,column);
        },this);
  }
  draggablenumber(id){
      return {
        className:'col_' + id,
        orderable:true,
        data:null,
        render: ( data, type, full, meta )=>{
          if ( type === "sort" || type === 'type' ){
            return full[id];
          }
          // console.log(this.table.cells(meta.row,meta.column))
          // const something = this.table.cells(meta.row,meta.column)
          // const element = d3.select($(something)[0]);
          // console.log(element)
          // const e = element.append('div').text("HELLO")
          
          return '';
        }
      };    
  }
  checkObj(id){
      return {
        className:'col_' + id,
        orderable:false,
        data:null,
        render: ( data, type, full, meta )=>`
                  <div class="checkbox1">
                    <label>
                      <input  type="checkbox" {0}>
                    </label>
                  </div>`.format((full[id])?'checked':'')
      };
  }
  buttonObj(id,column){
    let icon = column.icons?column.icons.open:column.icon;
    return {
        className:'col_' + id,
        orderable:false,
        data:null,
        defaultContent:`<button type="button" class="btn btn-secondary btn-xm btn-circle">
                            <i class="{0}"></i>
                        </button>`.format(icon)
      };
  }
  searchObj(id,column){
      return {
        className:'col_' + id,
        orderable:false,
        data:null,
        render: ( data, type, full, meta )=>`
                  <div class="search">
                    <label>
                      <input class="form-control form-control-sm" type="text" placeholder="Search">
                    </label>
                  </div>`
      };    
  }
  symbolObj(id,column){
    
    return {
        className:'col_' + id,
        orderable:false,
        data:null,
        render: ( data, type, full, meta )=>`
                  <div class="">
                    {0}
                  </div>`.format(full.symbol)
      };
  }
  show(){
    this.table.draw();
    // this.createDoms();
  }
  addRow(row){
    this.rows[row.id]=row;
    const rowdom = this.table.row.add(row);
    this.table.draw();
    // this.createDoms();
  }
  updateData(data){
    this.rows=data;
    this.refresh();
  }
  refresh(){
    console.log(this.rows)
    this.table.clear().draw();
      if(Array.isArray(this.rows)){
        this.rows.forEach(row=>this.table.row.add(row),this)
      } else {
        for(const id in this.rows){
          this.table.row.add(this.rows[id])
        }
      }
    this.table.draw();
    // this.createDoms();
  }
}

