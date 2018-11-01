import Row from '../'
export default  class RowAtt extends Row {
  constructor(options){
      super(options)
  }
  get attribute(){return this._pointer()}
  get row(){
      // const {id,title,active}=this.attribute;
      // return {id:id,title:title,active:active};
      return this.attribute
  }
}