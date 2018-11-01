
import layer from './layer.json';
import program from './program.json';
import attribute from './attribute.json';
import layout from './layout.json';
import paint from './paint.json';

import Paint from  '../style/paint.js';
import Layout from  '../style/layout.js';
import StyleProgram from  '../style/styleprogram.js';
import StyleAttribute from  '../style/styleattribute.js';
import StyleLayer from  '../style/stylelayer.js';

export default class StyleCatalog {
    constructor(){
    }
    static getStyle(type,id,isobj){
        const obj = {
            layer:{file:layer,className:StyleLayer},
            program:{file:program,className:StyleProgram},
            attribute:{file:attribute,className:StyleAttribute},
            layout:{file:layout,className:Layout},
            paint:{file:paint,className:Paint},
        };
        
        if(!obj[type])return null;
        const style = (!id || !obj[type].file[id])? obj[type].file['default']: obj[type].file[id];
        return (isobj)?style:new obj[type].className(style);
        
        
        
       
        
    }
}