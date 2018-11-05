import MapBox from '../mapbox';
import MapGLMapBox from '../mapglmapbox';

import { grid, randompoints, quad } from '../mapgl/primitive';
// import StencilMode from 'mapbox-gl/src/gl/stencil_mode'
import {LayerSLF} from '../index.js';

import { extend } from '@julien.cousineau/util';

export default class MapBoxGL extends MapBox {
  constructor(options) {
    super(options)
    const mapGL = this.mapGL = new MapGLMapBox({});
    
  }
  loadLayer(obj){
    const self=this;
    if(obj.type!='slf')return super.loadLayer(obj);
    return new LayerSLF(extend({_mapboxgl:()=>self},obj))
  }

  async addLayer(id,layer){
    if(this.layers[id])throw new Error("Layer id exist");
    if(layer.layertype=='mapbox')return await super.addLayer(id,layer);
    this.layers[id] = layer;
    await layer.addToMap();
  }
  // addSLF(layer){
  //   const {mapGL} = this;
  //   if(layer.constructor.name=='LayerSLF' || )layer.addToMap(mapGL);
  //   return;
  // }
  showhideLayer(layerid) {
    if(this.layers[layerid].layertype=='mapbox')return super.showhideLayer(layerid);
    this.mapGL.toggle(layerid);
    this.drawScene();
  }
  async showhideAttribute(layerid,attributeid){
    if(this.layers[layerid].layertype=='mapbox')return super.showhideAttribute(layerid,attributeid); //TODO
    const attribute = await this.mapGL.getLayer(layerid).getAttribute(attributeid);
    attribute.toggle()
    this.drawScene();
  }
  async showhideProgram(layerid,attributeid,programid){
    if(this.layers[layerid].layertype=='mapbox')return super.showhideAttribute(layerid,attributeid); //TODO
    const attribute = await this.mapGL.getLayer(layerid).getAttribute(attributeid);
    attribute.getProgram(programid).toggle()
    this.drawScene();
  }
  async setGradient(layerid,attributeid,programid,gradient){
    if(!this.layers[layerid])return;
    if(this.layers[layerid].layertype=='mapbox')return super.showhideAttribute(layerid,attributeid); //TODO
    const attribute = await this.mapGL.getLayer(layerid).getAttribute(attributeid);
    attribute.setTexture(programid,gradient);
    this.drawScene();
  }
  setRStyle(id,rstyle){
    if(!this.layers[id])return;
    if(this.layers[id].layertype=='mapbox')return super.setRStyle(id,rstyle);
    this.layers[id].rstyle = rstyle;
    this.setPaintProperty(id,'rstyle',rstyle);
    
  }
  // setPaintProperty(id,prop,value){
  //   if(this.layers[id].constructor.name=='LayerMapBox')return super.setPaintProperty(id,prop,value);
  //   this.mapGL.setPaintProperty(id, prop, value); 
  //   this.drawScene();
  // }

  async render(parent) {
    
    await super.render(parent);
    
    
    this.mapGL.setGL(this.gl)
    this.mapGL.setExtension()
  
    // const {mapGL}=this;
    // const _points= randompoints(100,[-15,-15,15,15]);
    
    // const layer = mapGL.addLayer('mylayer');
    // const mypoints = layer.addGeometry('points',_points)
    // mypoints.addValue('value',_points.values);
    
    // const _points2= randompoints(10000,[-10,-10,10,10]);
    // const mypoints2 = layer.addGeometry('points2',_points2)
    // mypoints2.addValue('value',_points2.values);
    
    // layer.addTexture('dtexture',{})
    // layer.textures['dtexture'].todefaultcolor();
    // // mapGL.addTexture('dtexture2',{glslvarname:'dtexture'})
    // // mapGL.textures['dtexture2'].todefaultcolor();
    // layer.addProgram('points',{
    //     active:true,
    //     mode:'POINTS',
    //     geometryID:'points',
    //     textureIDs:['dtexture'],
    //     vs:layer.glsl.mapbox.points.vs,
    //     fs:layer.glsl.mapbox.points.fs,
    // })
    //         mapGL.addProgram('points2',{
    //     active:true,
    //     mode:'POINTS',
    //     geometryID:'points2',
    //     textureIDs:['dtexture'],
    //     vs:mapGL.glsl.mapbox.points.vs,
    //     fs:mapGL.glsl.mapbox.points.circlefs,
    // });
    
    this.overwriteMapBoxRender();
    await this.loadMap();

  }
  postDraw(){return}
  async drawScene(){
    await this.mapbox._render();
  }
  overwriteMapBoxRender(){
    const {callbacks}=this;
    const self=this;
    const renderLayer = this.mapbox.painter.renderLayer;
    const _render = this.mapbox._render;
    const gl = this.gl;
    this.rendering=false;
    
    this.mapbox._render = async function(){
      await self.mapGL.checkData();
      if(!self.rendering){
       self.rendering=true;
        _render.call(this);
      }
    }
    
    this.mapbox.painter.renderLayer = function(painter,sourceCache, layer, coords) {
      this.options.showTileBoundaries=true
        renderLayer.call(this,painter,sourceCache, layer, coords);
        if(layer.id==='building' && painter.renderPass=='translucent'){
          gl.disable(gl.STENCIL_TEST);this.context.stencilTest.current=false;
          gl.enable(gl.DEPTH_TEST);this.context.depthTest.current=true;
          gl.depthFunc(gl.LEQUAL);this.context.depthMask.current=gl.LEQUAL;
          gl.depthMask(false);this.context.depthMask.current=false;
          gl.depthRange(0.00001,.98);this.context.depthRange.current=[0.00001,0.98];

          gl.enable(gl.BLEND);this.context.blend.current=true;
          gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);this.context.blendFunc.current=[gl.ONE,gl.ONE_MINUS_SRC_ALPHA];
          gl.colorMask(true, true, true, true);this.context.colorMask.current=[true,true,true,true];
          gl.blendColor(0.0, 0.0,0.0,0);
          self.mapGL.drawScene(self.mapbox.transform.worldSize,self.mapbox.transform.zoom,self.mapbox.transform.projMatrix)
          this.context.program.current=null;
          this.context.bindElementBuffer.current =null;
          this.context.activeTexture.current=null;

        }
        const layerIds = this.style._order;
       
        if(this.currentLayer == layerIds.length-1 && painter.renderPass=='translucent'){
          gl.enable(gl.BLEND);this.context.blend.current=true;
          gl.colorMask(false, false, false, false);this.context.colorMask.current=[true,true,true,true];
          self.rendering=false;
        }
      
      
     
    };    
    
    
  }

  




}
