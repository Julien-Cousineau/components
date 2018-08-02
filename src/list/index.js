'use strict';
const $ =require('jquery')
const dt = require('../../dist/datatables.min.js');
import style from './style.scss';

export default  class List {
  constructor(options){
      this.columns = options.columns || {name:"name",}
                    
  }
  render(element){
    
  }
}

