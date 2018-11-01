import {MapGL,Parent,Primitive,Gradient,Color} from '../../src/index.js';

const { grid, randompoints, quad } = Primitive;

const domcanvas2d =Parent.append('div')
.style("position",'absolute')
.style("height",'400px')
.style("width",'400px')

const mapGL  = new MapGL({});
mapGL.render(Parent);
mapGL.render2d(domcanvas2d);

const _mygrid = grid(10,10);
const layer = mapGL.addLayerQuad('mylayer',{geometry:_mygrid,slayer:'debug'});
layer.addValue('maillagee',_mygrid.values.values,{sattribute:'quad-debug'});


mapGL.camera.onresize()
