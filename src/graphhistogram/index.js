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
      rect.enter().append("rect")
        .attr("class", "bar")
        .attr("x", 1)
        .attr("transform", function(d) {return "translate(" + x(d.x0) + "," + self.ytranslate(d) + ")"; })
        .attr("width", function(d) { return x(d.x1) - x(d.x0)-1 ; })
        .attr("height", function(d){return self.yheight(d)}); 

  
  }
  yheight(d){
    const {y,extent}=this;
    let zero = 0.0
    const slope = extent[3]-extent[1];
    const min = Math.min(extent[3],extent[1])
    const max = Math.max(extent[3],extent[1])
    
    zero = zero.clamp(min,max)
    const value = this.gety(d).clamp(min,max)
    return (slope>=0)?y(zero)-y(value):y(value)-y(zero);
    
  }
  ytranslate(d){
    const {y,extent,height}=this;
    let zero = 0.0
    const slope = extent[3]-extent[1];
    const min = Math.min(extent[3],extent[1])
    const max = Math.max(extent[3],extent[1])
    zero = zero.clamp(min,max) 
    const value = this.gety(d).clamp(min,max)
    return (slope<0.0)?y(zero): y(value);
    
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
    this.y.domain([0,d3.max(bins, function(d) {return self.gety(d)})]);
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
    this.x.domain([min,max])
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