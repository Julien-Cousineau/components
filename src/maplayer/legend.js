import style from './style.scss';
export default class Legend {
    constructor(options){
        this.layers={};
        
    }
    render(element){
        this.element=element;
      const dom = this.dom = element
      .append('div')
      .attr('class','bmaplegend')
      .append('div')
      .attr('class','maplegend')
      
      
      dom.append('h4').text('Legend')
      this.content = dom.append('div');
      return this;
    }
    add(layer){
        this.layers[layer.id]=layer;
        layer.addToLegend(this.content);
    }
    refresh(){
        this.content.html('')
        for(let id in this.layers){
            const layer = this.layers[id];
            layer.addToLegend(this.content);
        }
    }
}