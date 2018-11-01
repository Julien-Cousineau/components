import * as turf from '@turf/turf'
const pointA = turf.point([0,0],{name:'Point A',value:0,group:"A"})
const pointB = turf.point([0.25,0],{name:'Point B',value:1,group:"B"})
const pointC = turf.point([0.5,0],{name:'Point C',value:2,group:"C"})
const pointD = turf.point([0.75,0],{name:'Point C',value:3,group:"D"})
const pointE = turf.point([1.0,0],{name:'Point C',value:4,group:"E"})

// TODO
// Create GEOJSON from ARRAY using turf
export default class GeoJSON{
    constructor(){}
    static dummy(){return pointA}
    static fromArray(array){
        if(!Array.isArray(array))return ['Error'];
        const points = array.map(row=>{
            const x = row['x'] || row['lng'] || 0.0;
            const y = row['y'] || row['lat'] || 0.0;
            return turf.point([x,y],row);
        });
        return turf.featureCollection(points);
    }
    static download(exportObj, exportName){
        let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
        let downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href",     dataStr);
        downloadAnchorNode.setAttribute("download", exportName + ".json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
      }
        
    
}