import {Table,Parent,LContainer} from '../src/index.js';

const lcontainer = LContainer(Parent,300,200,0);

const data = [
        {id:0,name:'item1',typeGIS:'point',isOnGIS:true,typeMDA:'proximity',active:false,weight:0.0,isOnMDA:true},
        {id:1,name:'item2',typeGIS:'line',isOnGIS:false,typeMDA:'proximity',active:false,weight:0.0,isOnMDA:true},
        ];
const t1  = new Table({
    header:`<thead>
            <tr>
                <th rowspan="2">Name</th>
                <th colspan="3">GIS</th>
                <th colspan="5">Data/Proximity for MDA</th>
            </tr>
            <tr>
                <th>on/off</th>
                <th>Type</th>
                <th>Properties</th>
                <th>on/off</th>
                <th>Type</th>
                <th>Active</th>
                <th>Weight</th>
                <th>Properties</th>
            </tr>
        </thead>`,
    data:data,
    columns:[
        {name:'name',title: "Name",type:'string'},
        {name:'isOnGIS',title: "on/off",type:'check',callback:(id)=>{const index=data.findIndex(e=>e.id==id);data[index].isOnGIS=!data[index].isOnGIS;console.log('gis',data)}},
        {name:'typeGIS',title: "Type",type:'string'},
        {name:'propertiesGIS',title: "Properties",type:'popover',callback:(id)=>console.log('gis',id)},
        {name:'isOnMDA',title: "on/off",type:'check',callback:(id)=>console.log('gis',id)},
        {name:'typeMDA',title: "Type",type:'string'},
        {name:'active',title: "Active",type:'check',callback:(id)=>console.log('mda',id)},
        {name:'weight',title: "Weight",type:'string'},
        {name:'propertiesMDA',title: "Properties",type:'popover',callback:(id)=>console.log('mda',id)},
        ]

    
});

t1.render(lcontainer);