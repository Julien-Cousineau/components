import {MapGL,Parent,Primitive} from '../../src/index.js';

const { grid, randompoints, quad } = Primitive;

const mapGL  = new MapGL({
});
mapGL.render(Parent);

const _points= randompoints();

const mypoints = mapGL.addGeometry('points',_points)
mypoints.addValue('values',_points.values);

mapGL.addTexture('dtexture',{})
mapGL.textures['dtexture'].todefaultcolor();
mapGL.addProgram('points',{
    active:true,
    mode:'POINTS',
    geometryID:'points',
    textureIDs:['dtexture'],
    vs:mapGL.glsl.points.vs,
    fs:mapGL.glsl.points.fs,
})
    