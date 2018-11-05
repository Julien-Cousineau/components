import * as turf from '@turf/turf'
// import Style from '../../style'
// import Layer from '../layer'
// import Fetch from '../../fetch'
// import to from '../../to'
// import StyleCatalog from  '../../stylecatalog';
import {StyleCatalog,to,Fetch} from '../index.js';
import {extend} from '@julien.cousineau/util';
export default  class LayerMapBox {
  constructor(options){
    // super(options)
      if(!options)options={}
      this._mapbox = options._mapbox
      this._parent = options._parent||null;
      const id = this.id = options.id || 'myid'
      // this.name = this.id
      this.slayer = options.slayer || null;
      this.programid = options.programid || null;
      this.layertype = "mapbox";
      
      
      
      // const images = this.images = options.images || {};
      
      // const sourcelayer = this.sourcelayer = options.sourcelayer || null;
      // const sourceid = this.sourceid = options.sourceid || null; 
      const source = this.source = options.source || null; // {type:'geojson',data:''}
      // let type   = this.type   = options.type || null;
      let sublayers = this.sublayers = {};
      if(source){
        this.slayer     = StyleCatalog.getStyle('layer',options.slayer || 'default');
        this.sattribute.sourceid= this.id;
        this.sattribute.sourcelayer= options.sourcelayer;
       
        const self=this;
        // type=this.type || this.getType();
        const _sublayers = {point:['circle'],symbol:['symbol'],line:['line','circle','symbol'],polygon:['fill','line','circle']};
        const array = _sublayers[this.slayer.type];
        array.forEach(subtype=>{
          sublayers[subtype]=new LayerMapBox({_mapbox:options._mapbox,_parent:()=>self,id:id+'-'+subtype,programid:subtype,slayer:this.slayer});

        })
      }
  }
  get category(){return this.slayer.category}
  get parent(){if(this._parent)return this._parent()}
  get mapbox(){return this._mapbox()}
  
  get sattribute(){
    // return this.slayer.getSAttribute(this.slayer.activeatt)?this.slayer.getSAttribute(this.slayer.activeatt):
    // this.slayer.getSAttribute('default')
    return this.slayer.getSAttribute('default');
  }
  get sprogram(){return this.sattribute.getSProgram(this.programid)}
  get name(){return this.slayer.title}
  getType(){
    if(this.source.type=='vector')return 'point'
    const _type=turf.getType(this.source.data);
    if(_type=='FeatureCollection')return turf.getType(this.source.data.features[0]).toLowerCase();
    return turf.getType(this.source.data).toLowerCase();
  }  
  getSubLayer(id){
    if(!this.sublayers[id])throw new Error("SubLayer does not exist");
    return this.sublayers[id];
  }
  get legendSymbol(){
    return this.slayer.legendSymbol;
  }

  get obj(){
    const {id,programid,sattribute,sprogram}=this;
    const obj= {
        id: id,
        type: programid,
        source: sattribute.sourceid,
        paint: sprogram.paint.mapboxobj,
        layout:sprogram.layout.mapboxobj,
      }
    if(sprogram.filter)obj.filter=sprogram.filter;
    if(sattribute.sourcelayer)obj["source-layer"]=sattribute.sourcelayer;
    return obj;
  }

  addToMap(){
    const {id,source,sublayers,mapbox} = this;
    mapbox.addSource(id, source);

    for(let id in sublayers){
      mapbox.addLayer(sublayers[id].obj);
    }

  }
  async getSourceSync(){
    const { type, data } = this.source;
    if (type == "geojson" && typeof data == "string") this.source.data = await Fetch.request(data,{responseType:'json'});
    return this.source.data;
  }
  async getImagesSync(){
    
     const { slayer,mapbox} = this;
     for(let aid in slayer.sattributes){
       const attribute=slayer.sattributes[aid];
       for(let pid in attribute.sprograms){
        const program=attribute.sprograms[pid];
          const layout = program.layout;
          if(layout.url && !mapbox.listImages().includes(layout.image)){
            const [err,_image] = await to(this.getImageSync(layout.url));
            if(err)console.warn(layout.url + "does not exist");
            if(!err)mapbox.addImage(layout.image, _image);
          }
       }
     }
     
  }
  async getImageSync(url){
    const {mapbox}=this;
    return new Promise((resolve, reject)=>{
        mapbox.loadImage(url, function(error, image) {
          if (error) reject(error);
          else resolve(image);
        });
    });
  }   
  
  
  // async addImageSync(image){
  //   const {mapbox}=this;
  //   const {id,url} = image;
  //   if(this.images[id])return;
  //   this.images[id] = image;
  //   const _image = await this.getImageSync(url);
  //   mapbox.addImage(id, _image);
  // }

  
  
  get active(){return this.slayer.active}
  set active(value){this.slayer.active=value}
  toggle() {this.active = !this.active;this.refreshLayout()}
  show() {this.active = true;this.refreshLayout()}
  hide() {this.active = false;this.refreshLayout()}
  refreshLayout() {
    if(this.source){
      for(let id in this.sublayers){
        const sublayer = this.sublayers[id];
        if(this.active)this.mapbox.setLayoutProperty(sublayer.id, 'visibility', sublayer.slayer.getSAttribute('default').getSProgram(sublayer.programid).active?'visible':'none');
        if(!this.active)this.mapbox.setLayoutProperty(sublayer.id, 'visibility', 'none');
      }
    } else {
      this.mapbox.setLayoutProperty(this.id, 'visibility', this.active?'visible':'none');
    }
  }
  setPaintProperty(prop,value){
    prop=prop.split('-');
    if(prop.length != 2)throw new Error("Error here")
    this.style.paint.setProperty(prop[1],value)
    
  }
  setLayoutProperty(prop,value){
    prop=prop.split('-');
    if(prop.length != 2)throw new Error("Error here")
    this.style.layout.setProperty(prop[1],value)
    
  }
}