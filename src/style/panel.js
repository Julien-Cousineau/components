import {Panel,GradientBtn,Checkbox,ButtonColor,DraggableNumber} from '../index.js';

export default class StylePanel extends Panel{
  constructor(options){
      super(options)
      // const tstyle = new Style()
      this._style = options._style || function(){return null};
      // this.style = options.style || new Style();
      const self=this;
      this.onchange = options.onchange || function(){console.log("StylePanel Changed")};
      const _setColorOption=this.setColorOption.bind(this);
      const callbacks = {
        gradient:(v)=>{self.style.paint.gradient=v;self.onchange()},
        color:(v)=>{self.style.paint.color=v;self.onchange()},
        active:(v)=>{self.style.active=v;self.onchange()},
        radius:(v)=>{self.style.paint.radius=v;self.onchange()},
        width:(v)=>{self.style.paint.width=v;self.onchange()},
        colorbyatt:(v)=>{_setColorOption(v);self.style.paint.colorbyatt=v;self.onchange()},
        minmax:(v)=>{self.style.paint.minmax=v;self.onchange()},
        exponent:(v)=>{self.style.paint.exponent=v;self.onchange()},
      }
      
      
      const {gradient,minmax,exponent,color,colorbyatt,radius,width}=this.style.paint;
      this.components = {
        gradientbtn:new GradientBtn({gradient:gradient,minmax:minmax,exponent:exponent,callbacks:{gradient:callbacks.gradient,minmax:callbacks.minmax,exponent:callbacks.exponent}}),
        buttoncolor: new ButtonColor({color:color,callbacks:{color:callbacks.color}}),
        active:new Checkbox({title:'Active',value:this.style.active,callback:callbacks.active}),
        att:new Checkbox({title:'Color by attribute',value:colorbyatt,callback:callbacks.colorbyatt}),
        radius:new DraggableNumber({title:'Point size: ',value:radius, min:1,max:10,callback:callbacks.radius}),
        width:new DraggableNumber({title:'Line width: ',value:width, min:1,max:10,callback:callbacks.width})
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
  get style(){return this._style()}
  get paint(){return this.style.paint}
  setColorOption(value){
    this.doms.colordiv.html("");
    (value)?this.components.gradientbtn.render(this.doms.colordiv):
            this.components.buttoncolor.render(this.doms.colordiv)
        
  }
  render(element){
    super.render(element);
    const {doms,components}=this;
    const componentids = this.rendering[this.style.paint.type];
    for(let i=0;i<componentids.length;i++){
      const id = componentids[i];
      const component = components[id];
      component.render(doms.card.append('div').attr('class','row'))
      if(id=='att'){
        this.doms.colordiv = doms.card.append('div').attr('class','row');
        this.setColorOption(this.style.paint.colorbyatt);
      }
    }
  }    
}