'use strict';
const SVG = require('./svg');
const Graph = require('./graph.js');
const {transparencyBackground} = require('./d3util.js');

module.exports = class ColorGradient {
    constructor(options){
        if(!options)options={};
        this.sliders = options.sliders || {};
        this.padding = options.padding || 8;
        this.width = options.width || 20;
        this.height = (options.height-this.padding) || 200;
        this.background = options.background || 'linear-gradient(rgb(255, 226, 89), rgb(255, 167, 81))';
    
        this.svg = new SVG({
            style:{position:'absolute',padding:this.padding+'px',margin:-this.padding+'px'},
            minwidth:this.width,minheight:this.height,
            margin:{top: 0, right: 0, bottom: 0, left: 0}});
        this.graph = new Graph({isyaxis:false,isxaxis:false});
    
    }
    render(element){
        if(!element)throw new Error("ColorGradient needs an element to render");
        const {svg,graph,padding,height,width,sliders,background}=this;
        const bsize =6;
    
        const dom = this.dom=element
            .append('div')
            .style('float','left')
            .style('width',(width+2*padding)+'px')
            .style('height',(height+2*padding)+'px')
            .append('div')
            .style('position','absolute')
            .style('height',height+'px')
            .style('margin',padding + 'px')
            .style('width',width+'px');
        this.gradientb = dom.append('div')
            .style('position','absolute')
            .style('box-sizing','content-box')
            .style('width', (width-2)+'px')
            .style('height', height-2+'px')
            .style('background', transparencyBackground)
            .style('background-size', '{0}px {0}px'.format(bsize))
            .style('background-position', '0 0, 0 {0}px, {0}px -{0}px, -{0}px 0px'.format(bsize*0.5));
      
        this.gradient = this.gradient=dom.append('div')
            .style('position','absolute')
            .style('box-sizing','content-box')
            .style('border', '1px solid black')
            .style('border-radius', '5px')
            .style('background', background)    
            .style('width', (width-2)+'px')
            .style('height', height-2+'px');
   
        svg.render(dom);    
        svg.addGraph('graph',graph);
        const self=this;
        for(let id in sliders){
            const slider = sliders[id];
            if(slider.rgba){
                slider.callbacks.updategradient=function(){self.changeBackgroundfromSliders();};
                slider.callbacks.value=function(){self.changeBackgroundfromSliders();};
            }
            graph.addSlider(id,slider);
        }
        if(sliders)this.changeBackgroundfromSliders();
    }
    changeBackground(background){
        this.gradient.style('background',background);
    }
    changeBackgroundfromSliders(){
        const {sliders}=this;
        const array=[];
        for(let id in sliders){
            const slider=sliders[id];
            slider.id = id;
            if(slider.rgba){
                array.push(slider);
            }
        }
        array.sort(function(a, b) {return b.value - a.value;});
        const strstr = array.map(slider=>{
      
            const {r,g,b,a}=slider.rgba;
            return 'rgba({0},{1},{2},{3}) {4}%'.format(r,g,b,a,(1-slider.value)*100);
    
        });
        if(strstr.length>0){      
            this.changeBackground('linear-gradient({0})'.format(strstr.join(',')));  
        }
    
    }
};