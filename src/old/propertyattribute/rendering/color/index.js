import Panel from '../../../../panel';
import DraggableNumber from '../../../../draggablenumber';
import Dropdown from '../../../../dropdown';
import ColorSlider from '../../../../colorslider';
import ColorGradient from '../../../../colorgradient';
export default class Color extends Panel {
  constructor(options){
    super(options)
    if(!options._attribute)throw new Error('Rendering Panel needs a Pointer');
    if(!options.callbacks)throw new Error('Rendering Panel needs callbacks');
    this._attribute=options._attribute;
    this.callbacks = options.callbacks;

  }
  
  
 
  get attribute(){return this._attribute()}
  
  
  render(element){
    super.render(element);
    const {card} = this;
    const detail = this.detail = card.append('div').attr('class','paneldetail');
    this.refresh();
    
  }
  refresh(){
    const {detail} = this;
    detail.html("")
    const {attribute,callbacks}=this;
    const self=this;
    const program = attribute.program;
    const gradient = program.gradient
    const sliders = {};
    gradient.stops.forEach((stop,i)=>{
      const color = gradient.colors[i];
   
      sliders[i]=new ColorSlider({
                      color:color,
                      value:stop,
                      r:5,
                      type:'y',
                      con:'mid',
                      isexterior:false,
                      isinterior:false,
                      iscursor:false,
                      iscursorcircle:true,
                      callbacks:{
                          value:(value)=>console.log('value'),
                          color:()=>console.log('color')}
                  })
    })
    const layerid=attribute.layer.id
    const attributeid=attribute.id
    const programid=program.id
    const colorgradient = this.colorgradient = new ColorGradient({
                    addable:true,
                    height:150,
                    width:10,
                    sliders:sliders, 
                    callback:function(gradient){
                      program.gradient=gradient;
                      if(callbacks.setGradient)callbacks.setGradient(layerid,attributeid,programid,gradient);
                      
                    }
                });
    colorgradient.render(detail);
  }
}

