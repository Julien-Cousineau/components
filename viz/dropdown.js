import {Dropdown,Parent,LContainer} from '../src/index.js';

const lcontainer = LContainer(Parent,150,300,0);


const btn1  = new Dropdown({
    title:'BTN1',
    callback:function(value){console.log(value)},
    active:'b',
    values:{
        'a':{title:'A'},
        'b':{title:'B'},
        'c':{title:'C'},
    }

});

btn1.render(lcontainer);
