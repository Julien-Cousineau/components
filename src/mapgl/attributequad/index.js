import { extend } from '@julien.cousineau/util';
import ProgramQuad from '../programquad';
import Attribute from '../attribute';


export default class AttributeQuad extends Attribute {
  constructor(options) {
      super(options);
  }
  createPrograms(){
    const {geoID} = this;
    const fbtexture =this.addTexture('fbtexture',{width: this.geometry.res, height: this.geometry.res });
    const self=this;
    this.programs['quadmca']=new ProgramQuad({
      id:'quadmca',
      _attribute:()=>self,
      geometryID:'quad',
      textureIDs:[''],
      fbID: 'fbtexture',
      geoTextureID: geoID,
      uniforms: {dtextureRes: { data: [this.geometry.res], type: 'float' }},
      vs:this.layer.glsl.quad.vs,
      fs:this.layer.glsl.quad.mfs,
    });    
    ['fill','line','circle'].forEach((name)=>{
      const fvs = this.layer.mapbox?this.layer.glsl.mapbox.fquad.vs:this.layer.glsl.fquad.vs;
      const ffs = this.layer.mapbox?this.layer.glsl.mapbox.fquad.fs:this.layer.glsl.fquad.fs; 

      const program ={
        geometryID:geoID,
        textureIDs: ['fbtexture'],
        uniforms: { dtextureRes: { data: [this.geometry.res], type: 'float' },minmax:{data:[0,1],type:'float'},},//TODO: CHECK 0,1
        vs:fvs,
        fs:ffs,
        };
      this.addProgram(name,program); 
    },this);
    
    return this;
  }
}
