
import {feature as Feature,point as Point,lineString as LineString} from '@turf/helpers'
import Action from './action';
export default class Measure {
  constructor(options) {
    if (!options) options = {}
    this.actions = {}
  }
 
 get mapgl(){return this._mapgl()}
 
 render(parent) {
    this.parent = parent;
    
    const label = this.label = parent.append('div')
    .style('position','absolute')
    .style('right', '3rem')
    .text('')
    
    const group = this.group =parent.append('div')
    .attr('class', 'mapboxgl-ctrl-group mapboxgl-ctrl')
    
    const self=this;
    const distance = this.actions.distance = new Action({_measure:()=>self,id:'measure-distance',type:'distance',icon:'fas fa-tape',title:'Measure Distance'})
    const polygon = this.actions.polygon = new Action({_measure:()=>self,id:'measure-polygon',type:'polygon',icon:'fas fa-draw-polygon',title:'Measure Area (Polygon)'})
    const bbox = this.actions.bbox = new Action({_measure:()=>self,id:'measure-area',type:'bbox',icon:'fas fa-vector-square',title:'Measure Area'})
    const circle = this.actions.circle = new Action({_measure:()=>self,id:'measure-circle',type:'buffer',icon:'far fa-circle',title:'Buffer Distance'})
    
    
    distance.render(group)
    polygon.render(group)
    bbox.render(group)
    circle.render(group)
   
 }
}