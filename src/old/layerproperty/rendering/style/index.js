import Panel from '../../../panel';
import DraggableNumber from '../../../draggablenumber';
import Dropdown from '../../../dropdown';
export default class Style extends Panel {
  constructor(options){
    super(options)
    if(!options._activelayer)throw new Error('Rendering Panel needs an Active Layer');
    if(!options.callbacks)throw new Error('Rendering Panel needs callbacks');
    this._activelayer=options._activelayer;
    this.callbacks = options.callbacks;

  }
  
  
  get activelayer(){return this._activelayer()}
  get activeAttribute(){return this.activelayer.activeAttribute}
  get type(){return this.activeAttribute.type}
  get rstyleid(){return this.activeAttribute.rstyleid}
  get pointsize(){return this.activeAttribute.sizes.point}
  get linesize(){return this.activeAttribute.sizes.line}
  get isosize(){return this.activeAttribute.sizes.iso}
  get rstyles(){return this.activeAttribute.rstyles}
  get typestyles(){return this.activeAttribute.typestyles}
  get activelist(){return this.activeAttribute.activelist }
  
  render(element){
    super.render(element);
    const {card} = this;
    const detail = this.detail = card.append('div').attr('class','paneldetail');
    this.refresh();
  }
  refresh(){
    const {detail} = this;
    detail.html("")
    const {rstyleid,activelist,callbacks}=this;
    const self=this;
    const dropdown = this.dropdown = new Dropdown({
              active: rstyleid,
              values:activelist,
              callback:(style)=>{
                self.activelayer.rstyleid=style;
                callbacks.setRStyle(style);
              }
            });
    dropdown.render(detail);
    
    
    // const dnpointsize = new DraggableNumber({title:'Point size: ',value:pointsize,callback:(value)=>callbacks.changePointSize(value)});
    // const dnlinesize = new DraggableNumber({title:'Line width: ',value:linesize,callback:(value)=>callbacks.changeLineSize(value)});
    // const dnisosize= new DraggableNumber({title:'Isoline width:',value:isosize,callback:(value)=>callbacks.changeLineSize(value)}); 
    
    // const dns={
    //   point:[dnpointsize],
    //   line:[dnlinesize],
    //   pointline:[dnpointsize,dnlinesize],
    //   wireframe:[dnlinesize],
    //   contouriso:[dnisosize],
    //   surface:[],
    //   surfacep:[dnpointsize],
    //   surfacel:[dnlinesize],
    //   surfacepl:[dnpointsize,dnlinesize],
    // }
    //  dns[rstyle].forEach(item=>{item.render(detail)});
  }
}

