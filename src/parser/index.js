/* global fetch */
import { humanFileSize } from '@julien.cousineau/util';
import Selafin from 'slf-js'
// import Fetch from '../fetch'
export function String2JSON(string,options){
    if(options && options.debug)console.log('data size', humanFileSize(event.target.result.length));
    if(options && options.debug)console.time('JSON.parse');
    const data= JSON.parse(string);
    if(options && options.debug)console.timeEnd('JSON.parse');
    return data;
}
export function Buffer2SLF(buffer,options){
    if(options && options.debug)console.log('data size', humanFileSize(event.target.result.length));
    if(options && options.debug)console.time('SLF.parse');
    const slf = new Selafin(buffer, {keepbuffer:1});
    if(options && options.debug)console.timeEnd('SLF.parse');
    return slf;
    
}

// export async function getJson(url){
//   let data = await (await (Fetch.request(url)
//     .then(res => {
//       return res.json();
//     })
//     .catch(err => {
//       console.log('Error: ', err);
//     })
//   ));
//   return data;
// }

// export async function getSLF(url){
//   let buffer = await (await (Fetch.request(url,{method: 'get',mode: 'no-cors'})
//     .then(res => {
//       return res.arrayBuffer();
//     })
//     .catch(err => {
//       console.log('Error: ', err);
//     })
//   ));
//   return Buffer2SLF(buffer,{keepbuffer:1});
// }
