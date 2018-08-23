import {MapLayer,Parent} from '../src/index.js';



const m1  = new MapLayer({
});

m1.render(Parent);

// // const lcontainer = LContainer(Parent,300,200,0);

// const data = [
//         // {id:0,name:'item1',typeGIS:'point',isOnGIS:true,typeMDA:'proximity',active:false,weight:0.0,isOnMDA:true},
//         // {id:1,name:'item2',typeGIS:'line',isOnGIS:false,typeMDA:'proximity',active:false,weight:0.0,isOnMDA:true},
//         ];

// const po1 = new Popover({
//     // isheader:false,
//     title:"Data",
//      width:400,
//      height:400,
// });
// const content= po1.render(Parent);



// const t1  = new Table({
//     header:`<thead>
//             <tr>
//                 <th>Name</th>
//                 <th>on/off</th>
//                 <th>Type</th>
//                 <th>Properties</th>
//             </tr>
//         </thead>`,
//     data:data,
//     columns:[
//         {name:'name',title: "Name",type:'string'},
//         {name:'isOnGIS',title: "on/off",type:'check',callback:(id)=>{const index=data.findIndex(e=>e.id==id);data[index].isOnGIS=!data[index].isOnGIS;console.log('gis',data)}},
//         {name:'typeGIS',title: "Type",type:'string'},
//         {name:'propertiesGIS',title: "Properties",type:'popover',callback:(id)=>console.log('gis',id)},
//         ]

    
// });

// t1.render(content);








