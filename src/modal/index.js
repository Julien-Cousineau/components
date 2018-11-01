
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
    this.footer=options.footer || {};
    this.size = options.size || ''; //'modal-sm' or 'modal-lg'
    // this.show=(typeof options.show == 'undefined') ? false : options.show;
    this.doms={};
    // this.popup = new Popup();  
    }
  render() {
    const {title,size}=this;
    const body = this.doms.body = d3.select(document.getElementsByTagName("body")[0]);
    const self=this;
    const modal =this.doms.modal=body.append('div').attr('class','modal fade')
    const modaldialog = modal.append('div').attr('class','modal-dialog {0}'.format(size)).attr('role','document')
    const modalcontent = modaldialog.append('div').attr('class','modal-content')
    const modalheader = modalcontent.append('div').attr('class','modal-header')
    const modaltitle = modalheader.append('h5').attr('class','modal-title').text(title)
    const closebtn = modalheader.append('button')
    .attr('type','button')
    .attr('class','close')
    .attr('data-dismiss','modal')
    .attr('aria-label','close')
    .append('span').attr('aria-hidden',"true").append('i').attr('class','fas fa-times')

    
     const modalbody = this.doms.modalbody = modalcontent.append('div').attr('class','modal-body')
     const modalfooter= this.doms.modalfooter = modalcontent.append('div').attr('class','modal-footer')
     
    // if(body && body.render)body.render(modalbody);
    // if(footer && footer.render)footer.render(modalfooter);
     
     return this;
    
  }
  show(){
    const dom = this.doms.modal;
    return new Promise(function(resolve, reject){
       $(dom.node()).modal('show');
       $(dom.node()).on('shown.bs.modal',()=>{
         resolve(true);
       })
    })
  }
  hide(){
    const dom = this.doms.modal;
    $(dom.node()).modal('hide')
  }
  delete(){
    const dom = this.doms.modal;
    $(dom.node()).on('hidden.bs.modal',()=>dom.remove())
    $(dom.node()).modal('hide')
  }

}
