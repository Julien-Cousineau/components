import {Input,InlineInput,Parent,LContainer} from '../build/index.js';

const lcontainer = LContainer(Parent,150,100,0);
console.log(lcontainer)
lcontainer.append('div')

const inline = InlineInput(lcontainer);

const i1 = new Input({
    title:'L :',
    type:'number',
    min:0,
    max:100,
    value:50,
    callback:(value)=>console.log(value)
    
})
const i2 = new Input({
    title:'L :',
    type:'number',
    min:0,
    max:100,
    value:50,
    callback:(value)=>console.log(value)
    
})
i1.render(inline);
i2.render(inline);