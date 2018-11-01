import { extend } from '@julien.cousineau/util';
import NavigationPill from '../navigationpill'
import MapBoxGL from '../mapboxgl';
import GeoJSON from '../geojson';
import mapboxgl from 'mapbox-gl';
import {GUILayer,GUIAttribute,StatGUI,MyTable,Checkbox,Tabs,Pill,DragDrop,BarContainer} from '../index.js'


export default class MapLayer extends MapBoxGL {
    constructor(options) {
        super(options)
        this.activeAttribute=null;
        this.dragdrop = (typeof options.dragdrop == 'undefined') ? true : options.dragdrop;
        this.stats = {};

       this.bc= new BarContainer({
        bars:{
            top:{isOn:false,priority:1,size:0,shadow:5},
            bottom:{isOn:true,priority:0,size:150.0,padding:{top:0,bottom:0,left:0,right:0},shadow:5},
            left:{isOn:true,priority:1,size:400,padding:{top:0,bottom:0,left:0,right:0},shadow:5},
            right:{isOn:false,priority:0,size:0.0}}
        });


       

    }
    async render(parent) {
        this.parent = parent;
        const { dragdrop,bc } = this;
        this.bc.render(parent);
        const tabs =this.tabs= new Tabs();
  
        
        const layers     = new Pill({id:"Layers",active:true,ishorizontal:true,content:tabs,callbacks:{click:()=>{this.tables.model.renderData();this.tables.gis.renderData()}}}); 
        const properties = this.propertiespill = new Pill({id:"Properties",active:false,ishorizontal:true,callbacks:{click:()=>{if(this.propertiespill.gui)this.propertiespill.gui.refresh()}}}); 
        const np         = this.np =  new NavigationPill({ishorizontal:true,pills:{layers:layers,properties:properties}}).render(this.bc.bars.left.element);
        
        const tab1= tabs.addTab('gis',{active:true,title:'GIS'});
        const tab2= tabs.addTab('model',{active:false,title:'Model',callbacks:{}});

        this.tables = {
            gis:new MyTable({
              // callbacks:{showLayer:(layer)=>console.log("showLayer",layer)},
              small:true,
              className:'table-scroll',
              columns:{ 
                active:{title:"",width:"30px",sortable:false,active:true,render:(o)=>{new Checkbox({title:'',value:o.data,callback:(value)=>{o.row.toggle()}}).render(o.element)}},
                legendSymbol:{title:"",width:"30px",sortable:false,sortertype:null,active:true,render:(o)=>{o.row.slayer.getLegendSymbol(o.element)}},
                name:{title:"Name",sortertype:'string',active:true,render:(o)=>{o.element.text(o.data)}},
                category:{title:"Category",sortertype:'string',active:true,render:(o)=>o.element.text(o.data)},
                properties:{title:"",width:"25px",sortable:false,sortertype:null,active:true,render:(o)=>{o.element.append('i').attr('class','fas fa-cog').on('click',()=>{new GUILayer({layer:()=>o.row,callbacks:{active:(active)=>{o.row.toggle();this.tables.model.renderData();this.tables.gis.renderData()}}}).render(this.propertiespill.show().clear().tabcontent)})}},
                download:{title:"",width:"25px",sortable:false,sortertype:null,active:true,render:(o)=>{o.element.append('i').attr('class','fas fa-download').on('click',()=>{GeoJSON.download(o.row.source.data,o.row.name)})}},
                
              },
            }),
            
                
            model:new MyTable({
              callbacks:{
                showAttribute:(layer,attribute)=>{this.propertiespill.gui = new GUIAttribute({attribute:attribute,callbacks:{changed:async()=>{layer.setCumWeight();await this.drawScene();this.updateHotspot(layer)}}}).render(this.propertiespill.show().clear().tabcontent)},
                refreshT:(layer)=>{this.stats[layer.id].createTable()},
                drawScene:async (layer)=>{await this.drawScene();this.updateHotspot(layer)},
              },
              small:true,
              className:'table-scroll',
              columns:{ 
                active:{title:"",width:"30px",sortable:false,active:true,render:(o)=>{new Checkbox({title:'',value:o.data,callback:(value)=>{o.row[o.id]=value;this.drawScene();}}).render(o.element)}},
                name:{title:"Name",sortertype:'string',active:true,render:(o)=>{o.element.text(o.data)}},
                zorder:{title:"Zorder",sortertype:'number',active:true,render:(o)=>{o.element.text(o.data)}},
                save:{title:"",width:"25px",sortable:false,sortertype:null,active:true,render:(o)=>{o.element.append('i').attr('class','fas fa-save').on('click',()=>{GeoJSON.download(o.row.slayer.obj,'style');console.log('save')})}},
                properties:{title:"",width:"25px",sortable:false,sortertype:null,active:true,render:(o)=>{o.element.append('i').attr('class','fas fa-cog').on('click',()=>{new GUILayer({layer:o.row,callbacks:{active:()=>{this.tables.model.renderData();this.tables.gis.renderData();this.drawScene()}}}).render(this.propertiespill.show().clear().tabcontent)})}},
                expand:{title:"",width:"25px",sortable:false,sortertype:null,active:true,render:(o)=>{o.element.append('i').attr('class','fas fa-plus').on('click',()=>{o.row['showdetail']=!o.row['showdetail'];o.table.renderData()})}},
              } 
            })
        }       
        
        this.tables.gis.render(tab1.doms.content);
        this.tables.model.render(tab2.doms.content);
        this.btabs= new Tabs().render(this.bc.bars.bottom.element);
        
        await super.render(bc.content);
        if (dragdrop)this.dragdrop = new DragDrop({callback:(obj)=>this.addLayer(this.loadLayer(obj))}).render(this.element);
    }
    async addLayer(id,layer){
      await super.addLayer(id,layer);
      if(layer.constructor.name=='LayerMapBox')this.tables.gis.addData(layer);
        if(layer.constructor.name=='LayerSLF'){
          const tab=this.btabs.addTab(layer.title,{title:layer.title}).show();
          this.stats[id]=new StatGUI({layer:layer,callbacks:{updateData:(rows)=>{const geojson=GeoJSON.fromArray(rows);this.layers['hp'+layer.id].source.data=geojson;this.mapbox.getSource('hp'+layer.id).setData(geojson)},showLocation:(o)=>{this.mapbox.flyTo({center: [o['x'],o['y']],zoom:10})}}}).render(tab.doms.content);
          this.updateHotspot(layer);
          this.tables.model.addData(layer);
          
          const obj = {id:'hp'+layer.id,active:true,source:{type: 'geojson',data:GeoJSON.dummy()},slayer:layer.id+'hot'};
          await this.addLayer('hp'+layer.id,this.loadLayer(obj));
          await this.drawScene();this.updateHotspot(layer)
          
        }
        return layer;
    }
    popuphtml(feature){
      if(!(this.layers[feature.source.substring(2,feature.source.length)]))return 'Sample';//super.popuphtml(layer);
      const layer = this.layers[feature.source.substring(2,feature.source.length)];
      let html='<h4>Summary</h4>';
      for(let id in layer.attributes){
        const attribute = layer.attributes[id];
        if(attribute.id =='quad' || attribute.attactive){
          html+=`<p>{title}:{value}</p>`.format({title:attribute.title,value:feature.properties[attribute.id]})
          
        }
      }
      return html;
    }
  loadEvents(){
    
    this.mapbox.on('click', (e)=>{
      
      var features = this.mapbox.queryRenderedFeatures(e.point);
      const feature = this.findFeature(features);
      if(!feature)return;
      
      new mapboxgl.Popup()
      .setLngLat(e.lngLat)
      .setHTML(this.popuphtml(feature))
      .addTo(this.mapbox);
      return e;
      
    });
  }
  findFeature(features){
    if(!features)return;
    const keys = Object.keys(this.layers);
    return features.find(feature=>keys.some((key)=>key===feature.source));
  }
    updateHotspot(layer){this.stats[layer.id].updateData()}
}
