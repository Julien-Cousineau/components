const d3 = require('../../dist/d3.min.js');
import Graph from '../graph';
export default class GraphLine extends Graph {
  constructor(options){
    super(options)
    this.lines={};
       
  }
  addLine(id,data){
    const {canvas}=this;
    const self=this;
    this.lines[id]={
      data:data,
      f:d3.line().x(function(d) {return self.x(d[0])})
                 .y(function(d) {return self.y(d[1])}),
      dom:canvas.append('path')
            .attr('stroke', '#000000')
            .attr('stroke-width', 3)
            .attr('fill', 'none')
    };
    const minx = data.map(item=>item[0]).min()
    const maxx = data.map(item=>item[0]).max()
    const miny = data.map(item=>item[1]).min()
    const maxy = data.map(item=>item[1]).max()
    this.axes.x.setDomain([minx,maxx])
    this.axes.y.setDomain([miny,maxy])
    return this.lines[id].dom;
  }
  draw(){
    super.draw();
    const {lines} = this;

    for(let id in lines){
        const {data,f,dom}=lines[id];
        // TODO: Check if line is inside domain
        dom.attr('d',f(data));  
    }
  }
}