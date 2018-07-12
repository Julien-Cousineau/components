import {NavigationPanel,Panel,Parent,LContainer} from '../src/index.js';

const lcontainer = LContainer(Parent,300,100,0);


const np1  = new NavigationPanel({
      panels:[new Panel({title:'Spatial',col:6}),
              new Panel({title:'Attributes',col:6}),
              new Panel({title:'Properties',col:6})
             ]
    });

np1.render(lcontainer);