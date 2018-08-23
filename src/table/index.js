'use strict';
const $ =require('jquery')
const dt = require('../../dist/datatables.min.js');
import style from './style.scss';
const d3 = require('../../dist/d3.min.js');
import DropdownList from '../dropdownlist'

export default  class Table {
  constructor(options){
      this.header = options.header || '';
      this.type = options.type || 'propertycontainer';
      this.columns =options.columns || [{ title: "Name" },{ title: "Position" },{ title: "Office" },{ title: "Extn." },{ title: "Start date" },{ title: "Salary" }];
      this.data = options.data || [[ "Tiger Nixon", "System Architect", "Edinburgh", "5421", "2011/04/25", "$320,800" ],
                                   [ "Garrett Winters", "Accountant", "Tokyo", "8422", "2011/07/25", "$170,750" ],
                                  ];
      this.isfilterbtn = (typeof options.isfilterbtn === 'undefined') ? false : options.isfilterbtn;
     this.btns = options.btns || {
      add:{title:'Add',icon:'fas fa-plus-circle',callback:()=>console.log('click add')}
     }
     
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
          dom:"<'container'<'row'<'col-sm-8 table-btn-group'><'col-sm-4'f>>" + 
                          "<'row'<'col-sm-12'tr>>" + 
                          "<'row'<'col-sm-12'i>>" +
                          "<'row'<'col-sm-5'l><'col-sm-7'p>>>",
            sScrollX: "100%",
            sScrollY: "100%",
            data: data,
            columns: dtcolumns,
            language: {search: "",searchPlaceholder:'Search'}
        });
        
    this.wrapper = this.table.table().container();

    this.changePagination();
    this.createbtngroup();
    this.createCallbacks();
   
    
  }
  changePagination(){
    const {table,wrapper} = this;
    $(wrapper).find('.pagination').addClass('pagination-sm');
    table.on('draw',()=> $(wrapper).find('.pagination').addClass('pagination-sm'));    
  }
  createCallbacks(){
    const {table,columns,elementype}=this;
    for(let id in columns){
       const {type,callback}=columns[id];
      if(callback){
        table.on('click', '.col_{0} {1}'.format(id,elementype(type)), function () {
          const tr = $(this).closest('tr');
          const row = table.row( tr );
          const id = row.data().id;
          callback(id);
       });
      }
    }
  }
  createbtngroup(){
    const {table,wrapper,isfilterbtn,btns,columns} = this;
    const btngroup = d3.select($(wrapper).find('.table-btn-group')[0])
    for(let id in btns){
      const btn=btns[id];
      const btndom = btngroup.append('button')
      .attr('class','btn btn-primary btn-sm')
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
          className:'btn btn-primary btn-sm',
          title:'Filter',
          values:copy,
          icon:'fas fa-filter'
      });
      filterbtn.render(btngroup)
    }
  }
  
  
  elementype(type){
    if(type=='popover')return 'button';
    if(type=='check')return 'input';
    return '';
  }
  getdtcolumns(){
      const {columns}=this;
      return Object.keys(columns).map(id=>{
          const column = columns[id];
          const {type}=column;
          if(type!=="popover" && type!=="check")return {"data":id};
          if(type=='check')return this.checkObj(id);
          if(type=='popover')return this.popoverObj(id);
        },this);
  }
  checkObj(id){
      return {
        className:'col_' + id,
        orderable:false,
        data:null,
        render: ( data, type, full, meta )=>`
                  <div class="checkbox1">
                    <label>
                      <input type="checkbox" {0}>
                    </label>
                  </div>`.format((full[id])?'checked':'')
      };
  }
  popoverObj(id){
    return {
        className:'col_' + id,
        orderable:false,
        data:null,
        defaultContent:`<button type="button" class="btn-circle btn-primary">
                            <i class="fas fa-cog"></i>
                        </button>`
      };
  }
  addRow(row){
    this.table.row.add(row);
    this.table.draw();
  }
}

