const d3 = require('../../dist/d3.min.js');
import DynamicGraph from '../dynamicgraph';

export default class GraphHistogram extends DynamicGraph {  
  constructor(options){
    super(options)
    this.histogram = d3.histogram();
   

    this.isCum = options.isCum || false;
    this.isNorm = options.isNorm || false;
    // this.isOM = options.isOM || false;
    
    this.data = options.data   || [0,1,2,3,4,5,6,7,8,9,10];
    this.nbins = options.nbins || 3;  
  }
  render(){
    super.render();
    this.getxminmax();    
    this.updateBins();
  }
  draw(){
    const {bins,x,y,extent,height,canvas} = this;
      const self=this; 
     
      const rect =canvas.selectAll("rect")       
      .remove()
      .exit()
      .data(bins);
      
      const barwidth = (!this.isflip)?'width':'height';
      const barheight = (!this.isflip)?'height':'width';
      
      const barvar = (!this.isflip)?'x':'y';
      
      rect.enter().append("rect")
        .attr("class", "bar")
        .attr(barvar, 1)
        .attr("transform", function(d) { return self.barorigin(d)})
        .attr(barwidth, function(d) {return self.barwidth(d)})
        .attr(barheight, function(d){return self.barheight(d)}); 

  
  }
  getvalue(d){
    const {axes}=this;
    
    // let zero = 0.0
    const axis = (this.isflip)?axes.y:axes.y;
    // const slope = axis.viewable[1]-axis.viewable[0];
    const min = Math.min(axis.viewable[1],axis.viewable[0])
    const max = Math.max(axis.viewable[1],axis.viewable[0])
    // zero = zero.clamp(min,max) 
    return axis.scale(this.gety(d).clamp(min,max))

  }
  barorigin(d){
    const {x,y}=this.axes
    return (!this.isflip)?"translate({0},{1})".format(x.scale(d.x0),this.getvalue(d)):
                            "translate(0,{0})".format(y.scale(d.x0)-(y.scale(d.x0) - y.scale(d.x1)-1));
  }
  barwidth(d){
    const {x,y}=this.axes;
    
    return (!this.isflip)?x.scale(d.x1) - x.scale(d.x0)-1:
                          y.scale(d.x0) - y.scale(d.x1)-1;
    
  }  
  barheight(d){
    const {x,y}=this.axes
    const axis = (!this.isflip)?y:x;
    const slope =axis.viewable[1]-y.viewable[0];
    const min = Math.min(axis.viewable[1],axis.viewable[0])
    const max = Math.max(axis.viewable[1],axis.viewable[0])
    let zero=0.0;
    zero = zero.clamp(min,max)
    const value = this.gety(d).clamp(min,max)
    // console.log(y.scale(min) - y.scale(v)-1)
    console.log(slope,x.scale(value))
    if(!this.isflip){
      return (slope>=0)?y.scale(zero) - y.scale(value):
                        y.scale(value) - y.scale(zero);
    } else {
      return x.scale(value);
    }
    
        
    // return (!this.isflip)?:
    //                       Math.abs(x.scale(value)-x.scale(min));
    // const {axes}=this;
    // let zero = 0.0
    // const axis = (this.isflip)?axes.y:axes.y;
    // const slope =axis.viewable[1]-axis.viewable[0];
    // const min = Math.min(axis.viewable[1],axis.viewable[0])
    // const max = Math.max(axis.viewable[1],axis.viewable[0])
    
    // zero = zero.clamp(min,max)
    // const value = this.gety(d).clamp(min,max)
    
    // console.log('yheight',slope,this.isflip,axis.scale(value))
    // if(this.isflip)return axis.scale(value)
    // if(!this.isflip)return axis.scale(value)
    // if(slope>=0) return axis.scale(value)-axis.scale(zero);
    // if(slope<0) return axis.scale(zero)-axis.scale(value);
    // if(slope>=0 && !this.isflip) return axis.scale(value)-axis.scale(zero);
    // if(slope<0 && !this.isflip) return axis.scale(zero)-axis.scale(value);
    // return axis.scale(zero)-axis.scale(value);
   
    
    
  }
  ytranslate(d){
    const {y,axes,height}=this;
    let zero = 0.0
    if(this.isflip)return 0;
    const axis = axes.y;
    const slope = axis.viewable[1]-axis.viewable[0];
    const min = Math.min(axis.viewable[1],axis.viewable[0])
    const max = Math.max(axis.viewable[1],axis.viewable[0])
    zero = zero.clamp(min,max) 
    const value = this.gety(d).clamp(min,max)
    // if(!self.isflip)return axis.scale(value);
    return axis.scale(value);
    // if(self.isflip)
    // return (slope<0.0)?axis.scale(zero): axis.scale(value);
    
  }
  resize(){
    super.resize();
    this.draw();
  } 
  updateBins(){
    const {nbins,min,max} = this;
    const thresholds = d3.range(nbins).map(function(d){return d*(max-min) / (nbins);});
    this.histogram.thresholds(thresholds);    
    const bins = this.bins = this.getbins(this.histogram(this.data));
    const self=this;
    this.y.scale.domain([0,d3.max(bins, function(d) {return self.gety(d)})]);
    this.y.setDomain(this.y.scale.domain())
    this.draw();
  }
  getbins(bins){
    const {isCum} = this;
    if(!isCum)return bins;
    let newbins=[];
    let binscum=[];
    for(let ibin in bins){
      const bin = bins[ibin];
      binscum=binscum.concat(bin);
      binscum.x0=bin.x0;
      binscum.x1=bin.x1;
      newbins.push(binscum);          
    }
    return newbins; 
  }
  gety(d){
    const {data,isNorm} = this;      
    if(!isNorm)return d.length;
    return d.length/data.length;     
  }
  getxminmax(){
    let min = this.data.min();
    let max = this.data.max();
    if(this.isOM){
      const _minOM = min.ordermag();
      const _maxOM = max.ordermag();
      const _rangeOM = (max-min).orderofmagnitude();           
      min=Math.floor(min/_rangeOM)*_minOM;
      max= Math.ceil(max/_maxOM)*_maxOM;
    }
    this.min = min;
    this.max = max;
    this.x.setDomain([min,max])
    this.x.scale.domain([min,max]);
   
  }
  updateData(data){
    this.getxminmax();    
    this.updateBins();
  }
  updateNBins(nbins){
    this.nbins = nbins
    this.updateBins();
    
  }

}