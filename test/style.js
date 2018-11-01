import Style from  '../src/style/style.js';
import Paint from  '../src/style/paint.js';
import Layout from  '../src/style/layout.js';
import StyleProgram from  '../src/style/styleprogram.js';
import StyleAttribute from  '../src/style/styleattribute.js';
import StyleLayer from  '../src/style/stylelayer.js';
import * as util from '@julien.cousineau/util';

import StyleCatalog from  '../src/stylecatalog';


const t = require('tape');
t('Style', (t) => {
    const style = new Style({id:'name',title:'title',active:true,zorder:-1});
    t.equal(style.toJSON(), '{"id":"name","title":"title","active":true,"zorder":-1}');
    t.end();
});
t('Paint', (t) => {
    const paint_1 = new Paint({_style:()=>this});
    
    t.equal(paint_1.toJSON(), '{"color":"rgba(255,255,255,1)","minmax":[0,1],"exponent":1,"gradient":{"0":"#1488ccff","1":"#2b32b2ff"},"colorbyatt":false,"opacity":1,"outlinecolor":"rgba(255,255,255,1)","cap":"butt","join":"miter","width":5,"radius":5,"blur":0}');
    const paint_2 = new Paint({_style:()=>this,color:"rgba(255,255,255,1)",minmax:[0,1],exponent:1,gradient:{"0":"#1488ccff","1":"#2b32b2ff"},colorbyatt:false,opacity:1,outlinecolor:"rgba(255,255,255,1)",cap:'butt',join:'miter',width:1,radius:1,blur:0});
    t.equal(paint_2.toJSON(), '{"color":"rgba(255,255,255,1)","minmax":[0,1],"exponent":1,"gradient":{"0":"#1488ccff","1":"#2b32b2ff"},"colorbyatt":false,"opacity":1,"outlinecolor":"rgba(255,255,255,1)","cap":"butt","join":"miter","width":1,"radius":1,"blur":0}');
    t.equal(StyleCatalog.getStyle('paint','default').toJSON(),paint_1.toJSON());
    
    t.end();
});
t('Layout', (t) => {
    const layout_1 = new Layout({_style:()=>this});
    t.equal(layout_1.toJSON(), '{"image":null,"size":null,"url":null}');
    const layout_2 = new Layout({_style:()=>this,image:"myimage",size:1,url:"myurl"});
    t.equal(layout_2.toJSON(), '{"image":"myimage","size":1,"url":"myurl"}');
    t.equal(StyleCatalog.getStyle('layout','default').toJSON(),layout_1.toJSON());
    t.end();
});

t('StyleProgram', (t) => {
    const style = new StyleProgram({id:'name',title:'title',active:true,zorder:-1,type:'circle'});
    const paint_str = '{"color":"rgba(255,255,255,1)","minmax":[0,1],"exponent":1,"gradient":{"0":"#1488ccff","1":"#2b32b2ff"},"colorbyatt":false,"opacity":1,"outlinecolor":"rgba(255,255,255,1)","cap":"butt","join":"miter","width":5,"radius":5,"blur":0}';
    const layout_str = '{"image":null,"size":null,"url":null}';
    t.equal(style.toJSON(), '{"id":"name","title":"title","active":true,"zorder":-1,"type":"circle","paint":{0},"layout":{1},"filter":null}'.format(paint_str,layout_str));

    t.equal(StyleCatalog.getStyle('program','default').toJSON(),style.toJSON());
    t.end();
});
t('StyleAttribute', (t) => {
    const style = new StyleAttribute({id:'name',title:'title',active:true,zorder:-1,attactive:true,att: [0,1,1.0,1.0]});
     
    const sprograms=JSON.stringify({
        fill:new StyleProgram({id:'My ID',title:'My Title',active:true,zorder:0,type:'fill'}).obj,
        line:new StyleProgram({id:'My ID',title:'My Title',active:true,zorder:0,type:'line'}).obj,
        circle:new StyleProgram({id:'My ID',title:'My Title',active:true,zorder:0,type:'circle'}).obj
    });
    t.equal(style.toJSON(), '{"id":"name","title":"title","active":true,"zorder":-1,"attactive":true,"att":[0,1,1,1],"sprograms":{0}}'.format(sprograms));
    t.equal(StyleCatalog.getStyle('attribute','default').toJSON(),style.toJSON());
    t.end();
});
t('StyleLayer', (t) => {
    const style = new StyleLayer({id:'name',title:'title',active:true,zorder:-1});
     
    const sattributes=JSON.stringify({
        'default':new StyleAttribute({id:'My ID',title:'My Title',active:true,zorder:0}).obj,
        'maillage':new StyleAttribute({id:'My ID',title:'My Title',active:true,zorder:0}).obj,
        'values':new StyleAttribute({id:'My ID',title:'My Title',active:true,zorder:0}).obj
    });
    console.log(style.toJSON())
    t.equal(style.toJSON(), '{"id":"name","title":"title","active":true,"zorder":-1,"sattributes":{0}}'.format(sattributes));
    t.equal(StyleCatalog.getStyle('layer','default').toJSON(),style.toJSON());
    t.end();
});