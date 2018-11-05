import {Panel,GradientBtn,Checkbox,ButtonColor,DraggableNumber} from '../index.js';
import StyleProgram from '../style/styleprogram.js';
export default class GUISProgram extends Panel{
  constructor(options){
      super(options)
      if(!options.sprogram)console.warn("StyleGUIProgram needs a style pointer");
      this.sprogram = options.sprogram || new StyleProgram();
      const callback=this.callback = options.callback ||function(){console.log('StyleGUIProgram changed')};
      
      const self=this;
      
      const _setColorOption=this.setColorOption.bind(this);
      const callbacks = {
        gradient:(v)=>{self.sprogram.paint.gradient=v;callback()},
        color:(v)=>{self.sprogram.paint.color=v.hex;callback()},
        active:(v)=>{self.sprogram.active=v;callback()},
        radius:(v)=>{self.sprogram.paint.radius=v;callback()},
        width:(v)=>{self.sprogram.paint.width=v;callback()},
        colorbyatt:(v)=>{_setColorOption(v);self.sprogram.paint.colorbyatt=v;callback()},
        minmax:(v)=>{self.sprogram.paint.minmax=v;callback()},
        exponent:(v)=>{self.sprogram.paint.exponent=v;callback()},
      }
      
      
      const {gradient,minmax,exponent,color,colorbyatt,radius,width}=this.sprogram.paint;
      this.components = {
        gradientbtn:new GradientBtn({gradient:gradient,disabled:false,minmax:minmax,exponent:exponent,callbacks:{gradient:callbacks.gradient,minmax:callbacks.minmax,exponent:callbacks.exponent}}),
        buttoncolor: new ButtonColor({color:color,callbacks:{color:callbacks.color}}),
        active:new Checkbox({title:'Active',value:this.sprogram.active,callback:callbacks.active}),
        att:new Checkbox({title:'Color by attribute',value:colorbyatt,callback:callbacks.colorbyatt}),
        radius:new DraggableNumber({title:'Point size: ',after:false,value:radius, min:1,max:10,callback:callbacks.radius}),
        width:new DraggableNumber({title:'Line width: ',after:false,value:width, min:1,max:10,callback:callbacks.width})
      }
      this.rendering={
        symbol:['active','att'],
        circle:['active','radius','att'],
        line:['active','width','att'],
        fill:['active','att'],
        contour:['active','att'],
        contouriso:['active','att'],
        
      }
  }
  get paint(){return this.sprogram.paint}
  get layout(){return this.sprogram.layout}
  
  setColorOption(value){
    this.doms.colordiv.html("");
    (value)?this.components.gradientbtn.render(this.doms.colordiv):
            this.components.buttoncolor.render(this.doms.colordiv)
        
  }
  render(element){
    super.render(element);
    const {doms,components}=this;
    const componentids = this.rendering[this.sprogram.type];
    const tiltle = doms.card.append('div').attr('class','row').append('h5').text(this.sprogram.type).style("text-transform", "capitalize")
    for(let i=0;i<componentids.length;i++){
      const id = componentids[i];
      const component = components[id];
      component.render(doms.card.append('div').attr('class','row'))
      if(id=='att'){
        this.doms.colordiv = doms.card.append('div').attr('class','row');
        this.setColorOption(this.sprogram.paint.colorbyatt);
      }
    }
    return this;
  }    
}