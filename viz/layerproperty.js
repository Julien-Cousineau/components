import {LayerProperty,Parent,LContainer} from '../src/index.js';

const lcontainer = LContainer(Parent,400,300,0);


const lp =  new LayerProperty()
lp.render(lcontainer);
lp.setStyle('point','point')
lp.changeAttributes('value',{value:{title:'Value'}})