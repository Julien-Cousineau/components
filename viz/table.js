import {Table,Parent,LContainer,Popover} from '../src/index.js';

// const lcontainer = LContainer(Parent,300,200,0);

const data = [
        {id:0,name:'item1',typeGIS:'point',isOnGIS:true,typeMDA:'proximity',active:false,weight:0.0,isOnMDA:true},
        {id:1,name:'item2',typeGIS:'line',isOnGIS:false,typeMDA:'proximity',active:false,weight:0.0,isOnMDA:true},
        ];

const po1 = new Popover({
    // isheader:false,
    title:"Data",
     width:400,
     height:400,
});
const content= po1.render(Parent);



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
    isfilterbtn:true,
    data:data,
    columns:{
        name:{title: "Name",type:'string',isOn:true},
        isOnGIS:{title: "on/off",type:'check',isOn:true,callback:(id)=>{const index=data.findIndex(e=>e.id==id);data[index].isOnGIS=!data[index].isOnGIS;console.log('gis',data)}},
        typeGIS:{title: "Type",type:'string',isOn:true},
        propertiesGIS:{title: "Properties",type:'popover',isOn:true,callback:(id)=>console.log('gis',id)},
        isOnMDA:{title: "on/off",type:'check',isOn:true,callback:(id)=>console.log('gis',id)},
        typeMDA:{title: "Type",type:'string',isOn:true},
        active:{title: "Active",type:'check',isOn:true,callback:(id)=>console.log('mda',id)},
        weight:{title: "Weight",type:'string',isOn:true},
        propertiesMDA:{title: "Properties",type:'popover',isOn:true,callback:(id)=>console.log('mda',id)},
    }

    
});

t1.render(content);