import Panel from '../panel';
import Checkbox from '../checkbox';

export default class RenderingLabelPanel extends Panel {
  constructor(options){
    super(options)
    if(!options.callbacks)throw new Error('Rendering Label Panel needs callbacks');
    const active = this.active = options.active || 'value';
    const callbacks = this.callbacks = options.callbacks;
    
    const pointidlabel =this.pointidlabel = new Checkbox({title:'Point ID',callback:(value)=>callbacks.options('pointidlabel',value)})
    const elementidlabel =this.elementidlabel = new Checkbox({title:'Element ID',callback:(value)=>callbacks.options('elementidlabel',value)}) 
    const attlabel =this.attlabel = new Checkbox({title:'Attribute',callback:(value)=>callbacks.options('attlabel',value)}) 
    
    this.labels={
      point:[pointidlabel,attlabel],
      line:[pointidlabel,attlabel],
      polygon:[pointidlabel,attlabel],
      mesh:[pointidlabel,elementidlabel,attlabel],
    }
  }
  render(element){
    super.render(element)
    const {card,pointidlabel} = this; 
  }
  changeType(activetype){
    const {card,labels} = this;
    labels[activetype].forEach(label=>label.render(card));
  }
}
