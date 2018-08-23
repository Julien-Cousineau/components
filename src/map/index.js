'use strict';
// import style from './style.scss';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import MapboxDraw from '@mapbox/mapbox-gl-draw';

import mapboxstyle from '../../dist/mapbox-gl.css';

import MapboxGeocoderStyle from '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'

import examplegeojson from './example.geojson';



import Basemap from './basemap';
import Measure from './measure';


const d3 = require('../../dist/d3.min.js');
import 'whatwg-fetch'



import { getJson } from '../d3util'
export default class Map {
  constructor(options) {
    if (!options) options = {}
    const accessToken = this.accessToken = options.accessToken || 'pk.eyJ1Ijoic2ZlcmciLCJhIjoiY2l6OHF4eG85MDBwcTMybXB5dTY0MzlhNCJ9.Mt1hpCCddMlSvDiCtOQiUA';

    this.id = options.id || 'mapboxgl';
    this.center = options.center || [0, 0];
    this.zoom = (typeof options.zoom == 'undefined') ? 0 : options.zoom;
    this.pitchWithRotate = (typeof options.pitchWithRotate == 'undefined') ? true : options.pitchWithRotate;
    this.dragRotate = (typeof options.dragRotate == 'undefined') ? true : options.dragRotate;
    this.touchZoomRotate = (typeof options.touchZoomRotate == 'undefined') ? true : options.touchZoomRotate;

    
    this.navigationcontrol = (typeof options.navigationcontrol == 'undefined') ? true : options.navigationcontrol;
    this.geocoder = (typeof options.geocoder == 'undefined') ? true : options.geocoder;
    this.isdraw = (typeof options.isdraw == 'undefined') ? true : options.isdraw;
    this.ismeasure = (typeof options.ismeasure == 'undefined') ? true : options.ismeasure;
    this.sources = options.sources || {}

    this.layers = options.layers || {};
    

    
    
    const self = this;
    this.base = new Basemap({ callback: () => self.changeBasemap() });






    mapboxgl.accessToken = accessToken;


  }
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

    const mapgl = this.mapgl = new mapboxgl.Map({
      container: id, // container id
      style: activeBasemap,
      center: center,
      zoom: zoom,
      pitchWithRotate: pitchWithRotate,
      dragRotate: dragRotate,
      touchZoomRotate: touchZoomRotate,
    });
    mapgl.doubleClickZoom.disable();
    const element = this.element = d3.select(mapgl._container)

   
    if (geocoder) mapgl.addControl(new MapboxGeocoder({ accessToken: mapboxgl.accessToken }));
    
    if (navigationcontrol) {
      const nav = this.nav = new mapboxgl.NavigationControl();
      const navelement = this.navelement = d3.select(nav._container);
      mapgl.addControl(nav, 'top-right');
      this.base.render(navelement);
    }
    
    if (isdraw) {
      const draw = this.draw = new MapboxDraw();
      mapgl.addControl(draw, 'top-right');
    }
    if (ismeasure) {
      // if(!this.draw)this.draw= new MapboxDraw({displayControlsDefault: false});
      this.measure = new Measure();
      // this.measure._draw=()=>self.draw;
      this.measure._mapgl = () => self.mapgl;
      const ele = d3.select(mapgl._controlPositions['bottom-right'])
      ele.html(null);
      this.measure.render(ele)

    }





    const promise = new Promise((resolve, reject) => {
      mapgl.on('load', async function() {
        await self.loadMap();
        resolve(true);
      });
    });
    return promise;
  }
  changeBasemap() {
    this.mapgl.setStyle(this.activeBasemap);
  }

  async loadMap() {
    const { mapgl} = this;
    mapgl.doubleClickZoom.enable();
    await this.loadSources();
    this.loadLayers();
    const self = this;
    mapgl.on('style.load', function() {
      console.log(self.sources)
      Object.keys(self.sources).forEach((key) => {
        
        mapgl.addSource(key, self.sources[key]);
      });
      self.loadLayers();
    });
  }
  async loadSources() {
    const { mapgl} = this;
    const self=this;
    return await Promise.all(
      Object.keys(self.sources).map(async(key) => {
        const { type, data } = self.sources[key];
        if (type == "geojson" && typeof data == "string") self.sources[key].data = await getJson(data);
        mapgl.addSource(key, self.sources[key]);
        return self.sources;
      })
    );
  }
  loadLayers() {
    const { mapgl, layers } = this;
    Object.keys(layers).forEach((key) => {
      const layer = layers[key];
      const newlayers = layer.mapboxlayers;
        for(let style in newlayers){
         mapgl.addLayer(newlayers[style]);
      }
    });
  }

  addLayer(newlayer){
    const {id,source} = newlayer;
    if(this.sources[id])throw new Error("Source id exist")
    if(this.layers[id])throw new Error("Layer id exist")
    
    this.sources[id]=source;

    const { mapgl } = this;
    mapgl.addSource(id, source);
    const newlayers = newlayer.mapboxlayers;
    for(let style in newlayers){
       mapgl.addLayer(newlayers[style]);
    }
  }
  showhideMapboxGL(id,con){
    const { mapgl} = this;
    if(con){mapgl.setLayoutProperty(id, 'visibility', 'visible');}
    else{mapgl.setLayoutProperty(id, 'visibility', 'none');}
  }
  changePaint(id,prop,value){
   const { mapgl} = this;
    mapgl.setPaintProperty(id, prop, value);  
  }
  


}
