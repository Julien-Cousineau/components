import {SVG,GraphSuit,Checkbox,ButtonColor,DraggableNumber,Tabs,GUISProgram} from '../index.js';
import StyleAttribute from '../style/styleattribute.js';
export default class GUISAttribute{
  constructor(options){
      options = options || {};
      if(!options.sattribute)console.warn("StyleGUIAttribute needs a style pointer");
      this.sattribute = options.sattribute || new StyleAttribute();
      const callbacks=this.callbacks = options.callbacks ||{changed:function(){console.log('StyleGUIAttribute changed')}};

      
  }
  get sprograms(){return this.sattribute.sprograms}
  get paint(){return this.sprogram.paint}
  get layout(){return this.sprogram.layout}
  
  setWeight(value){
    this.sattribute.weight=value;
    if(this.callbacks.changed)this.callbacks.changed();
  }
  setAttActive(value){
    this.sattribute.attactive=value;
    if(this.callbacks.changed)this.callbacks.changed();
  }  
  setAtt(bottom,top,p){
    this.sattribute.att[0]=bottom;this.sattribute.att[1]=top;this.sattribute.att[2]=p;
    if(this.callbacks.changed)this.callbacks.changed();
  }
  render(element){
    this.element=element;
    this.refresh();
    return this;
  }
  refresh(){
      const {element}=this;
      element.html("");
      const self=this;
      // this.svg = new SVG({
      //   style:{position:'absolute',padding:'0px',margin:'0px'},
      //   minwidth:300,
      //   minheight:300,
      //   margin:{top: 10, right: 10, bottom: 50, left: 50}});
      // this.graph = new GraphSuit(
      //       {
      //       bottom:this.sattribute.att[0],
      //       top:this.sattribute.att[1],
      //       p:this.sattribute.att[2],
      //       xmin:this.sattribute.range[0],
      //       xmax:this.sattribute.range[1],
      //       isxaxisminmax:true,
      //       isyaxisminmax:true,
      //       xscale:{axis:'x',show:true,type:'scaleLinear',minmax:[this.sattribute.range[0],this.sattribute.range[1]],editable:false,label:this.sattribute.xlabel + ", " + this.sattribute.units},
      //       yscale:{axis:'y',show:true,type:'scaleLinear',minmax:[0,1],editable:false,label:"Suitability"},
      //       callbacks:{update:(bottom,top,p)=>self.setAtt(bottom,top,p)}
      //       });
      
     
      this.sprogramsguis={}
      for(const id in this.sprograms){
        const callback = (this.callbacks.changeStyle)?this.callbacks.changeStyle:null;
        this.sprogramsguis[id]= new GUISProgram({sprogram:this.sprograms[id],callback:callback});
      }
      
    this.attActive = new Checkbox({
        title:'Active',
        value:this.sattribute.attactive,
        callback:(value)=>self.setAttActive(value)
    })
    
    // this.weight  = new DraggableNumber({
    //       title:'Weight: ',
    //       value:this.sattribute.weight,
    //       min:0,
    //       max:100,
    //       callback:(value)=>self.setWeight(value)
    //   });
    
    
    
    // const tabs =this.tabs= new Tabs();
    element.append('h4').text(this.sattribute.title)
    // tabs.render(element);
    // const tab_style= tabs.addTab('style',{active:true,title:'Style'});
    const container_style = element.append('div').attr('class','container-fluid').append('div').attr('class','row')
    for(const id in this.sprogramsguis)this.sprogramsguis[id].render(container_style);
    
    
    // const tab_suit= tabs.addTab('suitability',{active:false,title:'Suitability'});
    // const container_suit = tab_suit.doms.content.append('div').attr('class','container-fluid')
    // this.attActive.render(container_suit.append('div').attr('class','row').append('div').attr('class','col-sm-12'))
    // this.weight.render(container_suit.append('div').attr('class','row').append('div').attr('class','col-sm-12'))
          
    // this.svg.render(tab_suit.doms.content)
    // this.svg.addGraph('graph1',this.graph)
    // this.graph.draw()
    return this;
  }    
}