import {Parent,BarContainer,Header} from '../src/index.js';
import logo from './data/img/sig-eng.png'
import banner from './data/img/banner.png'


const header= new Header({subheader:true,banner:banner,title:"BC Marine Energy Atlas (BETA)"})

const bc1  = new BarContainer({
    bars:{
        top:{isOn:true,priority:1,size:100,shadow:5},
        bottom:{isOn:false,priority:1,size:0.0},
        left:{isOn:false,priority:0,size:0.0},
        right:{isOn:false,priority:0,size:0.0}}
});

bc1.render(Parent);
header.render(bc1.bars.top.element)
header.logo.attr('src',logo)
header.addLink({id:'disclaimer',title:'Disclaimer',callback:()=>console.log('disclaimer callback')})

