import Popover from '../popover';

// import Tables from '../tables';
import Tabs from '../tabs';
import MapBoxGL from '../mapboxgl';
import DragDrop from '../dragdrop';
// import LayerProperty from '../layerproperty';
import PropertyAttribute from './propertyattribute';
import PropertyLayer from './propertylayer';
import Style from '../style'


import Modal from '../modal';
import { extend } from '@julien.cousineau/util';
const d3 = require('../../dist/d3.min.js');
import TableLayer from '../table/tablelayer';
export default class MapLayer extends MapBoxGL {
    constructor(options) {
        super(options)
        this.dragdrop = (typeof options.dragdrop == 'undefined') ? true : options.dragdrop;
        
        
        this.styles = options.styles || {
            default: new Style()
        }

        // const datamodal = this.datamodal = new Modal({
        //     title:'MyModal',
        //     body:this.createTable()
        // })

        const popover = this.popover = new Popover({
            // isheader:false,
            title: "Data",
            width: 400,
            height: 400,
        });


        const self = this;
        
        // this.lp = new PropertyAttribute({
        //      _layers:()=>self.layers,
        //     // activeid:'layer3',
        //     title: "Layer",
        //     width: 400,
        //     height: 400,
        //  setRStyle:(style)=>console.log('callback answer=',style),
        //   setActive:(value)=>console.log('callback answer=',value),
        //   changePointSize:(size)=>console.log('callback answer=',size),
        //   changeLineSize:(size)=>console.log('callback answer=',size),
        //   changeIsoSize:(size)=>console.log('callback answer=',size),
        // })
        
        // this.lp = new PropertyLayer({
        //      _layers:()=>self.layers,
        //     // activeid:'layer3',
        //     title: "Layer",
        //     width: 400,
        //     height: 400,
        //  setRStyle:(style)=>console.log('callback answer=',style),
        //   setActive:(value)=>console.log('callback answer=',value),
        //   changePointSize:(size)=>console.log('callback answer=',size),
        //   changeLineSize:(size)=>console.log('callback answer=',size),
        //   changeIsoSize:(size)=>console.log('callback answer=',size),
        // })

        const callbacks = {
            showhideLayer:function(layerid){self.showhideLayer(layerid)},
            showhideAttribute:function(layerid,attributeid){self.showhideAttribute(layerid,attributeid)},
            showhideProgram:function(layerid,attributeid,programid){self.showhideProgram(layerid,attributeid,programid)},
            showLayerProperties:function(id){console.log("showPropertiesid -",id)},
            showAttProperties:function(layerid,attid){self.pa.show(layerid,attid)},
            setGradient:function(layerid,attributeid,programid,gradient){self.setGradient(layerid,attributeid,programid,gradient)}
        }        
        
        // this.pa = new PropertyAttribute({
        //      _layers:()=>self.layers,
        //     // activeid:'layer3',
        //     title: "Layer",
        //     width: 400,
        //     height: 400,
        //     callbacks:null,
        // })
  
        
        // this.table = this.createTable({ isfilterbtn:true})
        // this.tidetable = this.createTable({isfilterbtn:false})
        // this.wavetable = this.createTable({isfilterbtn:false})
        // this.rivertable = this.createTable({isfilterbtn:false})
        

        
        
        this.tables = {
            gis: new TableLayer({callbacks:callbacks})
            // gis:this.createTable({ isfilterbtn:true}),
            // tide:this.createTables(),
            // wave:this.createTables(),
            // river:this.createTables(),
        }



    }
    render(parent) {
        
        super.render(parent);
        const { dragdrop } = this;
        this.parent = parent;
        const popovercontent = this.popover.render(parent);
        
        
        
        
        const tabs =this.tabs= new Tabs({
                tabs:{
                  gis:{title:'GIS',active:true,content:this.tables.gis},
                //   tide:{title:'Tide',active:false,content:this.tables.tide},
                //   wave:{title:'Wave',active:false,content:this.tables.wave},
                //   river:{title:'River',active:false,content:this.tables.river},
                }
            });
        tabs.render(popovercontent);
        
        // this.datamodal.render();
        

        // this.table.render(popovercontent);
        if (dragdrop) this.addDragDrop();

        // this.pa.render(parent);

    }
    loadLayers(isFirst){
        super.loadLayers(isFirst);
        const {layers,tables} = this;
        if(isFirst)Object.keys(layers).forEach((key) =>{
            const layer = layers[key];
            const group = layer.group 
            if(!tables[group])throw new Error("{0} does not exist".format(key))
            tables[group].addLayerSLF(layer);
        });
        
    }
    addLayer(name,type,data) {
        // if(type=="geoson" || type=="tile"){
        //     const layer = new LayerMapbox({id:name,name:name,isOn:true,source:{ type: type, data: data }})
        //     super.addLayer(layer);
        //     return this.tables.gis.addRow(layer.row);
        // }
        // const layer =new LayerSLF({id:name,name:name,isOn:true,source:{ type: type, data: data }});
        // this.tables.gis.addRow(layer.row);
    }
    addDragDrop() {
        const self = this;
        const dragdrop = this.dragdrop = new DragDrop({
            callback:(name,type,data)=>self.addLayer(name,type,data)
        });
        dragdrop.render(this.element);
    }

    refresh(id) {
        this.layers[id].checkshowhide();
        
        // this.layers[id].getsublayers(this.layers[id].type).forEach(layerid => super.showhideMapboxGL(id + "-" + layerid, false))
        // if (this.layers[id].isOn) {
            // this.layers[id].getOnmapboxlayers().forEach(layerid => super.showhideMapboxGL(id + "-" + layerid, true))
        // }
    }
//     createNestedTable(){
//         const data = {};
//         return new Table({
//         header:`<thead></thead>`,
//         style:'table-hover table-dark',
//         isfilterbtn:false,
//         isshowbtn:false,
//         isshowtext:false,
//         ispage:false,
//         issearchbtn:false,
//         btns:{},
//         hascontainer:false,
//         data:data,
//         columns:{
//             // pop:{title: "title",type:'button',expand:expandhtml,icons:{open:'fas fa-plus-circle',close:'fas fa-minus-circle'},isOn:true,callback:(id)=>console.log('mda',id)},
//             isOn:{title: "on/off",type:'check',isOn:true,callback:(id)=>{const index=data.findIndex(e=>e.id==id);data[index].isOnGIS=!data[index].isOnGIS;console.log('gis',data)}},
//             name:{title: "Name",type:'string',isOn:true},
//             // type:{title: "Type",type:'string',isOn:true},
//             properties:{title: "Properties",type:'button',icon:'fas fa-cog',isOn:true,callback:(id)=>console.log(this,'gis',id)},
    
            
//         }
    
        
//     });
// }
    // createTable(options){
    //     const self=this;
    //     const expandhtml= function(element,data){
    //         console.log(this)
    //         const dom = d3.select(element.child()[0]).select('td');
    //         this.nested[data.id].render(dom)
    //     }
       
    //     return new Table(extend({
    //         header: `<thead>
    //         <tr>
    //             <th>Name</th>
    //             <th>on/off</th>
    //             <th>Type</th>
    //             <th>Properties</th>
    //             <th>Attributes</th>
    //             <th>Search</th>
    //         </tr>
    //     </thead>`,
    //     style: 'table table-bordered',
    //         data: {},
    //         isfilterbtn:true,
    //         issearchbtn:true,
    //         isshowbtn:true,
    //         isshowtext:true,
    //         ispage:true,
    //         columns: {
    //             name:{ title: "Name", type: 'string',isOn:true },
    //             isOn:{ title: "on/off", type: 'check',isOn:true, callback: (id) => self.showhideLayer(id) },
    //             type:{ title: "Type", type: 'string',isOn:true },
    //             properties:{ title: "Properties", type: 'button',icon:'fas fa-cog',isOn:true, callback: (id) => self.lp.show(id) },
    //             pop:{title: "Attributes",type:'button',expand:expandhtml,icons:{open:'fas fa-plus-circle',close:'fas fa-minus-circle'},isOn:true,callback:(id)=>console.log('mda',id)},
    //             search:{title: "Search",type:'search',icon:'fas fa-cog',isOn:true,callback:function(id,value){this.searchNested(id,value)}},
    //         },
    //         btns:{ 
    //             // add:{title:'Add',icon:'fas fa-plus-circle',callback:()=>{console.log('add');self.datamodal.show()}}
    //         }


    //     },options));
        
    // }
    // createTables(options){
    //     const self=this;
    //     return new Tables({tables:{
    //         mca:this.createTable({title:'MCA',isfilterbtn:false,issearchbtn:false,isshowbtn:false,isshowtext:false,ispage:false}),
    //         proximity:this.createTable({title:'Proximity',isfilterbtn:false})
    //     }})
       
    // }    


}
