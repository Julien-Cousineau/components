'use strict';
import {Table,Parent,LContainer,Popover} from '../src/index.js';
const d3 = require('../dist/d3.min.js');
// const lcontainer = LContainer(Parent,300,200,0);

const rows = {
        '0':{id:0,name:'item1',type:'point',isOn:true,active:false,zorder:0},
        '1':{id:1,name:'item2',type:'line',isOn:false,active:false,zorder:0},
        };

const po1 = new Popover({
    // isheader:false,
    title:"Data",
     width:400,
     height:400,
});
const content= po1.render(Parent);
const expandhtml = (table,element,data)=>{
    console.log()
    const dom = d3.select(element.child()[0]).select('td');
    // const dom = d3.select(element[0])
    table.nested[data.id] = createTable2();
    table.nested[data.id].render(dom)
}

const createTable=function(){
    return new Table({
    header:`<thead>
            <tr>
                <th>on/off</th>
                <th>Name</th>
                <th>Type</th>
                <th>zindex</th>
                <th>Properties</th>
                <th>Attributes</th>
                <th>Search Attributes</th>
            </tr>
        </thead>`,
    isfilterbtn:true,
    style: 'table table-bordered',
    rows:rows,
    columns:{
        isOn:{title: "on/off",type:'check',isOn:true,callback:(id)=>{rows[id].isOnGIS=!rows[id].isOnGIS;console.log('gis',rows[id])}},
        name:{title: "Name",type:'string',isOn:true},
        type:{title: "Type",type:'string',isOn:true},
        zorder:{title: "Zindex",type:'dn',isOn:true,callback:(id,value)=>{console.log(id,value)}},
        properties:{title: "Properties",type:'button',icon:'fas fa-cog',isOn:true,callback:(id)=>console.log('gis',id)},
        pop:{title: "Attributes",type:'button',expand:expandhtml,icons:{open:'fas fa-plus-circle',close:'fas fa-minus-circle'},isOn:true,callback:(id)=>console.log('mda',id)},
        search:{title: "Search",type:'search',icon:'fas fa-cog',isOn:true,callback:function(id,value){this.searchNested(id,value)}},

        
    }

    
});
}
const t1  = createTable();
const createTable2=function(){
    // const search=(value)=>{
    //     table.searh(value)
    // }
    
    return new Table({
    header:`<thead></thead>`,
    style:'table-hover table-dark',
    isfilterbtn:false,
    isshowbtn:false,
    isshowtext:false,
    ispage:false,
    issearchbtn:false,
    btns:{},
    hascontainer:false,
    rows:rows,
    columns:{
        // pop:{title: "title",type:'button',expand:expandhtml,icons:{open:'fas fa-plus-circle',close:'fas fa-minus-circle'},isOn:true,callback:(id)=>console.log('mda',id)},
        isOn:{title: "on/off",type:'check',isOn:true,callback:(id)=>{rows[id].isOnGIS=!rows[id].isOnGIS;console.log('gis',rows[id])}},
        name:{title: "Name",type:'string',isOn:true},
        // type:{title: "Type",type:'string',isOn:true},
        properties:{title: "Properties",type:'button',icon:'fas fa-cog',isOn:true,callback:(id)=>console.log(t1,'gis',id)},

        
    }

    
});
}




t1.render(content);