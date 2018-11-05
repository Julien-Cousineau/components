import { extend } from '@julien.cousineau/util';
import NavigationPill from '../navigationpill'
import MapBoxGL from '../mapboxgl';
import GeoJSON from '../geojson';
import mapboxgl from 'mapbox-gl';
import {GUILayer,GUIAttribute,StatGUI,MyTable,Checkbox,Tabs,Pill,DragDrop,BarContainer,GUISuit} from '../index.js'
import Legend from './legend.js';

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
                active:{title:"",width:"30px",sortable:false,active:true,render:(o)=>{new Checkbox({title:'',icons:{on:'far fa-eye',off:'far fa-eye-slash'},value:o.data,callback:(value)=>{o.row.toggle();this.tables.model.renderData();}}).render(o.element)}},
                legendSymbol:{title:"",width:"30px",sortable:false,sortertype:null,active:true,render:(o)=>{o.row.slayer.getLegendSymbol(o.element)}},
                name:{title:"Name",sortertype:'string',active:true,render:(o)=>{o.element.text(o.data)}},
                category:{title:"Category",sortertype:'string',active:true,render:(o)=>o.element.text(o.data)},
                download:{title:"",width:"25px",sortable:false,sortertype:null,active:true,render:(o)=>{if(o.row.source.type==='geojson'){o.element.append('i').attr('class','fas fa-download').on('click',()=>{GeoJSON.download(o.row.source.data,o.row.name)})}}},
                properties:{title:"",width:"25px",sortable:false,sortertype:null,active:true,render:(o)=>{o.element.append('i').attr('class','fas fa-info-circle').on('click',async ()=>{new GUILayer({layer:o.row,callbacks:{active:(active)=>{o.row.toggle();this.tables.model.renderData();this.tables.gis.renderData()}}}).render((await this.propertiespill.show()).clear().tabcontent)})}},
                
                
              },
            }),
            
                
            model:new MyTable({
              callbacks:{
                showSymbol:(layer,attribute,element)=>{this.setSubSymbol(layer,attribute,element)},
                showPaint:async (layer,attribute)=>{this.propertiespill.gui = new GUIAttribute({attribute:attribute,callbacks:{changeStyle:()=>{this.drawScene();this.legend.refresh()},changed:async()=>{layer.setCumWeight();this.activeQuad(layer);await this.drawScene();this.updateHotspot(layer);this.legend.refresh()}}}).render((await this.propertiespill.show()).clear().tabcontent)},
                showGraph:async (layer,attribute)=>{this.propertiespill.gui = new GUISuit({attribute:attribute,callbacks:{changed:async()=>{layer.setCumWeight();this.activeQuad(layer);await this.drawScene();this.updateHotspot(layer);this.legend.refresh()}}}).render((await this.propertiespill.show()).clear().tabcontent)},
                refreshT:(layer)=>{this.stats[layer.id].createTable()},
                updateLegend:(layer)=>this.legend.refresh(),
                drawScene:async (layer)=>{this.activeQuad(layer);await this.drawScene();this.updateHotspot(layer)},
              },
              small:true,
              className:'table-scroll',
              columns:{ 
                active:{title:"",width:"30px",sortable:false,active:true,render:(o)=>{new Checkbox({title:'',icons:{on:'far fa-eye',off:'far fa-eye-slash'},value:o.data,callback:(value)=>{o.row[o.id]=value;this.drawScene();}}).render(o.element)}},
                expand:{title:"",width:"25px",sortable:false,sortertype:null,active:true,render:(o)=>{const i=o.element.append('i');(o.row['showdetail'])?i.attr('class','fas fa-minus'):i.attr('class','fas fa-plus');i.on('click',()=>{o.row['showdetail']=!o.row['showdetail'];o.table.renderData()})}},
                name:{title:"Name",sortertype:'string',active:true,render:(o)=>{o.element.text(o.data)}},
                // zorder:{title:"Zorder",sortertype:'number',active:true,render:(o)=>{o.element.text(o.data)}},
                // save:{title:"",width:"25px",sortable:false,sortertype:null,active:true,render:(o)=>{o.element.append('i').attr('class','fas fa-save').on('click',()=>{GeoJSON.download(o.row.slayer.obj,'style');console.log('save')})}},
                properties:{title:"",width:"25px",sortable:false,sortertype:null,active:true,render:(o)=>{o.element.append('i').attr('class','fas fa-info-circle').on('click',async ()=>{new GUILayer({layer:o.row,callbacks:{active:()=>{this.tables.model.renderData();this.tables.gis.renderData();this.drawScene()}}}).render((await this.propertiespill.show()).clear().tabcontent)})}},
                
              } 
            })
        }       
        
        this.tables.gis.render(tab1.doms.content);
        this.tables.model.render(tab2.doms.content);
        this.btabs= new Tabs().render(this.bc.bars.bottom.element);
         this.legend = new Legend().render(bc.content)
        await super.render(bc.content);
       
        if (dragdrop)this.dragdrop = new DragDrop({callback:(obj)=>this.addLayer(this.loadLayer(obj))}).render(this.element);
    }
    async addLayer(id,layer){
      await super.addLayer(id,layer);
      if(layer.constructor.name=='LayerMapBox')this.tables.gis.addData(layer);
        if(layer.constructor.name=='LayerSLF'){
          const tab=this.btabs.addTab(layer.title,{title:layer.title}).show();
        
          this.stats[id]=new StatGUI({layer:layer,callbacks:{updateData:(rows)=>{const geojson=GeoJSON.fromArray(rows);this.layers['hp'+layer.id].source.data=geojson;this.mapbox.getSource('hp'+layer.id).setData(geojson)},showLocation:(o)=>{this.mapbox.flyTo({center: [o['x'],o['y']],zoom:12})}}}).render(tab.doms.content);
          this.updateHotspot(layer);
          this.tables.model.addData(layer);
          
          const obj = {id:'hp'+layer.id,active:true,source:{type: 'geojson',data:GeoJSON.dummy()},slayer:layer.id+'hot'};
          await this.addLayer('hp'+layer.id,this.loadLayer(obj));
           this.mapbox.on('mouseenter', "hp{0}-circle".format(layer.id),(e)=>{this.mapbox.getCanvas().style.cursor = 'pointer'})
           this.mapbox.on('mouseleave', "hp{0}-circle".format(layer.id), (e)=>{this.mapbox.getCanvas().style.cursor = ''})
          await this.drawScene();this.updateHotspot(layer)
          this.legend.add(layer);
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
          let value = feature.properties[attribute.id];
          value=(typeof value==='number')?value.toFixed(2):value;
          html+=`<p>{title}:{value} {units}</p>`.format({title:attribute.title,value:value,units:attribute.sattribute.units})
          
        }
      }
      return html;
    }
    setSubSymbol(layer, attribute,element){
      if(!this.layers[attribute.id])return;
      const gislayer = this.layers[attribute.id];
      gislayer.slayer.getLegendSymbol(element.classed("on",true));
      (gislayer.slayer.active)?element.style('opacity',1.0):element.style('opacity',0.25);
      element.on('click',()=>{
        gislayer.toggle();
        (gislayer.slayer.active)?element.style('opacity',1.0):element.style('opacity',0.25);
        this.tables.gis.renderData()
      });
      
      
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
  activeQuad(layer){layer.attributes['quad'].getProgram('quadmca').active=true;}
}
