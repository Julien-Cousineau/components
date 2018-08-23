import {Parent,BarContainer,Header} from '../src/index.js';

const header= new Header()

const bc1  = new BarContainer({
    bars:{
        top:{isOn:true,priority:1,size:56},
        bottom:{isOn:true,priority:1},
        left:{isOn:true,priority:0},
        right:{isOn:true,priority:0}}
});

bc1.render(Parent);
header.render(bc1.bars.top.element)
