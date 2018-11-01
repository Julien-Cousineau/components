import Table from '../table';
import { extend } from '@julien.cousineau/util';
export default class TableNested extends Table {
    constructor(options) {
        (options)
        if(!options)options={};
        this.tables=options.tables || {};
    }
    addTable(id,table){
        this.tables[id]=table;
    }
    render(element){
        this.element = element;
        const {tables}=this;
        for(let id in tables){
            const table =tables[id];
            table.render(element)
             element.append('div').attr('class','row').style("min-height","15px")
        }
    }

    
}