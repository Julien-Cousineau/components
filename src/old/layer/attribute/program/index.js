
import Gradient from '../../../../gradient'
export default  class Program {
  constructor(options){
      if(!options)options={};
       if(!options._attribute)throw new Error("Needs a attribute pointer")
      this._attribute=options._attribute;
      this.id = options.id || 'id';
      this.title = options.title || 'title';
      this.active = (typeof options.active === 'undefined') ? true : options.active;
      const _gradient = options.gradient || {0.0: '#3288bd',
                                            0.1: '#66c2a5',
                                            0.2: '#abdda4',
                                            0.3: '#e6f598',
                                            0.4: '#fee08b',
                                            0.5: '#fdae61',
                                            0.6: '#f46d43',
                                            1.0: '#d53e4f'};
      
      this.setGradient(_gradient)
  }
  setGradient(gradient){
    this.gradient =  Gradient.parsefromObj(gradient);
  }
  get attribute(){return this._attribute()}
  
  toggle(){this.active = !this.active}
  show(){this.active=true}
  hide(){this.active=false}
  get obj(){
    return {
      id:this.id,
      title:this.title,
      active:this.active,
      gradient:this.gradient.obj,
    }
  }
}