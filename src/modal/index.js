'use strict';
// import style from './style.scss';
// import mapboxgl from 'mapbox-gl';
// import mapboxstyle from '../../dist/mapbox-gl.css';
// var MapboxGeocoder = require('@mapbox/mapbox-gl-geocoder');
// import MapboxGeocoderStyle from '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
// import examplegeojson from './example.geojson';
// const d3 = require('../../dist/d3.min.js');
// import 'whatwg-fetch'

// import {getJson} from '../d3util'
import Popup from '../popup';
const d3 = require('../../dist/d3.min.js');

export default class Modal {
  constructor(options) {
    if (!options) options = {}
    this.title=options.title ||"Title"
    this.body=options.body || {};
    
    this.popup = new Popup();  
    }
  render() {
    const {title,body}=this;
    const element = document.getElementsByTagName("body")[0];
    this.popup.render(d3.select(element))
    
    const dom =this.dom= this.popup.body.append('div').attr('class','modal fade')
    const modaldialog = dom.append('div').attr('class','modal-dialog').attr('role','document')
    const modalcontent = modaldialog.append('div').attr('class','modal-content')
    const modalheader = modalcontent.append('div').attr('class','modal-header')
    const modaltitle = modalheader.append('h5').attr('class','modal-title').text(title)
    const closebtn = modalheader.append('button')
    .attr('type','button')
    .attr('class','close')
    .attr('data-dismiss','modal')
    .attr('aria-label','close')
    .append('span').attr('aria-hidden',"true").text('&times;')
    
     const modalbody = modalcontent.append('div').attr('class','modal-body')
     const modalfooter = modalcontent.append('div').attr('class','modal-footer')
     if(body && body.render)body.render(modalbody);
     return dom;
    
  }
  show(){
    console.log('here')
    this.dom.style('display','block')
  }
  hide(){
    this.dom.style('display','none')
  }

}
