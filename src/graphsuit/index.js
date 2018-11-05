const d3 = require('../../dist/d3.min.js');
import GraphLine from '../graphline';
import Slider from '../slider';
import SVG from '../svg';
import Graph from '../graph';

export default class GraphSuit extends GraphLine {  
  constructor(options){
    super(options)
    const top   = this.top=options.top || 1;
    const bottom= this.bottom=options.bottom || 0;
    const p     = this.p=options.p ||1;
    const xmin  = this.xmin=options.xmin ||0;
    const xmax  = this.xmax=options.xmax ||100;
    const xstep = this.xstep=options.xstep ||1;

    
    
    
    const self=this;
    const tslider = this.tslider=new Slider({
          value:top,
          r:5,
          type:'x',
          con:'end',
          isexterior:true,
          isinterior:true,
          iscursor:true,
          iscursorcircle:true,
          callbacks:{value:(value)=>self.setTop(value)}}
          );
    const bslider = this.bslider=new Slider({
          value:bottom,
          r:5,
          type:'x',
          con:'start',
          isexterior:true,
          isinterior:true,
          iscursor:true,
          iscursorcircle:true,
          callbacks:{value:(value)=>self.setBottom(value)}}
          );
     
     
      
      this.psvg = new SVG({
      style:{position:'absolute',padding:'0px',margin:'0px'},
      minwidth:100,
      minheight:100,
      margin:{top: 10, right: 50, bottom: 10, left: 0}});

      this.pgraph = new Graph({yscale:{
        axis:'y',
        show:true,
        flipaxisdirection:true,
        axisposition:1,
        minmax:[0.1,10],
        viewable:[0.1,10],
        type:'scalePow',
        pars:{exponent:0.1}
      },isyaxis:true,isxaxis:false});
 
   
   
   
    const pslider = this.pslider=new Slider({
          value:p,
          r:5,
          type:'y',
          con:'end',
          offset:-10,
          isexterior:true,
          isinterior:true,
          iscursor:true,
          iscursorcircle:true,
          callbacks:{value:(value)=>self.setP(value)}}
          );
    
    
    
    
          
  }
  setTop(value){this.top=value;this.update()}
  setBottom(value){this.bottom=value;this.update()}
  setP(value){this.p=value;this.update()}
  render(){
    super.render();

    this.addLine('line',[[0,0],[1,1]])
    
    const pelement = this.element.append('div')
    .style('position','relative')
    .style('width','125px')
    .style('top','20px')
    .style('left','20px')
    .style('height','100px')
    
    
    

    this.psvg.render(pelement);
    this.psvg.addGraph('slider',this.pgraph);
    this.pgraph.addSlider('p',this.pslider);

    this.addSlider('top',this.tslider);
    this.addSlider('bottom',this.bslider);
    this.setDomain([this.xmin,this.xmax])
    this.updateLine();
    this.pgraph.draw();

  }
  draw(){
    super.draw();
  }
  update(){
    this.updateLine();
    this.draw();
    if(this.callbacks.update)this.callbacks.update(this.bottom,this.top,this.p);
  }
  updateLine(){
    const {x,top,bottom,p}=this;
    const viewablex = this.axes.x.viewable;
    const viewabley = this.axes.y.viewable;
    const    n = 100,
          vmin = Math.min(top,bottom),
          vmax = Math.max(top,bottom),
           dir = (top < bottom)? -1: 1,
         range = ((vmax - vmin)<1E-6) ? 1E-6:(vmax - vmin),
          step = range / (n-1);
   
    const  data = [],
          start = [viewablex[0],(top >= bottom)?viewabley[0]:viewabley[1]],
            end = [viewablex[1],(top >= bottom)?viewabley[1]:viewabley[0]];


    data.push(start);
    for (var i = 0; i < n; i++){
      const x = vmin + (i*step);
      const norm = ((x-vmin)/range).clamp(0,1);
    
      let y = Math.max(norm*dir,(dir*-1.0) - norm);
      y=Math.pow(y,p);
      data.push([x,y]);
    };    
    data.push(end);
    
    this.lines['line'].data=data;
    
  }
  setDomain(minmax){
    this.axes.x.setDomain(minmax);
    this.tslider.draw();
    this.bslider.draw();
    this.draw();
  }
  
 
  
  
}