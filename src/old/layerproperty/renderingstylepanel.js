import Panel from '../panel';
import DraggableNumber from '../draggablenumber';
import Dropdown from '../dropdown';
export default class RenderingStylePanel extends Panel {
  constructor(options){
    super(options)
    if(!options._activelayer)throw new Error('Rendering Panel needs an Active Layer');
    if(!options.callbacks)throw new Error('Rendering Panel needs callbacks');
    this._activelayer=options._activelayer;
    this.callbacks = options.callbacks;

  }
  
  
  get activelayer(){return this._activelayer()}
  get type(){return this.activelayer.type}
  get rstyle(){return this.activelayer.rstyle}
  get pointsize(){return this.activelayer.sizes.point}
  get linesize(){return this.activelayer.sizes.line}
  get isosize(){return this.activelayer.sizes.iso}
  get rstyles(){return this.activelayer.rstyles}

  
  get rstylelist(){return this.rstyles[this.type] }
  
  render(element){
    super.render(element);
    const {card} = this;
    const detail = this.detail = card.append('div').attr('class','paneldetail');
    this.refresh();
  }
  refresh(){
    const {detail} = this;
    detail.html("")
    const {rstyle,rstylelist,pointsize,linesize,isosize,callbacks}=this;
    const dropdown = this.dropdown = new Dropdown({
              active: rstyle,
              values:rstylelist,
              callback:(style)=>callbacks.changeRStyle(style)
            });
    dropdown.render(detail);
    
    
    const dnpointsize = new DraggableNumber({title:'Point size: ',value:pointsize,callback:(value)=>callbacks.changePointSize(value)});
    const dnlinesize = new DraggableNumber({title:'Line width: ',value:linesize,callback:(value)=>callbacks.changeLineSize(value)});
    const dnisosize= new DraggableNumber({title:'Isoline width:',value:isosize,callback:(value)=>callbacks.changeLineSize(value)}); 
    
    const dns={
      point:[dnpointsize],
      line:[dnlinesize],
      pointline:[dnpointsize,dnlinesize],
      wireframe:[dnlinesize],
      contouriso:[dnisosize],
      surface:[],
      surfacep:[dnpointsize],
      surfacel:[dnlinesize],
      surfacepl:[dnpointsize,dnlinesize],
    }
     dns[rstyle].forEach(item=>{item.render(detail)});
  }
}

