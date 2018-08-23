import {MapGL,Parent,Primitive} from '../../src/index.js';

const { grid, randompoints, quad } = Primitive;

const domcanvas2d =Parent.append('div')
.style("position",'absolute')
.style("height",'300px')
.style("width",'300px')

const mapGL  = new MapGL({});
mapGL.render(Parent);
mapGL.render2d(domcanvas2d);

const _mygrid = grid(10,10);
const mygrid = mapGL.addGeometry('grid',_mygrid)
const geoquad = mapGL.addGeometry('quad',quad())

mygrid.addValue('values',_mygrid.values);

const dtexture = mapGL.addTexture('dtexture',{})
const fbtexture =mapGL.addTexture('fbtexture',{width: mygrid.res, height: mygrid.res })
dtexture.todefaultcolor();


mapGL.addProgram('quadmca',{
    active:true,
    mode:'TRIANGLES',
    geometryID:'quad',
    textureIDs:[''],
    fbID: 'fbtexture',
    geoTextureID: 'grid',
    uniforms: { dtextureRes: { data: [mygrid.res], type: 'float' } },
    vs:mapGL.glsl.quad.vs,
    fs:mapGL.glsl.quad.fs,
})
mapGL.addProgram('surfacemca',{
    active:true,
    mode:'TRIANGLES',
    geometryID:'grid',
    textureIDs: ['dtexture', 'fbtexture'],
    uniforms: {
      dtextureRes: { data: [mygrid.res], type: 'float' },
      minmax:{data:mygrid.minmax,type:'float'},
    },
    vs:mapGL.glsl.fquad.vs,
    fs:mapGL.glsl.fquad.fs,
})
mapGL.addProgram('points',{
    active:true,
    mode:'POINTS',
    geometryID:'grid',
    textureIDs:['dtexture'],
    vs:mapGL.glsl.points.vs,
    fs:mapGL.glsl.points.fs,
})
