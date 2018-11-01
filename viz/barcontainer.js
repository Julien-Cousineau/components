import {Tabs,Parent,BarContainer} from '../src/index.js';


const tabs1 = new Tabs({
     
});


const bc1  = new BarContainer({
    bars:{
        top:{isOn:true,priority:1,size:250,shadow:5},
        bottom:{isOn:false,priority:1,size:0.0},
        left:{isOn:false,priority:0,size:0.0},
        right:{isOn:false,priority:0,size:0.0}}
});

bc1.render(Parent);
tabs1.render(bc1.bars.left.element)

