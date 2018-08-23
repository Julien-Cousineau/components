'use strict';
// import style from './style.scss';
// import mapboxgl from 'mapbox-gl';
// import mapboxstyle from '../../dist/mapbox-gl.css';
// var MapboxGeocoder = require('@mapbox/mapbox-gl-geocoder');
// import MapboxGeocoderStyle from '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
// import examplegeojson from './example.geojson';
// const d3 = require('../../dist/d3.min.js');
// import 'whatwg-fetch'

// import Popover from '../popover';

import {getJson} from '../d3util'
export default class Card {
  constructor(options) {
    if (!options) options = {}
     this.header =options.header ||'';
     this.footer = options.footer ||'';
     this.body = options.body ||'body';
     
   

  }
 
  render(parent) {
    this.parent = parent;

    const card = this.card = parent.append('div')
    
    ['header','body','footer'].forEach(name=>{
        if(this[name])this[name+'element']=card.append('div').attr('class', 'card-{0}'.format(name));
        if(typeof this[name] =='string')this[name+'element'].text(this[name]);
        if(typeof this[name] !='string')this[name].render(this[name+'element']);
       
    });
    


    }



}
