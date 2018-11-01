import {Button,Color,Popup,ColorPalette,Tooltip} from '../index.js'
const d3 = require('../../dist/d3.min.js');
export default class ButtonColor extends Button{
  constructor(options){
      super(options)
      options=options||{};
      const color = this.color = options.color || Color.parseString("#000").rgba2str();
      const tooltip = this.tooltip = new Tooltip();
      const callbacks=this.callbacks;
      const self=this;
      this.cp  = new ColorPalette({callback:(color)=>{
        tooltip.remove();
        if(callbacks.color)callbacks.color(color)
        self.color = color.rgba2str();
        self.domcolor.style('background',self.color)
      }});

  }
  render(element){
      super.render(element)
      const {doms,color,showColorPalette} = this;self=this;
      const _showColorPalette = showColorPalette.bind(this)
      doms.button.on("click",_showColorPalette)
      doms.button.style('padding','0.375rem')
      this.domcolor = doms.button.append('div').style('min-width','1rem').style('min-height','1rem').style('background',color)
  }
  showColorPalette(){
    this.cp.render(this.tooltip.show(d3.event))
  }
  
}
