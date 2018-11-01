export default  class Row {
  constructor(options){
      if(!options)throw new Error("Need options");
      if(!options._pointer)throw new Error("Need Layer pointer");
      this._pointer = options._pointer;
  }
  get id(){return this.layer.id}
  get layer(){return this._pointer()}
  get row(){
      let {id,name,active,type,symbol}=this.layer;
      console.log(this.layer)
      return {id:id,name:name,active:active,type:type,symbol:symbol};
  }
}