import Panel from '../panel';
import Dropdown from '../dropdown';

export default class RenderingAttPanel extends Panel {
  constructor(options){
    super(options)
    if(!options.callbacks)throw new Error('RenderingAtt Panel needs callbacks');
    const active = this.active = options.active || 'value';
    const callbacks = this.callbacks = options.callbacks;
  }
  render(element){
    super.render(element)
    const {card,dropdown} = this;
    if(dropdown)dropdown.render(card); 
  }
  changeDropdown(activeAtt,values){// values:{id:{title:Name}}
    const {callbacks,card} = this;
    for(let id in values)values[id].callback = callbacks.att;
    const dropdown = this.dropdown = new Dropdown({active:activeAtt,values:values});
    dropdown.render(card);
  }
}