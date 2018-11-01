'use strict';
import {Buffer2SLF,String2JSON} from '../parser'
export default class Fetch {
  constructor(options){
      // this.callbacks=options.callbacks || {progress:function(value){}};
      
  }
  // static async request(url,settings){
  //   const self=this;
  //   try {return await self._request(url,settings)}
  //   catch (error) {console.error(error);}
      
  // }
  static async request(url,settings){
    // const self=this;
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        let method = settings.method || "GET";
        let title = settings.title || "";
        xhr.responseType = settings.responseType || "text";
        xhr.open(method, url);
        xhr.onload = function () {
            if(settings.callbacks.progress)settings.callbacks.progress(2,1,title);
            if (this.status >= 200 && this.status < 300) {
              resolve(xhr.response);
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        xhr.onprogress=function(evt){
         if (evt.lengthComputable) {
          let percentComplete = evt.loaded / evt.total;
          if(settings.callbacks.progress)settings.callbacks.progress(1,percentComplete,title);
         }
        };
        if(settings.callbacks.progress)settings.callbacks.progress(0,0,title)
        xhr.send();
    });
  }
  async getJson(url){
   
    let data = await this.request(url)
    return String2JSON(data);
  
  }
  async getSLFBuffer(url){
    const self=this;
    let buffer = await self.request(url,{responseType:'arraybuffer',method: 'get',mode: 'no-cors'})
     
    // return Buffer2SLF(buffer,{keepbuffer:1});
  }

}