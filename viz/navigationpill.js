import {NavigationPill,Pill,NavigationPanel,Panel,Parent,LContainer} from '../src/index.js';

const lcontainer = LContainer(Parent,300,300,0);


const p1  = new Pill({id:"Pill1",active:false,ishorizontal:true,content:new NavigationPanel({
      panels:[new Panel({title:'Spatial',col:6}),
              new Panel({title:'Attributes',col:6}),
              new Panel({title:'Properties',col:6})
             ]
    })});

const p2 = new Pill({id:"Pill2",active:true,ishorizontal:true,content:new NavigationPanel({
      panels:[new Panel({title:'Interpolation',col:6}),
              new Panel({title:'Attributes',col:6}),
              new Panel({title:'Properties',col:6})
             ]
    })}) 

const np =  new NavigationPill({
    ishorizontal:true,
    pills:{p1:p1,p2:p2}
})

np.render(lcontainer);