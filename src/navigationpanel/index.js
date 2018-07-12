export default class NavigationPanel {
  constructor(options){
    if(!options)throw new Error("NavigationPanel needs options");        
    this.panels = options.panels || [];    
  }
  render(element){
    if(!element)throw new Error("NavigationPanel needs element to render");   
    this.element = element; 
    this.row = element
      .append("div")
      .attr('class','row')
      .style("margin",'1px')
    this.changePanels();    
  }
    changePanels(_panels){    
    const {row} = this;    
    this.panels = _panels || this.panels;            
    this.panels.forEach(panel=>panel.render(row));    
  }
}