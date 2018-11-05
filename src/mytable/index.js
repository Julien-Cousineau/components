import style from './style.scss';
import Checkbox from '../checkbox'
const {extend} = require('@julien.cousineau/util');

class Column{
    constructor(options){
      this.id = options.id;
        this.title = options.title || '';
        this.sortable = (typeof options.sortable==='undefined')?true:options.sortable;
        this.width = options.width || null;
        this.active = (typeof options.active==='undefined')?true:options.active;
        // this.hasdetail = (typeof options.hasdetail==='undefined')?false:options.hasdetail;
        this.render = options.render || ((o)=>{o.element.text(o.data)});
        this.sortertype = (typeof options.sortertype==='undefined')?'number':options.sortertype;
        
    }
    sorter(){
      const {id}=this;
      const sorters = {
        nodata:(a,b)=>0,
        number:(a,b)=>b[id]-a[id],
        string:(a, b)=>{let x = a[id].toLowerCase();
                        let y = b[id].toLowerCase();
                        if (x < y)return -1;
                        if (x > y)return 1;
                        return 0;
                        },
      };
      if(!this.sortertype)return sorters['nodata'];
      if(sorters[this.sortertype])return sorters[this.sortertype];
      return sorters['number'];
    }

}

class Sorter{
    constructor(callback){
        this.asc=true;
        this.callback=callback;
    }
    render(element){
        const icon = element.append('i')
        .attr('class','sortcol fa fa-sort float-left')
        .attr('aria-hidden','true')
        .on('click',()=>{this.asc=!this.asc;this.callback(this.asc)})
    }
}
export default class MyTable{
    constructor(options){
      options=options||{};
      this.small = options.small ||null;
      this.className = options.className || '';
      this.data=options.data || [];
      this.callbacks = options.callbacks || {};
      const columns= options.columns || {};
      this.columns={};
      for(let id in columns)this.addColumn(id,columns[id]);
      
    }
    addColumn(id,obj){this.columns[id]=new Column(extend({id:id},obj))}
    render(element){
      const table = element.append('div').attr('class','table-responsive').append('table')
                           .classed('mytable', true)
                           .classed('table', true);
      if(this.small)table.classed('table-sm', true);
      const thead = this.renderHeader(table);
      this.tbody = this.renderBody(table);
      this.renderData();
      return this;
    }
    renderBody(element){return element.append('tbody').attr('class',this.className)}
    renderTH(element){return element.append('th').attr('class',this.className).classed('small',this.small)}
    renderTR(element){return element.append('tr').attr('class',this.className)}
    renderTD(element){return element.append('td').classed('small',this.small).classed('text-truncate',true)}
    renderData(){
        const {tbody,data,columns}=this;
        this.tbody.html("");
        // const array = (Array.isArray(data))?data:Object.keys(data).map(key=>data[key]);
        data.forEach(row=>{
            const tr=this.renderTR(tbody);
            for(const id in columns){
                const column = columns[id];
                if(column.active)column.render({table:this,element:this.renderTD(tr).style('width',column.width),row:row,id:id,data:(typeof row[id]==='undefined')?'':row[id]});
            }
            if(row.showdetail){
              const tr=this.renderTR(tbody);
              const td=this.renderTD(tr).attr('colspan',Object.keys(columns).length).attr('class','p-3 box-shadow');
              
              const table  = new MyTable(row.subtable).setCallbacks(this.callbacks).render(td);
            }
        },this);
    }
    renderHeader(element){
        const {columns}=this;
        const thead = element.append('thead');
        for(const id in columns){
            const column=columns[id];
            if(column.active){
              const th = this.renderTH(thead);
              th.append("p").attr('class','m-0 float-left').text(column.title);
              if(column.width)th.style('width',column.width);
              if(column.sortable)new Sorter((asc)=>{this.sort(id,asc)}).render(th);  
            }
            
        }
    }

    sort(id,asc){
      const {data,columns}=this;
      // const array = (Array.isArray(data))?data:Object.keys(data).map(key=>data[key]);
      data.sort(columns[id].sorter());
      if(!asc)data.reverse();
      this.renderData();
    }
    addData(row){
      this.data.push(row);
      this.renderData();
    }
    updateData(data){
      this.data=data;
      this.renderData();
    }
    setCallbacks(callbacks){
      this.callbacks=callbacks;
      return this;
    }
    
}