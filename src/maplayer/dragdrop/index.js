import style from './style.scss';
import * as turf from '@turf/turf'
const d3 = require('../../../dist/d3.min.js');


function humanFileSize(size) {
    var i = Math.floor(Math.log(size) / Math.log(1024));
    return Math.round(100 * (size / Math.pow(1024, i))) / 100 + ' ' + ['B', 'kB', 'MB', 'GB'][i];
}


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
            console.log('data size', humanFileSize(event.target.result.length));
            console.time('JSON.parse');
            const data = JSON.parse(event.target.result);
            console.timeEnd('JSON.parse');
            const name =event.target.fileName;
            callback(name,data);
        };
        reader.fileName = d3.event.dataTransfer.files[0].name;
        reader.readAsText(d3.event.dataTransfer.files[0]);
    }
}
