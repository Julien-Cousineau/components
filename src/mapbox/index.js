'use strict';
// import style from './style.scss';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import MapboxDraw from '@mapbox/mapbox-gl-draw';

import mapboxstyle from '../../dist/mapbox-gl.css';

import MapboxGeocoderStyle from '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'

import examplegeojson from './example.geojson';
import Fetch from '../fetch'


import Basemap from './basemap';
import Measure from './measure';

import {LayerMapbox} from '../index.js';

const d3 = require('../../dist/d3.min.js');
import 'whatwg-fetch'
import { getJson } from '../parser'
import { extend } from '@julien.cousineau/util';

export default class MapBox {
  constructor(options) {
    if (!options) options = {}
    const accessToken = this.accessToken = options.accessToken || 'pk.eyJ1Ijoic2ZlcmciLCJhIjoiY2l6OHF4eG85MDBwcTMybXB5dTY0MzlhNCJ9.Mt1hpCCddMlSvDiCtOQiUA';

    this.id = options.id || 'mapboxgl';
    this.center = options.center || [0, 0];
    this.zoom = (typeof options.zoom == 'undefined') ? 4 : options.zoom;
    this.pitchWithRotate = (typeof options.pitchWithRotate == 'undefined') ? true : options.pitchWithRotate;
    this.dragRotate = (typeof options.dragRotate == 'undefined') ? true : options.dragRotate;
    this.touchZoomRotate = (typeof options.touchZoomRotate == 'undefined') ? true : options.touchZoomRotate;

    
    this.navigationcontrol = (typeof options.navigationcontrol == 'undefined') ? true : options.navigationcontrol;
    this.geocoder = (typeof options.geocoder == 'undefined') ? true : options.geocoder;
    this.isdraw = (typeof options.isdraw == 'undefined') ? false : options.isdraw;
    this.ismeasure = (typeof options.ismeasure == 'undefined') ? true : options.ismeasure;
    // this.sources = options.sources || {}

    this._layers = options.layers || {};
    this.layers = {};
    this._images = options.images || {};
    this.images={}
    
    

    
    
    const self = this;
    this.base = new Basemap({ callback: () => self.changeBasemap() });






    mapboxgl.accessToken = accessToken;


  }
  get gl(){return this.mapbox.painter.context.gl}
  get activeBasemap() {
    const id = this.base.maps.find(e => e.active).id;
    return 'mapbox://styles/mapbox/{0}-v9'.format(id);
  }
  render(parent) {
    const {
      id,
      center,
      zoom,
      activeBasemap,
      dragdrop,
      navigationcontrol,
      geocoder,
      pitchWithRotate,
      dragRotate,
      touchZoomRotate,
      isdraw,
      ismeasure
    } = this;
    this.parent = parent;
    const self = this;
    parent.append('div')
      .attr('id', id)
      .style('width', '100%')
      .style('height', '100%')

    const mapbox = this.mapbox = new mapboxgl.Map({
      container: id, // container id
      style: activeBasemap,
      center: center,
      zoom: zoom,
      animate:false,
      pitchWithRotate: pitchWithRotate,
      dragRotate: dragRotate,
      touchZoomRotate: touchZoomRotate,
    });
    mapbox.doubleClickZoom.disable();
    const element = this.element = d3.select(mapbox._container)

   
    if (geocoder) mapbox.addControl(new MapboxGeocoder({ accessToken: mapboxgl.accessToken }));
    
    if (navigationcontrol) {
      const nav = this.nav = new mapboxgl.NavigationControl();
      const navelement = this.navelement = d3.select(nav._container);
      mapbox.addControl(nav, 'top-right');
      this.base.render(navelement);
    }
    
    if (isdraw) {
      const draw = this.draw = new MapboxDraw();
      mapbox.addControl(draw, 'top-right');
    }
    if (ismeasure) {
      // if(!this.draw)this.draw= new MapboxDraw({displayControlsDefault: false});
      this.measure = new Measure();
      // this.measure._draw=()=>self.draw;
      this.measure._mapbox = () => self.mapbox;
      const ele = d3.select(mapbox._controlPositions['bottom-right'])
      ele.html(null);
      this.measure.render(ele)

    }
    return new Promise((resolve, reject) => {
      mapbox.on('load', async ()=>resolve(true));
    });
  }
  changeBasemap() {
    this.mapbox.setStyle(this.activeBasemap);
  }
  loadEvents(){
    this.mapbox.on('click', function(e) {return e});
  }
  async loadMap() {
    const { mapbox} = this,self=this;
    mapbox.doubleClickZoom.enable();
    this.loadLayers();
    
    await this.getSourcesSync();
    
    await this.addLayers();
    this.loadEvents();
    // await this.getImagesSync();
    mapbox.on('style.load', ()=>self.reloadMapBoxLayers());
  }
  loadLayers(){
    const {_layers}=this;
    for(const id in _layers)_layers[id] = this.loadLayer(_layers[id]);
  }
  loadLayer(obj){
    const self=this;
    return new LayerMapbox(extend({_mapbox:()=>self.mapbox},obj));
  }
  async getSourcesSync() {
    const {_layers}=this;
    return await Promise.all(Object.keys(_layers).map(async(key) =>await _layers[key].getSourceSync()));
  }
  reloadMapBoxLayers(){
    const {layers} = this;
    Object.keys(layers).filter((key) =>layers[key].layertype=='mapbox')
                       .forEach(key=>layers[key].addToMap());
  }
  async addLayers() {
    const {_layers} = this;
    for(let id in _layers)await this.addLayer(id,_layers[id]);
  }
  async addLayer(id,layer){
    if(this.layers[id])throw new Error("Layer id exist");
    this.layers[id] = layer;
    await layer.getImagesSync();
    layer.addToMap();
  }
  // async getImagesSync() {
  //   const {_images}=this;
  //   for(const id in _images){
  //     await this.addImageSync(_images[id])
  //   }  
  // }
  // async getImagesSync() {
  //   const {layers} = this;
  //   for(let id in layers){
  //     const layer=layers[id];
  //     if(layer.constructor.name=='LayerMapBox')await layer.getImagesSync();
  //   }
  // }  
  // async addImageSync(image){
  //   const {mapbox}=this;
  //   const {id,url} = image;
  //   if(this.images[id])return;
  //   this.images[id] = image;
  //   const _image = await this.getImageSync(url);
  //   mapbox.addImage(id, _image);
  // }
  // async getImageSync(url){
  //   const {mapbox}=this;
  //   return new Promise((resolve, reject)=>{
  //       mapbox.loadImage(url, function(error, image) {
  //         if (error) reject(error);
  //         resolve(image);
  //       });
  //   });
  // }  

  // addToMapbox(layer){
  //   if(layer.constructor.name!='LayerMapBox')throw new Error("Not a LayerMapBox layer")
  //   const {id,source} = layer;
  //   this.mapbox.addSource(id, source);
  //   const styles = layer.mapboxlayers;
  //   for(let style in styles)this.mapbox.addLayer(styles[style]);
    
  // }
  // setRStyle(id,rstyle){
  //   if(!this.layers[id])return;
    
  // }
  // getLayer(id){
  //   if(!this.layers[id])throw new Error("Layer does not exist");
  //   return this.layers[id];
  // }
  
  drawScene(){
    this.mapbox._render();
  }
  getLayer(_id){
    const ids=_id.split('-');
    if(ids.length == 1){
      if(!this.layers[_id])throw new Error("Layer does not exist");
      return this.layers[_id];
    }
    if(ids.length == 2){
      if(!this.layers[ids[0]])throw new Error("Layer does not exist");
      return this.layers[ids[0]].getSubLayer(ids[1]);
    }
    throw new Error("Unknown lenght");
  }
  
  toggle(id) {this.getLayer(id).toggle()}
  show(id) {this.getLayer(id).show()}
  hide(id) {this.getLayer(id).hide()}
  
  
  setPaintProperty(id,prop,value){
    const { mapbox} = this;
    this.getLayer(id).setPaintProperty(prop, value);
    mapbox.setPaintProperty(id, prop, value);  
  }
  setLayoutProperty(id,prop,value){
    const { mapbox} = this;
    this.getLayer(id).setLayoutProperty(prop, value);
    mapbox.setLayoutProperty(id, prop, value);  
  }


}
