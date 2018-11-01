export default class Panel {
  constructor(options){
    if(!options)throw new Error("Panel needs options")
    this.title = options.title;
    this.col = options.col || 6;
    
    this.doms = {};

  }
  render(element){
    if(!element)throw new Error("Panel needs an element to render");        
    const {id,active,title,content,col} = this;         
    const card = this.doms.card = element
              .append('div')
              .attr('class','col-{0}'.format(col))
              .style('padding','1px')
              .append("div")
              .attr('class','card')
              .append("div")
              .attr('class','card-body')
              .style('padding','0px 2px 2px')
              .append('div').attr('class','container-fluid')
    this.doms.title = card
              .append('h5')
              .attr('class','card-title')
              .style('font-size','0.85rem')
              .style('line-height','1.0')
              .style('margin-bottom','2px')
              .style('color','#73879C')
              .text(title)
    return this.doms;
    
  }    
}