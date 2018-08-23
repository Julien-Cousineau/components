import {MapGL,Parent,Primitive} from '../../src/index.js';

const { grid, randompoints, quad } = Primitive;

const mapGL  = new MapGL({
});
mapGL.render(Parent);

const _mygrid = grid(10,10);
const mygrid = mapGL.addGeometry('grid',_mygrid)
mygrid.addValue('values',_mygrid.values);

mapGL.addTexture('dtexture',{})
mapGL.textures['dtexture'].todefaultcolor();
mapGL.addProgram('points',{
    active:true,
    mode:'TRIANGLES',
    geometryID:'grid',
    textureIDs:['dtexture'],
    vs:mapGL.glsl.points.vs,
    fs:mapGL.glsl.points.fs,
})
    