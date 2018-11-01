
// import Tables from '../tables';
import Tabs from '../tabs';
import Button from '../button';
import Pill from '../pill';
import Panel from '../panel';
import NavigationPanel from '../navigationpanel';
import NavigationPill from '../navigationpill'
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
export default class LayerGUI{
    constructor(options) {
      this.guis={
        circle:this.createNavitationPanel(new Button({}),new Button({})),
      }

   
    
    
  


    
           
    }
    createNavitationPanel(propertiescontent,paintcontent){
      return new NavigationPanel(
        {panels:[
          new Panel({title:'Properties',col:6,content:propertiescontent}),
          new Panel({title:'Paint',col:6,content:paintcontent})
          ],
          
        })
    }
    
    
    render(element){
        this.element=element;
        if(!this.tabs){
          element.append('div').text("No layer selected").style('text-align','center')
        }
        
    }
    get layer(){return this._layer()}
    gui(){
      
    }
    update(_layer){
      
      this._layer = _layer;
      this.element.html('');
      
      const pills = {};
      for(const id in this.layer.styles){
        pills[id]=new Pill({id:id,active:false,content:this.guis[id]})
      }
      
      
      
       const tabs_content = {
      description:new Button({title:'BTN1',value:1,callback:()=>console.log('btn1')}),
      styles:new NavigationPill({pills:pills}),
      filter:new Button({title:'BTN1',value:1,callback:()=>console.log('btn1')}),
      statistcs:new Button({title:'BTN',value:1,callback:()=>console.log('btn1')}),
    }
      
    
    
    
      this.tabs= new Tabs({
              tabs:{
                description:{title:'Description',active:true,content:tabs_content.description},
                styles:{title:'Styles',active:false,content:tabs_content.styles},
                filter:{title:'Filter',active:false,content:tabs_content.filter},
                statistcs:{title:'Statistics',active:false,content:tabs_content.statistcs},
              }
          });      
      
      this.tabs.render(this.element);
    }
}