import { feature as Feature, point as Point, lineString as LineString,polygon as Polygon } from '@turf/helpers'

import * as turf from '@turf/turf'

export default class Action {
    constructor(options) {
        if (!options) throw new Error("Action needs options")
        if (!options._measure) throw new Error("Action needs _measure pointer")
        this._measure = options._measure;
        this.id = options.id || 'measure-distance';
        
        this.type = options.type || 'distance'
        this.icon = options.icon || 'fas fa-tape';
        this.title = options.title || 'Measure Distance';
        
        this.points = [];
        


    }
    get mapboxtype(){
        const {type}=this;
        if(type=='distance')return 'line'
        if(type=='polygon')return 'fill'
        if(type=='bbox')return 'fill'
        if(type=='buffer')return 'fill'
    }
    get label(){return this.measure.label}
    get measure(){return this._measure()}
    get mapbox() { return this.measure.mapbox }
    get paint() {
        if(this.mapboxtype=='line')return {"line-color": "#888"}
        if(this.mapboxtype=='fill')return {'fill-color':'#777', 'fill-outline-color': '#000'}
    }

    render(parent) {
        const { title, icon } = this;
        this.parent = parent;
        const self=this;
        const element = this.element = parent.append('button')
            .attr('class', 'mapboxgl-ctrl-icon')
            .attr('title', title)
            .on('click', () => self.clickIcon())
        element.append('i').attr('class', icon)

    }
    feature(points){
        const {type}=this;
        if(type=='distance'){
            points = (points.length > 1) ? points : [points[0], points[0]];    
            return LineString(points); 
        } else if(type=='polygon'){
            if(points.length == 1) return LineString([points[0], points[0]]);
            if(points.length == 2) return LineString([points[0], points[1]]);
            points.push(points[0]);
            return Polygon([points]);
        } else if(type=='bbox'){
            if(points.length == 1)return turf.bboxPolygon(turf.bbox(LineString([points[0], points[0]])));
            return turf.bboxPolygon(turf.bbox(LineString(points)));
        } else if(type=='buffer'){
            const origin = turf.point(points[0]);
            if(points.length == 1)return turf.buffer(origin,0.001);
            const line = LineString(points); 
            const dist = turf.length(line, {units: 'kilometers'});
            return turf.buffer(origin, dist, {units: 'kilometers'});
        }
        
        
        
    }
    get pointscopy() { return this.points.slice(0) }
    click(e) {
        const { isOn,type } = this;
        if (!isOn) return;
        
        this.points.push([e.lngLat.lng, e.lngLat.lat]);
        this.draw(this.pointscopy);
        
        if(type=="bbox" && this.points.length==2)this.exiting();
        if(type=="buffer" && this.points.length==2)this.exiting();
    }
    draw(points) {
        const { mapbox,id} = this;
        const feature = points?this.feature(points):Point([]);
        mapbox.getSource(id).setData(feature);
        this.writeLabel(feature);
    }
    textLength(feature){
        return 'Length : {0} km'.format(turf.length(feature, {units: 'kilometers'}).toFixed(2))
    }
    textArea(feature){
        return 'Area : {0} sq.m.'.format(turf.area(feature).toFixed(0));
    }    
    writeLabel(feature){
        const {label,type,textLength,textArea}=this;
        
        
        const geotype = turf.getType(feature);
        if(geotype=='Point')return label.text('');
        if(geotype=='LineString')return label.text(textLength(feature));
        if(geotype=='Polygon' && type=='buffer')return label.text(textLength(feature) + " " + textArea(feature));
        if(geotype=='Polygon')return label.text(textArea(feature));
    }
    mousemove(e) {
        const {mapbox, isOn, points } = this;
        if (!isOn || points.length == 0) return;
        mapbox.getCanvas().style.cursor = (isOn) ? 'crosshair' : ''
        const copy=this.pointscopy;
        copy.push([e.lngLat.lng, e.lngLat.lat])
        this.draw(copy);
    }
    dblclick(e) {
        const {isOn } = this;
        if (!isOn) return;
        this.click(e);
        this.exiting();
    }
    exiting(){
        const {mapbox } = this;
        this.isOn = false;
        mapbox.getCanvas().style.cursor = '';

        setTimeout(()=> mapbox.doubleClickZoom.enable(), 10);
    }
    showhide(){
        const {mapbox, id,isOn } = this;
        this.addLayerIfNeeded();
        if(isOn)mapbox.setLayoutProperty(id, 'visibility', 'visible');
        if(!isOn)mapbox.setLayoutProperty(id, 'visibility', 'none');
    }
    showhideAll(){
        const {actions}=this.measure;
        Object.keys(actions).forEach(key=>{
            actions[key].showhide();
        });
    }
    addLayerIfNeeded(){
        const { mapbox, id, paint,mapboxtype } = this;
        if (!mapbox.getSource(id)) mapbox.addSource(id, { type: "geojson", data: Point([]) });
        if (!mapbox.getLayer(id)) {
            mapbox.addLayer({ id: id, type: mapboxtype, source: id, paint: paint });
            const self=this;
            mapbox.on('click', (e) => self.click(e));
            mapbox.on('mousemove', (e) => self.mousemove(e));
            mapbox.on('dblclick', (e) => self.dblclick(e));
            
        }

    }
    clickIcon() {
        const { mapbox} = this;
        this.points = [];
        this.isOn = true;
        
        this.showhideAll();
        this.draw(null);
        mapbox.getCanvas().style.cursor = 'crosshair';
        mapbox.doubleClickZoom.disable();
    }



}
