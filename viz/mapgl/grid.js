import {MapGL,Parent,Primitive,Gradient,Color} from '../../src/index.js';

const { grid, randompoints, quad } = Primitive;

const mapGL  = new MapGL({});
mapGL.render(Parent);

const _mygrid = grid(10,10);
const layer = mapGL.addLayer('mylayer',{geometry:_mygrid,slayer:'debug'});
mapGL.camera.onresize()
