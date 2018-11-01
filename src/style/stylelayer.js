import {extend} from '@julien.cousineau/util';
import Style from './style.js';
import StyleAttribute from './styleattribute.js';

const d3 = require('../../dist/d3.min.js');

// import Panel from './panel.js';
export default  class StyleLayer extends Style  {
  constructor(options){
    super(options);
    options=options||{};
    this.sattributes = StyleLayer.template(options.sattributes);
    this.activeatt = options.activeatt|| null;
    this.category = options.category || 'general';
    this.type = options.type || 'point';
    this.refsource = options.refsource || 'unknown';
    this.htmltext = options.htmltext || 'Sample Here'
    this.description = options.description || 'description';
    const self=this;
    for(let id in this.sattributes)this.sattributes[id]._slayer = ()=>self;
    
    
  }
  get obj(){
    const {sattributes,activeatt}=this;
    const _sattributes = {};
    for(const id in sattributes)_sattributes[id]=sattributes[id].obj;
    return extend(super.obj,{activeatt:activeatt,sattributes:_sattributes});
  }
  toJSON(){return JSON.stringify(this.obj)}
  
  static template(obj){
    obj = obj || {};
    let array = {};
    for(const id in obj)array[id]=new StyleAttribute(obj[id]);
    if(!array)array ={'default':new StyleAttribute(obj.default || {})};
    return array;
    
  }
  getSAttribute(id){
    if(!this.sattributes[id])return null;
    return this.sattributes[id];
  }
  addSAttribute(id,obj){this.sattributes[id]=new StyleAttribute(obj)}
  
  getLegendSymbol(element){
    const {type}=this;
    if(type=='line'){
      const paint = this.getSAttribute('default').getSProgram('line').paint;
      let svg = element.append('svg');
      svg.attr('height',10).attr('width',30).append('line').attr('x1',5).attr('y1',5).attr('x2',25).attr('y2',5).style('stroke',paint.color).style('stroke-width',paint.width)
      return this;
    }
    if(type=='point'){
      const paint = this.getSAttribute('default').getSProgram('circle').paint;
      let svg = element.append('svg');
      if(!paint.colorbyatt)return svg.attr('height',16).attr('width',16).append('circle').attr('cx',8).attr('cy',8).attr('r',6).attr('stroke','black').attr('stroke-width',1).attr('fill',paint.color).node()
      
      const data = [{r:3,cx:8,cy:4,c:paint.gradient.interpolate(0)},{r:4,cx:8,cy:13,c:paint.gradient.interpolate(0.5)},{r:5,cx:8,cy:24,c:paint.gradient.interpolate(1)}]
      let circles = svg.attr('height',30).attr('width',16)
                      .selectAll("circle")
                      .data(data)
                      .enter()
                      .append("circle")
                      .attr("cx", function (d) { return d.cx; })
                      .attr("cy", function (d) { return d.cy; })
                      .attr("r", function (d) { return d.r; })
                      .style("fill", function(d) { return d.c; });
      return this;
      
      
    }
    if(type=='symbol'){
      // let img = d3.select(document.createElementNS('img', "img"));
      let img = element.append('img').attr('src',this.getSAttribute('default').getSProgram('symbol').layout.url);

      return this;
      // return img
    }
    return '';
  }

}