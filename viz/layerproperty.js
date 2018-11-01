import {LayerProperty,Parent,LContainer,Layer} from '../src/index.js';

const lcontainer = LContainer(Parent,400,300,0);

const layers={
  layer1:new Layer({id:'layer1',type:'point'}),
  layer2:new Layer({id:'layer2',type:'line'}),
  layer3:new Layer({id:'layer3',type:'polygon'}),
  layer4:new Layer({id:'layer4',type:'mesh'})
}

const lp =  new LayerProperty({
    _layers:()=>layers,
    activeid:'layer3',
    callbacks:{
      setRStyle:(style)=>console.log('callback answer=',style),
      setActive:(value)=>console.log('callback answer=',value),
      changePointSize:(size)=>console.log('callback answer=',size),
      changeLineSize:(size)=>console.log('callback answer=',size),
      changeIsoSize:(size)=>console.log('callback answer=',size),
        
    }
})
lp.render(lcontainer);
// lp.setStyle('point','point')
// lp.changeAttributes('value',{value:{title:'Value'}})