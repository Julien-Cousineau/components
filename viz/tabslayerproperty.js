'use strict';
import d3 from '../dist/d3.min.js';
import {Tabs,Parent,LContainer,Button,LayerProperty,Table} from '../src/index.js';
const lcontainer = LContainer(Parent,275,360,0);
 const layers = {}
const lp = new LayerProperty()
const table =  new Table({
            header: `<thead>
            <tr>
                <th>Name</th>
                <th>on/off</th>
                <th>Type</th>
                <th>Properties</th>
            </tr>
        </thead>`,
            data: layers,
            columns: [
                { name: 'name', title: "Name", type: 'string' },
                { name: 'isOn', title: "on/off", type: 'check', callback: (id) => console.log("here") },
                { name: 'type', title: "Type", type: 'string' },
                { name: 'properties', title: "Properties", type: 'popover', callback: (id) =>  console.log("here") },
            ]


        });


const tabs1 = new Tabs({
    tabs:{
      first:{title:'F',active:true,content:table},
        second:{title:'S',active:false,content:new Button({title:'BTN3',value:1,callback:()=>console.log('btn1')})},
        third:{title:'T',active:false,content:new Button({title:'BTN4',value:1,callback:()=>console.log('btn1')})},
        four:{title:'Four',active:false,content:new Button({title:'BTN5',value:1,callback:()=>console.log('btn1')})},
        five:{title:'Five',active:false,content:new Button({title:'BTN6',value:1,callback:()=>console.log('btn1')})},
    }
     
});
tabs1.render(lcontainer);