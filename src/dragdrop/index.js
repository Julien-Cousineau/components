import style from './style.scss';
import * as turf from '@turf/turf'
const d3 = require('../../dist/d3.min.js');
import Selafin from '../selafin';
import {String2JSON,Buffer2SLF} from '../parser'

import { getFileExtension } from '@julien.cousineau/util';

export default class DragDrop {
    constructor(options) {
        if(!options)options={};
        this.callback = options.callback || function(){};

    }
   

    render(parent) {
        const self=this;
        const element = this.element = parent.append('div').attr('class', 'mapdragdrop');

        parent.on('dragenter', () => {
            d3.event.preventDefault()
            element.attr('class', 'mapdragdrop hover')
        });

        element.on('dragleave', () => {
                d3.event.preventDefault()
                element.attr('class', 'mapdragdrop')
            })
            .on('dragover', () => {
                d3.event.preventDefault();
                // element.attr('class','mapdragdrop hover')
            })
            .on('drop', () => {
                d3.event.stopPropagation();
                d3.event.preventDefault();
                element.attr('class', 'mapdragdrop')
                self.download()

            })

    }
    download() {
       const {callback}=this;
        const reader = new FileReader();
        reader.onload = function(event) {
            const filename = event.target.fileName;
            if(getFileExtension(filename)=='json' || getFileExtension(filename)=='geojson' )return callback(filename,'geojson',String2JSON(event.target.result,{}));
            if (getFileExtension(filename)=='slf')return callback(
              {
                id:filename.replace(/\s/g, ''),
                slayer:'debug-slf',
                name:filename,
                type:'slf',
                source:{type:'slf',data:new Selafin(event.target.result,{keepbuffer:1})}
              });
            throw new Error("FileType not known")
            

            
        };
        reader.fileName = d3.event.dataTransfer.files[0].name;
        if(getFileExtension(reader.fileName)=='json' || getFileExtension(reader.fileName)=='geojson' )reader.readAsText(d3.event.dataTransfer.files[0]);
        if(getFileExtension(reader.fileName)=='slf')reader.readAsArrayBuffer(d3.event.dataTransfer.files[0]);
        
        
    }
}
