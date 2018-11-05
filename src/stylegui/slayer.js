import {SVG,GraphSuit,Checkbox,ButtonColor,DraggableNumber,Tabs,StyleGUIProgram} from '../index.js';
// import StyleProgram from '../style/styleprogram.js';
import StyleLayer from '../style/stylelayer.js';
export default class StyleGUISLayer{
  constructor(options){
      options = options || {};
      if(!options.slayer)console.warn("StyleGUILayer needs a style pointer");
      this.slayer = options.slayer || new StyleLayer();
      this.callbacks = options.callbacks ||{changed:function(){console.log('StyleGUILayer changed')}};
      this.doms = {};
      
  }
  
  get sattributes(){return this.slayer.sattributes}
  get type(){return this.slayer.type}
  setActive(value){
    this.slayer.active=value;
    if(this.callbacks.active)this.callbacks.active(value);
  }
  render(element){
    this.element=element;
    this.refresh();
    return this;
  }
  refresh(){
    const {type,slayer,callbacks,element}=this;
    element.html("");
    const container = element.append("div").attr('class','container-fluid')
    const row = container.append("div").attr('class','row')
    const headerc = row.append("div").attr('class','col-sm-12').append('span')
    
    headerc.append('div').html(slayer.symbol).style('display','inline-block')
    headerc.append('h4').text(slayer.title).style('display','inline-block')
    .style('margin-bottom',0)
    .style('vertical-align','middle');
        
    row.append('hr').attr('class','col-sm-12')
    const self=this;
    const checkbox = new Checkbox({title:'active',value:slayer.active,callback:this.setActive.bind(this)})
    checkbox.render(container.append("div").attr('class','row').attr('class','col-sm-12'))
    const r=container.append('div').attr('class','row')
    r.append('div').attr('class','col-sm-4').append("p").attr('class','small').text('Source:')
    r.append('div').attr('class','col-sm-8').append("p").attr('class','small').html(slayer.refsource);
    
                  
    const r2=container.append('div').attr('class','row')
    r2.append('div').attr('class','col-sm-4').append("p").attr('class','small').text('Description:')
    r2.append('div').attr('class','col-sm-8').append("p").attr('class','small').text(slayer.description);
    return this;  
  }    
}