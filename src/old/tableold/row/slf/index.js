import Row from '../'
import RowAtt from '../att'
export default  class RowSLF extends Row {
  constructor(options){
      super(options)
      
  }
  get row(){
      // const {id,name,active,type}=this.layer;
      // return {id:id,name:name,active:active,type:type};
      console.log(this.layer)
      return this.layer;
  }
  get attributes(){
    const atts={};
    for(let id in this.layer.attributes){
      const att = this.layer.attributes[id]
      atts[id] = new RowAtt({_pointer:()=>att});
    }
    return atts;
  }
}