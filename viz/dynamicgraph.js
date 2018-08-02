'use strict';
import d3 from '../dist/d3.min.js';
import {SVG,DynamicGraph,Parent,LContainer} from '../src/index.js';
const lcontainer = LContainer(Parent,400,400,10);

const svg = new SVG({
      style:{position:'absolute',padding:'0px',margin:'0px'},
      minwidth:100,
      minheight:100,
      margin:{top: 10, right: 10, bottom: 30, left: 30}});

const graph1 = new DynamicGraph(
      {isxaxisminmax:true,
      isyaxisminmax:true,
      xscale:{axis:'x',show:true,type:'scaleLinear',minmax:[0,20],editable:true},
      yscale:{axis:'y',show:true,type:'scaleLinear',minmax:[0,1],editable:true},
      extent:[0,0,10,10]
      });
svg.render(lcontainer)
svg.addGraph('graph1',graph1)