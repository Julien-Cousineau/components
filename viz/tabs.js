'use strict';
import d3 from '../dist/d3.min.js';
import {Tabs,Parent,LContainer,Button,StyleGUIProgram,SVG,GraphSuit,DraggableNumber} from '../src/index.js';
const lcontainer = LContainer(Parent,400,400,0);

const button1 = new Button();
const button2 = new Button();
const button3 = new Button();

const tabs = new Tabs();
tabs.render(lcontainer);
const tab1= tabs.addTab('info',{active:true,title:'Info'})
const tab2= tabs.addTab('style',{active:false,title:'Style'})
const tab3= tabs.addTab('suitability',{active:false,title:'Suitability'})

// 
const container = tab1.doms.content.append("div")
                              .attr('class','container-fluid')
                              
const row =container.append("div")
                  .attr('class','row');
                  
                  row.append("div")
                  .attr('class','col-sm-6')
                  .append("p").attr('class','small')
                  .text('Name of Attribute')
                  row.append("div")
                  .attr('class','col-sm-6')
                  .append("p").attr('class','small')
                  .text('{Name of Attribute}')                  
                              

const stylegui  = new StyleGUIProgram({});
const svg = new SVG({
      style:{position:'absolute',padding:'0px',margin:'0px'},
      minwidth:400,
      minheight:400,
      margin:{top: 10, right: 10, bottom: 50, left: 50}});
const graph1 = new GraphSuit(
      {isxaxisminmax:true,
      isyaxisminmax:true,
      xscale:{axis:'x',show:true,type:'scaleLinear',minmax:[0,20],editable:false,label:"Distance,m"},
      yscale:{axis:'y',show:true,type:'scaleLinear',minmax:[0,1],editable:false,label:"Suitability"},
      callbacks:{update:(top,bottom,p)=>console.log(top,bottom,p)}
      });
// button1.render(tab1.doms.content)
const container2 = tab3.doms.content.append("div")
                              .attr('class','container-fluid')
const row2 = container2.append("div")
                              .attr('class','row').append('div').attr('class','col-sm-12')
const dn1  = new DraggableNumber({
    title:'Weight: ',
    value:0,
    min:0,
    max:100,
    callback:(value)=>console.log('dn1',value)
});

dn1.render(row2)
stylegui.render(tab2.doms.content)
const row3 = container2.append("div")
                              .attr('class','row')
svg.render(row3)
svg.addGraph('graph1',graph1)
graph1.draw()

