//eslint-disable no-unused-vars
'use strict';
const d3 = require('d3');
const SVG = require('./svg.js');
const Graph = require('./graph.js');
const Popover = require('./popover.js');
const Input = require('./input.js');
const Slider = require('./slider.js');
const ColorGradient = require('./colorgradient.js');

const {hex2rgb,rgb2hsv,rgb2hex,hsv2rgb,extend} = require('@julien.cousineau/util');
const {debounceD3Event,transparencyBackground} = require('./d3util.js');

module.exports = class Picker extends Popover {
    constructor(options){
        if(!options)options={};
        options.header = false;
        options.height = 300;
        super(options);  
        const res     = this.res     = options.res || 190;
        const pad     = this.pad     = options.pad || 10;
        // const padding = this.padding = options.padding || 0;
        const r  = this.r = options.r || 10;
        const sr = this.sr = options.sr || 6;
        this.bsize = options.bsize || 10;
    
        const rgba         = this.rgba         = options.rgba || {r:150,g:24,b:45,a:0.5};
        const hsv         = this.hsv         = rgb2hsv(rgba);    
        const brightness   = this.brightness   = hsv.v;
        const transparency = this.transparency = rgba.a;
        const halfres      = this.halfres      = res*0.5;
        this.callback =options.callback || function(){};
    
        [this.cx,this.cy]=this.rgba2xy(rgba);
        const self=this;
        this.inputs = {
            hex:new Input({title:'# : ',type:'text',value:rgb2hex(rgba),callback:value=>{self.updateHEX({hex:value});}}),
            a:new Input({title:'A :',type:'number',min:0,max:100,value:rgba.a*100,margin:'0 0.5rem 0 2.75rem',callback:(value)=>{self.updateRGBA({a:parseFloat(value)/100.0});}}),
            h:new Input({title:'H :',type:'number',min:0,max:360,value:hsv.h,callback:(value)=>{self.updateHSV({h:parseFloat(value)});}}),
            s:new Input({title:'S :',type:'number',min:0,max:100,value:hsv.s,callback:(value)=>{self.updateHSV({s:parseFloat(value/100.0)});}}),
            v:new Input({title:'L :',type:'number',min:0,max:100,value:hsv.v,callback:(value)=>{self.updateHSV({v:parseFloat(value/100.0)});}}),
            r:new Input({title:'R :',type:'number',min:0,max:255,value:rgba.r,callback:(value)=>{self.updateRGBA({r:parseFloat(value)});}}),
            g:new Input({title:'G :',type:'number',min:0,max:255,value:rgba.g,callback:(value)=>{self.updateRGBA({g:parseFloat(value)});}}),
            b:new Input({title:'B :',type:'number',min:0,max:255,value:rgba.b,callback:(value)=>{self.updateRGBA({b:parseFloat(value)});}}),
        };    
    
    
    
    
        const brighness_slider = this.brighness_slider  = {
            s1: new Slider({value:brightness,r:sr,type:'y',con:'mid',isexterior:false,isinterior:false,iscursor:true,callbacks:{value:(value)=>self.changeBrightness(value),color:()=>console.log('s1')}}),
        };

        const transparency_slider = this.transparency_slider  = {
            s1: new Slider({value:transparency,r:sr,type:'y',con:'mid',isexterior:false,isinterior:false,iscursor:true,callbacks:{value:(value)=>self.changeTransparency(value),color:()=>console.log('s1')}}),
        };
        const cgb = this.cgb = new ColorGradient({height:(res-pad),width:10,sliders:brighness_slider});
        const cgt = this.cgt = new ColorGradient({height:(res-pad),width:10,sliders:transparency_slider});
    
        const svg = this.svg = new SVG({style:{position:'absolute',padding:'10px',margin:'-10px'},minwidth:res,minheight:res,margin:{top: 0, right: 0, bottom: 0, left: 0}});
    
        const graph = this.graph = new Graph({isyaxis:false,isxaxis:false,extent:[-1,-1,1,1]});
    
        const ondrag = function(d){
            const [_x,_y]= d3.mouse(this);
            const x=graph.x.invert(_x),
                y=graph.y.invert(_y);
            const r=Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)).clamp(0,1);
            const theta=Math.atan2(y,x);
            const newx=r*Math.cos(theta),
                newy=r*Math.sin(theta);           
            self.updateHue(graph.x(newx),graph.y(newy));
        };  
    
        const d3drag = this.d3drag = d3.drag()
            .on("start",debounceD3Event(ondrag,10))
            .on("drag",debounceD3Event(ondrag,10))
            .on("end",debounceD3Event(ondrag,10));
    }
    rgba2str(rgba){
        const {r,g,b,a}=rgba;
        return 'rgba({0},{1},{2},{3})'.format(r,g,b,a); 
    }
    hsv2str(hsva){
        const {h,s,v,a}=hsva;
        return 'hsla({0},{1}%,{2}%,{3})'.format(h,s*100,v*100,a); 
    }
    updateCircle(){
        const {circle,bcircle,rgba}=this;
    
        this.callback(rgba);
        const [cx,cy] =[this.cx,this.cy]=this.rgba2xy(rgba);   
        circle.attr("cx", cx)
            .attr("cy", cy)
            .style('fill',this.rgba2str(rgba));
        bcircle.attr("cx", cx)
            .attr("cy", cy)
            .style('fill','#fff');
    }
    updateHEX(hex){
        const {inputs}=this;
        this.rgba = extend(this.rgba,hex2rgb(hex.hex));  
        const hsv = this.hsv = rgb2hsv(this.rgba);
        this.changeInputs(hex);
        this.updateCircle();
        this.changeSliderBackground();
        this.draw();
    }
    updateRGBA(newrgba,isslider){
        for (let i in newrgba) this.rgba[i] = newrgba[i];  
        const {inputs,rgba}=this;
        const hsv = this.hsv = rgb2hsv(rgba);
        (isslider)?this.changeInputs():this.changeInputs(newrgba);
        this.updateCircle();
        this.changeSliderBackground();
        this.draw();
    }
    updateHSV(newhsv,isslider){
        for (let i in newhsv) this.hsv[i] = newhsv[i];
        const {inputs,rgba,hsv}=this;    
        this.rgba = extend(rgba,hsv2rgb(hsv));       
        (isslider)?this.changeInputs():this.changeInputs(newhsv);
        this.updateCircle();
        this.changeSliderBackground();
        this.draw();    
    }
    changeInputs(newinputs){
        if(!newinputs)newinputs={};
        const {inputs,rgba,hsv}=this;
        const brightness = this.brightness   = hsv.v;
        const transparency = this.transparency = rgba.a; 
        if(!newinputs.hex)inputs.hex.input.node().value=rgb2hex(rgba);
        if(!newinputs.r)inputs.r.input.node().value=parseInt(rgba.r);
        if(!newinputs.g)inputs.g.input.node().value=parseInt(rgba.g);
        if(!newinputs.b)inputs.b.input.node().value=parseInt(rgba.b);
        if(!newinputs.a)inputs.a.input.node().value=parseInt(rgba.a*100);
        if(!newinputs.h)inputs.h.input.node().value=parseInt(hsv.h);
        if(!newinputs.s)inputs.s.input.node().value=parseInt(hsv.s*100);
        if(!newinputs.v)inputs.v.input.node().value=parseInt(hsv.v*100);
        this.changePreview();
    
    }
    updateHue(_x,_y){
        const {circle,bcircle,inputs}=this;
        const x = this.cx =_x || this.cx;
        const y = this.cy =_y || this.cy;
        const rgba = this.rgba = this.xy2rgba(x,y);
        const hsv = this.hsv = rgb2hsv(rgba);
    
        this.changeInputs();       
        this.updateCircle();
        this.changeSliderBackground();
    }  
    changeBrightness(value){
        this.updateHSV({v:value},true);  
    }
    changeTransparency(value){    
        this.updateRGBA({a:value},true);  
    }
  
    changeSliderBackground(){
        const {cgb,cgt,rgba,hsv2str,brightness,transparency,brighness_slider,transparency_slider}  =this;
        brighness_slider.s1.changeValue(brightness);
        transparency_slider.s1.changeValue(transparency);
        const hsv = rgb2hsv(rgba);
        const v= (hsv.h==0)?1.0:0.5;    
        cgb.changeBackground("linear-gradient({0}, #000)".format(hsv2str(extend(hsv,{s:1,v:v,a:1}))));     
        cgt.changeBackground("linear-gradient({0}, {1})".format(hsv2str(extend(hsv,{s:1,v:v,a:1})),hsv2str(extend(hsv,{a:0})))); 
    
    }
    render(element){
        if(!element)throw new Error("Picker needs a element to draw");
        super.render(element);
        const {res,pad,cgb,cgt,graph,r,svg,d3drag,bsize,content}=this;
        const self=this;
    
    
        const canvasp = content.append('div')
            .style('padding',pad +'px')
            .append('div')
            .style('float','left')
            .style('height',res +'px')
            .style('width',res +'px')
            .style('margin-right',pad +'px');

        const _col =  canvasp
            .append('div')
            .style('height',res+'px')
            .style('width',res+'px');
        const canvas =this.canvas = _col
            .append('canvas')
            .style('position','absolute') 
            .attr('height',res)
            .attr('width',res)
            .style('background', transparencyBackground)
            .style('background-size', '{0}px {0}px'.format(bsize))
            .style('background-position', '0 0, 0 {0}px, {0}px -{0}px, -{0}px 0px'.format(bsize*0.5));
   
        svg.render(_col);
        svg.addGraph('graph',graph); 
    
        this.bcircle = graph.svg.append("circle")   
            .style('stroke', 'rgb(255, 255, 255)')
            .style('stroke-width', '2px')
            .style('fill','#fff')
            .attr("r", r + 'px'); 
      
        this.circle = graph.svg.append("circle")   
            .style('stroke', 'rgb(255, 255, 255)')
            .style('stroke-width', '2px')
            .attr("r", r + 'px');
    
        graph.svg.call(d3drag);
        cgb.render(content);
        cgt.render(content);
        this.inputgui(content);
    
        const previewc =content.append('div')
            .style('float','left');
        this.previewb = previewc.append('div')  
            .style('position','absolute')
            .style('background', transparencyBackground)
            .style('background-size', '{0}px {0}px'.format(bsize))
            .style('background-position', '0 0, 0 {0}px, {0}px -{0}px, -{0}px 0px'.format(bsize*0.5))
            .style('width', '45px')
            .style('height', '45px')
            .style('margin', '16px 0px 16px 10px')
            .style('border-radius', '45px')
            .style('border', '1px solid #fff');
        this.preview = previewc.append('div')   
            .style('position','absolute')
            .style('background','red')
            .style('width', '45px')
            .style('height', '45px')
            .style('margin', '16px 0px 16px 10px')
            .style('border-radius', '45px');

    
    
    
        const ctx = this.ctx = canvas.node().getContext('2d');
        this.bitmap = ctx.getImageData(0, 0, res, res);
        this.draw();
    
    }
    changePreview(){
        const {rgba,preview,rgba2str}=this;
        preview.style('background',rgba2str(rgba));
    }
    inline(element){
        return element.append('div')
            .attr('class','form-inline')
            .style('margin','5px 0')
            .style('font-size','0.75rem');
    }
    inputgui(container){
        const {inline,createinput,inputs}=this;
        const col = container.append('div').style('float','left');

    
    
        const i1= inline(col);
        const i2= inline(col);
        const i3= inline(col);       
        inputs.hex.render(i1);
        inputs.a.render(i1);      
        inputs.h.render(i2);
        inputs.s.render(i2);
        inputs.v.render(i2);   
        inputs.r.render(i3);
        inputs.g.render(i3);
        inputs.b.render(i3);
    

    }


    xy2rgba(x,y,trim){
        let {halfres,brightness,transparency} = this;
        let midy = y-halfres;
        let midx = x-halfres;
        let hue = 180 + Math.atan2(midy,midx) * (180 / Math.PI);
        let saturation = Math.sqrt(Math.pow(midx, 2) + Math.pow(midy, 2)) / halfres;
        let outside = (saturation>1.01);
    
        let a = outside?1:transparency;
        if(trim)brightness=outside?1:brightness;
        if(trim)saturation=outside?0:saturation;    
        saturation = Math.min(1,saturation);
        const rgba=hsv2rgb({h:hue, s:saturation, v:brightness});
        rgba.a=a;
        return rgba;
    }
    hsv2xy(hsv){
        const {halfres}=this;
        const {h,s,v}=hsv;
        let x = (s*halfres) * Math.cos((h-180.0) * (Math.PI /180.0))+halfres;
        let y = (s*halfres) * Math.sin((h-180.0) * (Math.PI /180.0))+halfres;
        return [x,y];
    }
    rgba2xy(rgba){
        let hsv = rgb2hsv(rgba);
        return this.hsv2xy(hsv);
    }
    draw(){
        const {res,halfres,ctx,bitmap} = this;    
        for (let y = 0; y < res; y++) {
            for (let x = 0; x < res; x++) {
                let rgba = this.xy2rgba(x,y,true);        
                let offset = 4 * ((y * res) + x);
                bitmap.data[offset + 0] = rgba.r;
                bitmap.data[offset + 1] = rgba.g;
                bitmap.data[offset + 2] = rgba.b;
                bitmap.data[offset + 3] = rgba.a*255;
            }
        }
        // draw perfect circle
        ctx.putImageData(bitmap, 0, 0);
        ctx.beginPath();
        ctx.arc(halfres+0.5,halfres+0.5,(halfres+1),0,2*Math.PI);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#ffffff';  
        ctx.stroke();
        ctx.closePath();
        this.updateHue();
    }
};