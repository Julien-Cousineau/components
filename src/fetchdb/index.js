import idb from 'idb'; // has Async await functions

'use strict';
import Fetch from '../fetch'
import Modal from '../modal';
import ProgressBar from '../progressbar';
import { extend } from '@julien.cousineau/util'
export default class FetchDB {
  constructor(options){
      options = options || {}
      this.dbid = options.dbid || 'mydb';
      this.storeid = options.storeid || 'mydb';
  }
  async addDBData(name,data){
    const {dbid,storeid}=this;
    let indexedDB =window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    if(!indexedDB)return null;
    let db = await idb.open(dbid, 1, function(upgradeDB){upgradeDB.createObjectStore(storeid, { autoIncrement: true }); });
    
    let tx = db.transaction(storeid, 'readwrite');
    await tx.objectStore(storeid).put(data,name);
    await tx.complete;
    db.close();
  }
  async getDBData(name){
    const {dbid,storeid}=this;
    let indexedDB =window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    if(!indexedDB)return null;
    
    let db = await idb.open(dbid, 1, function(upgradeDB){upgradeDB.createObjectStore(storeid, { autoIncrement: true }); });
    if(!db.objectStoreNames.contains(storeid)){db.close(); return null;}
    
    let tx = db.transaction(storeid, 'readonly');
    
    let buffer = await tx.objectStore(storeid).get(name);
    if(!buffer){db.close(); return null;}
    
    db.close();
    return buffer;
  }
  async getBuffer(url,options){
    options = options || {};
    let buffer = await this.getDBData(url);
    if(!buffer){
      const progressbar = new ProgressBar();
      const modal = new Modal(extend(options,{show:true})).render();
      progressbar.render(modal.doms.modalbody);
      await modal.show();
      buffer = await Fetch.request(url,extend(options,{callbacks:{progress:(con,perc,title)=>{progressbar.update(con,perc)}}}));
      modal.delete();
      this.addDBData(url,buffer);
    } 
    return buffer;
  }
}
