import {Tabs,Parent,BarContainer} from '../src/index.js';


const tabs1 = new Tabs({
     
});


const bc1  = new BarContainer({
});

bc1.render(Parent);
tabs1.render(bc1.bars.left.element)

