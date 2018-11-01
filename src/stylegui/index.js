
// import Tables from '../tables';
import Tabs from '../tabs';
import {Button,ButtonColor} from '../index.js';
import Pill from '../pill';
import Panel from '../panel';
import NavigationPanel from '../navigationpanel';
import NavigationPill from '../navigationpill'
import DraggableNumber from '../draggablenumber'
import Dropdown from '../dropdown'
// import Button from '../button';
// import Pill from '../pill';
// import NavigationPill from '../navigationpill'
// import MapBoxGL from '../mapboxgl';
// import DragDrop from '../dragdrop';
// // import LayerProperty from '../layerproperty';
// import PropertyAttribute from './propertyattribute';
// import PropertyLayer from './propertylayer';
// import Style from '../style'


// import Modal from '../modal';
// import { extend } from '@julien.cousineau/util';
// const d3 = require('../../dist/d3.min.js');
// import TableLayer from '../table/tablelayer';
// import TableMapBox from '../table/tablemapbox';

// import BarContainer from '../barcontainer';
export default class StyleGUI{
    constructor(options) {
        this._style = options._style
        this.width  = new DraggableNumber({title:'Line Width: ', value:1,callback:(value)=>console.log('dn1',value)});
        this.radius  = new DraggableNumber({title:'Point size: ', value:1,callback:(value)=>console.log('dn1',value)});
        this.blur  = new DraggableNumber({title:'Blur size: ', value:1,callback:(value)=>console.log('dn1',value)});
        this.colortype = new Dropdown({title:'BTN1',callback:function(value){console.log(value)},active:'constant',values:{'constant':{title:'Constant'},'attribute':{title:'By Attribute'},}})
        this.color = new ButtonColor({})
        this.gradient = new Button({})
        this.outlinecolor = new Button({})
    }

    
    render(element){
        this.element=element;
        if(!this.tabs){
          element.append('div').text("No layer selected").style('text-align','center')
        }
    }
    get style(){return this._style()}

    update(_style){
        this._style=_style;
        this.element.html("")
        this.createForm(this.element,'ColorType',this.colortype)
        this.createForm(this.element,'Color',this.color)
        
        if(this['render'+this.style.id])this['render'+this.style.id]();
    }
    createForm(element,label,input){
         const formgroup = element.append('div').attr('class','form-group row')
         formgroup.append('label').attr('class','col-2 col-form-label').text(label)
         const col = formgroup.append('div').attr('class','col-10')
         input.render(col);
    }
        
    
    rendercircle(){
        this.createForm(this.element,'Radius',this.radius)
        this.createForm(this.element,'Blur',this.blur)
    }
    renderline(){
        this.createForm(this.element,'Width',this.width)
        
    }
    renderfill(){
        this.createForm(this.element,'Outline Color',this.outlinecolor)
    }    
      
    
    
 
    
}