'use strict';
const $ =require('jquery')
const dt = require('../../dist/datatables.min.js');
import style from './style.scss';

export default  class Table {
  constructor(options){
      this.header = options.header || '';
      this.type = options.type || 'propertycontainer';
      this.columns =options.columns || [{ title: "Name" },{ title: "Position" },{ title: "Office" },{ title: "Extn." },{ title: "Start date" },{ title: "Salary" }];
      this.data = options.data || [[ "Tiger Nixon", "System Architect", "Edinburgh", "5421", "2011/04/25", "$320,800" ],
                                   [ "Garrett Winters", "Accountant", "Tokyo", "8422", "2011/07/25", "$170,750" ],
                                  ];
     
      this.dtcolumns = this.getdtcolumns();
  }
  render(element){
     const {data,dtcolumns,type,header}=this;
    const d3dom = this.dom = element.append('table')
    .style("width",'100%').style("height",'100%')
    .attr("class",'table table-striped table-bordered ' + type)
    
    $(d3dom.node()).append(header); // Add Header Information
    
    this.table = $(d3dom.node()).DataTable( 
        {
            sScrollX: "100%",
            sScrollY: "100%",
            data: data,
            columns: dtcolumns,
        });
        
    this.wrapper = this.table.table().container();

    this.changePagination();
    this.createCallbacks();
   
    
  }
  changePagination(){
    const {table,wrapper} = this;
    $(wrapper).find('.pagination').addClass('pagination-sm');
    table.on('draw',()=> $(wrapper).find('.pagination').addClass('pagination-sm'));    
  }
  createCallbacks(){
    const {table,columns,elementype}=this;
    columns.forEach(column=>{
      const {name,type,callback}=column;
      if(callback){
        table.on('click', '.col_{0} {1}'.format(name,elementype(type)), function () {
          const tr = $(this).closest('tr');
          const row = table.row( tr );
          const id = row.data().id;
          callback(id);
       });
      }
    },this);
    
  }
  elementype(type){
    if(type=='popover')return 'button';
    if(type=='check')return 'input';
    return '';
  }
  getdtcolumns(){
      const {columns}=this;
      return columns.map(column=>{
          const {name,type}=column;
          if(type!=="popover" && type!=="check")return {"data":name};
          if(type=='check')return this.checkObj(column);
          if(type=='popover')return this.popoverObj(column);
        },this);
  }
  checkObj(column){
    const {name}=column;
      return {
        className:'col_' + name,
        orderable:false,
        data:null,
        render: ( data, type, full, meta )=>`
                  <div class="checkbox1">
                    <label>
                      <input type="checkbox" {0}>
                    </label>
                  </div>`.format((full[name])?'checked':'')
      };
  }
  popoverObj(column){
    const {name}=column;
    return {
        className:'col_' + name,
        orderable:false,
        data:null,
        defaultContent:`<button type="button" class="btn-circle btn-primary">
                            <i class="fas fa-cog"></i>
                        </button>`
      };
  }  
}

