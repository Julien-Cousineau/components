import {MapLayer,Parent} from '../src/index.js';
import points2 from './data/points.v2.js'





const layers = {
    
    points:{id:'points',active:true,source:{type: 'geojson',data:points2},slayer:'hot'},
    // points:{id:'points',active:true,styles:styles.polygon,sourcelayer:'boat',source: {type:"vector",tiles:['https://bcatlas-alpha2-jcousineau.c9users.io/tiles/{0}/{z}/{x}/{y}.pbf'.format('boat')]}},
    slf:{
        id:'slf',
        slayer:'debug-slf',
        name:'slf',
        group:'gis',
        type:'slf',
        source:{ 
            type: 'slf', 
            // data: '/mesh.1800.slf',
            data: '/grid2.slf',
            // fromProj:'EPSG:3156',
            // toProj:'EPSG:4326',
            binaries:{
                // marina:{url:'/mesh1800_marina.binary'},
                test:{url:'test1.binary'},
                test2:{url:'test3.binary'},
        
    
            }
    }}
}

const m1  = new MapLayer({
    images:{
          boat:{id:'boat',url:'img/boat.png'}
        },
    layers:layers,
    

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








