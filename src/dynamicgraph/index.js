'use strict';
const d3 = require('../../dist/d3.min.js');
import Dropdown from '../dropdown';
import Graph from '../graph';
import DraggableNumber from '../draggablenumber';
export default class DynamicGraph extends Graph {
  constructor(options){
      super(options);
    const self=this;
    const isxdropdown = this.isxdropdown = (typeof options.isxdropdown=='undefined')?true:options.isxdropdown;
    const isydropdown = this.isydropdown = (typeof options.isydropdown=='undefined')?true:options.isydropdown;
    
    const xactive = this.xactive = options.xactive || 'scaleLinear';
    const yactive = this.yactive = options.yactive || 'scaleLinear';
    
    const values = {
      'scaleLinear':{title:'Linear'},
      'scalePow':{title:'Power'},
      'scaleLog':{title:'Log'},
    };
    
    this.xfactor = new DraggableNumber({
        title:' ',
        value:1.0,
        callback:(value)=>self.changeFactor('x',value)
    });

    this.yfactor = new DraggableNumber({
        title:' ',
        value:1.0,
        callback:(value)=>self.changeFactor('y',value)
    });
   
    this.xdropdown = new Dropdown({
      title:'BTN1',
      topofsvg:true,
      active:this.xactive,
      values:values       ,
      callback:(value)=>self.changeDropdown('x',value),
    });


    this.ydropdown = new Dropdown({
      title:'BTN1',
      topofsvg:true,
      active:this.yactive,
      values:values,      
      callback:(value)=>self.changeDropdown('y',value),

    });
  }
  changeDropdown(axis,type){
    this[axis+'active'] = type;
    this.axes.changeScale(axis,type);
    this[axis+'factor'].changeTitle(this.factorTitle(type));
    this.scaleMinMax(axis,type);
    (type=='scaleLinear')?this[axis+'factor'].hide():
                           this[axis+'factor'].show();
            
                           
    
  }
  factorTitle(type){
    if(type=='scalePow')return 'Exponent :';
    if(type=='scaleLog')return 'Base : ';
    return '';
  }
  scaleMinMax(axis,type){
    if(type=='scalePow'){
      this[axis+'factor'].changeMin(0.1);
      this[axis+'factor'].changeMax(20.0);
    }
    if(type=='scaleLog'){
      this[axis+'factor'].changeMin(2);
      this[axis+'factor'].changeMax(10.0);
    }
    console.log(axis,type)
    
  }
  
  
  changeFactor(axis,value){
    if(this[axis].exponent)this[axis].exponent(value);
    if(this[axis].base)this[axis].base(value);
    this.resize();
  }
  
  render(){
      super.render();
      const {element,svg,xdropdown,ydropdown,xfactor,yfactor}=this;
      const group = element.append('div')
        .style('position','absolute')
        .style('right','0px')
        .style('top','0px')
      
      svg.style('z-index','0');
      if(xdropdown){
          const xgroup = group.append('div');
          xdropdown.render(xgroup).style("float",'right');
          xfactor.render(xgroup).style("float",'right').style("padding-right","5px").style('font-size','0.75rem').style('line-height','1.5rem');
          (this.xactive=='scaleLinear')?xfactor.hide():xfactor.show();
          xgroup.append('div').attr('class','clearfix');
      }
      if(ydropdown){
        const ygroup = group.append('div')
        ydropdown.render(ygroup).style("float",'right');
        yfactor.render(ygroup).style("float",'right').style("padding-right","5px").style('font-size','0.75rem').style('line-height','1.5rem');
        (this.yactive=='scaleLinear')?yfactor.hide():yfactor.show();
        ygroup.append('div').attr('class','clearfix');
        
      }
      
  }
  
 
}