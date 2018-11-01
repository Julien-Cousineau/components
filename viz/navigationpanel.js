import {Button,PropertyPanel,ButtonColor,GradientBtn,Checkbox,DraggableNumber,NavigationPanel,Panel,Parent,LContainer} from '../src/index.js';

const lcontainer = LContainer(Parent,400,100,0);

const panel_circle=new PropertyPanel({title:'Point',col:6})
const panel_line=new PropertyPanel({title:'Line',col:6})
const panel_fill=new PropertyPanel({title:'Fill',col:6})


const np1  = new NavigationPanel({
      panels:[panel_circle,
              panel_line,
              panel_fill,
             ]
    });

np1.render(lcontainer);


