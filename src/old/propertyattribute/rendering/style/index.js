import Panel from '../../../../panel';
import DraggableNumber from '../../../../draggablenumber';
import Dropdown from '../../../../dropdown';
import Checkbox from '../../../../checkbox';
export default class Style extends Panel {
  constructor(options){
    super(options)
    if(!options._attribute)throw new Error('Rendering Panel needs a Pointer');
    if(!options.callbacks)throw new Error('Rendering Panel needs callbacks');
    this._attribute=options._attribute;
    this.callbacks = options.callbacks;

  }
  
  
 
  get attribute(){return this._attribute()}
  // get type(){return this.attribute.type}
  // get rstyleid(){return this.attribute.rstyleid}
  // get pointsize(){return this.attribute.sizes.point}
  // get linesize(){return this.attribute.sizes.line}
  // get isosize(){return this.attribute.sizes.iso}
  // get rstyles(){return this.attribute.rstyles}
  // get typestyles(){return this.attribute.typestyles}
  // get activelist(){return this.attribute.activelist }
  
  render(element){
    super.render(element);
    const {card} = this;
    const detail = this.detail = card.append('div').attr('class','paneldetail');
    this.refresh();
    
  }
  refresh(){
    const {detail} = this;
    detail.html("")
    const {attribute,callbacks}=this;
    const self=this;
    const program = attribute.program;
    const dropdown = this.dropdown = new Dropdown({
              active: attribute.program.id,
              values:attribute.activelist,
              callback:(_program)=>{attribute.setProgram(_program);if(callbacks.refreshPanels)callbacks.refreshPanels();}
            });
    dropdown.render(detail);
    const checkbox = new Checkbox({title:'Active',value:program.active,callback:(value)=>{program.toggle();if(callbacks.showhideProgram)callbacks.showhideProgram(self.attribute.layer.id,self.attribute.id,self.attribute.program.id)}})
    checkbox.render(detail);
  }
}

