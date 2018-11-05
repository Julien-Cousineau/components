import {Gradient,SVG,Graph,LContainer,Tooltip,GradientPalette,Slider} from '../index.js'
const {transparencyBackground} = require('../d3util');
const d3 = require('../../dist/d3.min.js');
export default class GradientBtn {
  constructor(options){
    options = options || {};
    this.gradient = options.gradient || Gradient.parseName("Skyline");  
    this.minmax = options.minmax || [0,100];
    this.exponent = options.exponent || 1.0;
    this.padding = options.padding || 8;
    this.width = options.width || 20;
    this.disabled = (typeof options.disabled=='undefined')?true:options.disabled;
    this.left =options.left || 0;
    this.height = (options.height-this.padding) || 200;
    const callbacks = this.callbacks = options.callbacks || {};
    this.svg = new SVG({
      style:{position:'absolute',padding:this.padding+'px',margin:-this.padding+'px'},
      minwidth:this.width+40,minheight:this.height-10,
      margin:{top: 10, right: 40, bottom: 10, left: 0}});
    const tooltip = this.tooltip = new Tooltip();
    this.graph = new Graph({
      isyaxis:true,isxaxis:true,
      yscale:{axis:'y',show:true,editable:!this.disabled,type:'scalePow',minmax:this.minmax,pars:{exponent:this.exponent},axisposition:1,flipaxisdirection:true,callbacks:callbacks},
      xscale:{axis:'x',show:false,type:'scaleLinear',minmax:[0,1]}
    });
    
    
    
    const self=this;
    this.cp  = new GradientPalette({callback:(gradient)=>{
        tooltip.remove();
        if(callbacks.gradient)callbacks.gradient(gradient)
        self.gradient = gradient;
        self.gradientdom.style('background', gradient.background) 
      }});
    
  }
  setGradient(gradient){
      this.gradient=gradient;
      
      
  }

  render(element){
    this.element = element;
    const {svg,graph,padding,height,width,gradient}=this;
    
    
    const dom = this.dom=LContainer(element,width+40,height,padding);
    if(this.left)dom.style('left',this.left+"px").style('position','relative');
    const bsize =6;
    this.gradientbackgrounddom = dom.append('div')
    .style('position','absolute')
    .style('top','10px')
    .style('box-sizing','content-box')
    .style('width', (width-2)+'px')
    .style('height', (height-22)+'px')
    .style('background', transparencyBackground)
    .style('background-size', '{0}px {0}px'.format(bsize))
    .style('background-position', '0 0, 0 {0}px, {0}px -{0}px, -{0}px 0px'.format(bsize*0.5))
   
    svg.render(dom);    
    svg.addGraph('graph',graph);

    this.gradientdom=dom.append('div')
    .style('position','absolute')
    .style('top','10px')
    .style('box-sizing','content-box')
    .style('border', '1px solid black')
    .style('border-radius', '5px')
    .style('background', gradient.background)    
    .style('width', (width-2)+'px')
    .style('height', (height-22)+'px')
    if(!this.disabled)this.gradientdom.style('cursor','pointer');
    
    if(!this.disabled)this.gradientdom.on("click",()=>this.showGradientPalette())
   return this;
    
    
    
  }
  showGradientPalette(){
    this.cp.render(this.tooltip.show(d3.event))
  }
}
