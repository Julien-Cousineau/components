import Panel from '../../../panel';
import DraggableNumber from '../../../draggablenumber';
import Dropdown from '../../../dropdown';
import Checkbox from '../../../checkbox';
export default class Prop extends Panel {
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
  get rstyle(){return this.activeAttribute.rstyle}
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
    const {rstyleid,pointsize,linesize,isosize,callbacks}=this;
    const self=this;
    const dnpointsize = new DraggableNumber({title:'Point size: ',value:pointsize,callback:(value)=>callbacks.changePointSize(value)});
    const dnlinesize = new DraggableNumber({title:'Line width: ',value:linesize,callback:(value)=>callbacks.changeLineSize(value)});
    const dnisosize= new DraggableNumber({title:'Isoline width:',value:isosize,callback:(value)=>callbacks.changeLineSize(value)}); 
    const cb1  = new Checkbox({
    title:'On',
    value:self.rstyle.active,
    callback:(value)=>{self.rstyle.active=value;if(callbacks.setActive)callbacks.setActive(self.rstyle)}})
    cb1.render(detail);
    
    
    const dns={
      point:[dnpointsize],
      line:[dnlinesize],
      wireframe:[dnlinesize],
      contouriso:[dnisosize],
      surface:[],
      contour:[],
    }
     dns[rstyleid].forEach(item=>{item.render(detail)});
  }
}

