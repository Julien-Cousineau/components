import Panel from '../panel';
import DraggableNumber from '../draggablenumber';
import Dropdown from '../dropdown';
export default class RenderingStylePanel extends Panel {
  constructor(options){
    super(options)
    if(!options.callbacks)throw new Error('Rendering Panel needs callbacks');
    const active = this.active = options.active || 'point';
    const pointsize = this.pointsize = options.pointsize || 2;
    const linesize = this.linesize = options.linesize || 2;
    const isosize = this.isosize = options.isosize || 2;
    const callbacks = this.callbacks = options.callbacks;

    const self=this;
    const dropdowncallback = function(value){self.renderstyle(value);callbacks.style(value)};
    this.types = {
      point:{
        point:{title:'Point',callback:dropdowncallback},
      },
      line:{
        point:{title:'Point',callback:dropdowncallback},
        line:{title:'Line',callback:dropdowncallback},
        pointline:{title:'Point and Line',callback:dropdowncallback},
      },
      polygon:{
        point:{title:'Point',callback:dropdowncallback},
        line:{title:'Line',callback:dropdowncallback},
        pointline:{title:'Point and Line',callback:dropdowncallback},
        surface:{title:'Surface',callback:dropdowncallback},
      },
      mesh:{
        point:{title:'Point',callback:dropdowncallback},
        wireframe:{title:'Wireframe',callback:dropdowncallback},
        surface:{title:'Surface',callback:dropdowncallback},
        contour:{title:'Contour',callback:dropdowncallback},
        contouriso:{title:'Contour-Iso',callback:dropdowncallback}
      },
    }
    const dnpointsize =this.dnpointsize = new DraggableNumber({title:'Point size: ',value:pointsize,callback:(value)=>callbacks.options('pointsize',value)});
    const dnlinesize =this.dnlinesize = new DraggableNumber({title:'Line width: ',value:linesize,callback:(value)=>callbacks.options('linesize',value)});
    const dnisosize=this.dnisosize = new DraggableNumber({title:'Isoline width:',value:isosize,callback:(value)=>callbacks.options('isosize',value)}); 
    
    this.styles={
      point:[dnpointsize],
      line:[dnlinesize],
      pointline:[dnpointsize,dnlinesize],
      wireframe:[dnlinesize],
      contouriso:[dnisosize],
    }
  }
  render(element){
    super.render(element)
    const {card,dropdown} = this;
    if(dropdown){
      dropdown.render(card);
      this.detail = card.append('div').attr('class','paneldetail');
    }
  }
  renderstyle(activestyle){
    const {detail,styles} = this;
    detail.html("");
    if(styles[activestyle]){
      // detail.append('h5').text('Options');
      const self=this;
      styles[activestyle].forEach(item=>item.render(detail));
    }    
  }
  changeDropdown(type,activestyle){
    const {callbacks,card,types} = this;
   
    const dropdown = this.dropdown = new Dropdown({
      active:activestyle,
      values:types[type],
    });
    dropdown.render(card);
    this.detail = card.append('div').attr('class','paneldetail');
    this.renderstyle(activestyle);
  }
}