import * as turf from '@turf/turf'
import Style from '../../style'
import LayerSLF from '../layerslf'
export default  class LayerSLFBinary extends LayerSLF {
  constructor(options){
      super(options)
      if(!options)options={}
      this.binaries = {}
  }
  
  async getMesh(id){
     const url =`/mesh?id={0}`.format(id);
     const name='mesh_{0}'.format(id);
     return await this.getBuffer(url,name,"mesh (id={0})".format(id));
  }

  async getProximity(id,meshid){
     const url =`/proximity?id={0}&mesh={1}`.format(id,meshid);
     const dbname='prox_{0}_{1}'.format(id,meshid);
     const buffer = await this.getBuffer(url,dbname,"proximity ({0})".format(id));
     return  new Float32Array(buffer);
  }
  async getValue(id,meshid){
     const url =`/value?id={0}&mesh={1}`.format(id,meshid);
     const name='value_{0}_{1}'.format(id,meshid);
     const buffer = await this.getBuffer(url,name,"{0}".format(id));
     return  new Float32Array(buffer);   
  }
  addToTable(table){
    if(table.constructor.name!='Tables')throw new Error("Needs to be a Tables")
  }
}