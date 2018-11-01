import Panel from '../panel';
import Dropdown from '../dropdown';
import ColorGradient from '../colorgradient'
import ColorSlider from '../colorslider'

export default class ColorGradientPanel extends Panel {
  constructor(options){
    super(options)
    // if(!options.callbacks)throw new Error('ColorGradientPanel needs callbacks');
    const callback = this.callback = options.callback || function(gradient){console.log('here')};
    
       const cg = this.cg =new ColorGradient({
          addable:true,
          height:150,
          width:10,
          callback:callback,
      
      sliders:{
        s1: new ColorSlider({
            rgba:{r:255,g:0,b:0,a:1},
            value:0,
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
        }),
        s2: new ColorSlider({
            rgba:{r:255,g:255,b:0,a:1},
            value:1,
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
        }),  
      }});
    
    
  }
  render(element){
    super.render(element)
    const {card,cg} = this;
    if(cg)cg.render(card); 
  }
}