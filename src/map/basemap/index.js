
import basic from './basic.png';
import dark from './dark.png';
import light from './light.png';
import outdoors from './outdoors.png';
import satellite from './satellite.jpg';
import streets from './streets.png';


import Popover from '../../popover';
export default class Basemap {
  constructor(options) {
    if (!options) options = {}
    this.maps = options.maps || [{ id: 'streets', active: false,src:streets }, { id: 'light', active: true,src:light }, { id: 'dark', active: false,src:dark }, { id: 'satellite', active: false,src:satellite }, { id: 'basic', active: false,src:basic }, { id: 'outdoors', active: false,src:outdoors }];
    this.callback = options.callback || function(){};
  }
  
  
 render(navelement) {
    this.navelement = navelement;
    
        const {maps,callback} = this;
    const self = this;

    
    const basemappop = this.basemapPop = new Popover({
      relativeposition:true,
      width: 260,
      height: 0,
      isheader: true,
      isstatic: true,
      isresize: false,
      title:'Basemap',
      datum: { start: { x: 0, y: 0 }, end: { x: 0, y: 0 }, origin: { x: -270, y: -35 } },
    })
   
    navelement.append('button')
    .attr('class', 'mapboxgl-ctrl-icon')
    .attr('title',"Basemap")
    .on('click',()=>basemappop.show())
    .append('i').attr('class', 'fab fa-windows')
    
    
    
    basemappop.render(navelement);
    basemappop.hide();
    
    const content = basemappop.content
    const contentp = basemappop.contentp.attr('class', 'contentp p-1')
    // const container = content.append('div').attr('class','container')
    const row = content.append('div').attr('class', 'row m-0')
    maps.forEach(basemap => {
      const { id, active,src } = basemap;
      const column = row.append('div').attr('class', 'col-6 p-1')
      const imgp = basemap.imgp = column.append('div')
        // .style('position',' absolute')
        .style('width', ' 118px')
        .style('height', '100px')
        .style('overflow', 'hidden')
      basemap.img = imgp.append('img')
        .attr('alt', 'Basemap - {0}'.format(id))
        .attr('src',src)
        // .attr('src', 'https://api.mapbox.com/styles/v1/mapbox/{0}-v9/static/-122.337798,37.810550,7.0,0.00,0.00/125x125?access_token={1}'.format(id, accessToken))
        .style('cursor', 'pointer')
        .on('click', () => self.changeBasemap(id))

      basemap.check = imgp.append('div')
        .style('display', 'none')
        .style('position', 'absolute')
        .style('top', ' 50%')
        .style('transform', ' translateX(-50%) translateY(-50%)')
        .style('left', ' 50%')
        basemap.check.append('i').attr('class', 'fas fa-check-circle fa-2x')
      if (active) basemap.check.style('display', '')
    })
    
    
    
    
    
 }
 
  changeBasemap(id) {
    const {callback}=this;
    this.maps.forEach(basemap => {
      if (basemap.id == id) {
        basemap.active = true
        basemap.check.style('display', '')
      }
      else {
        basemap.active = false;
        basemap.check.style('display', 'none')
      }
    });
    if(callback)callback();
  }
}