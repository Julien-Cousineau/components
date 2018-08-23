import {DropdownList,Parent,LContainer} from '../src/index.js';

const lcontainer = LContainer(Parent,150,300,0);


const btn1  = new DropdownList({
    title:'Filter',
    values:{
        a:{title:'A',isOn:true,callback:(id,isOn)=>console.log(id,isOn)},
        b:{title:'B',isOn:true,callback:(id,isOn)=>console.log(id,isOn)},
        c:{title:'C',isOn:false,callback:(id,isOn)=>console.log(id,isOn)},
    }

});

btn1.render(lcontainer);
