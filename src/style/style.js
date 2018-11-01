

export default  class Style {
  constructor(options){
      options=options||{};
      this.id    = options.id    || "My ID";
      this.title = options.title || "My Title";
      this.active =(typeof options.active === 'undefined') ? true : options.active;
      this.zorder = options.zorder || 0;
  }
  
  get obj(){
    const {id,title,active,zorder}=this;
    return {id:id,title:title,active:active,zorder:zorder};
  }
  toJSON(){return JSON.stringify(this.obj)}
}