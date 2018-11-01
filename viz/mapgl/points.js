import {MapGL,Parent,Primitive,Gradient,Color} from '../../src/index.js';

const { grid, randompoints, quad } = Primitive;

const mapGL  = new MapGL({
});
mapGL.render(Parent);

const _points= randompoints(10000000);

const layer = mapGL.addLayer('debug',{geometry:_points,slayer:'debug'});

// const attributed = layer.getAttribute('values');
// const program = attributed.getProgram('circle');
// attributed.show();
// program.show();
mapGL.camera.onresize()
