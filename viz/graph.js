'use strict';
import d3 from '../dist/d3.min.js';
import {SVG,Graph,Parent,LContainer} from '../src/index.js';
const lcontainer = LContainer(Parent,100,100,10);

const svg = new SVG({
      style:{position:'absolute',padding:'0px',margin:'0px'},
      minwidth:100,
      minheight:100,
      margin:{top: 0, right: 0, bottom: 0, left: 0}});

const graph1 = new Graph({isyaxis:false,isxaxis:false,extent:[-1,-1,1,1]});
svg.render(lcontainer)
svg.addGraph('graph1',graph1)