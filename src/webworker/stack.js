// Webworker with stack
import SortIndices from "worker-loader!./sortindices.js";
import to from '../to';
export default class WebWorker{
  constructor(options){
    if(!options.type || !this.types[options.type])throw new Error("Type of worker does not exist")
    this.callback = options.callback || function(err,results){if(err)return console.warn(err);console.log(results)};
    
    this.type = options.type;
    this.worker = new this.types[options.type]();
    this.msgId = 0;
    this.resolves = {};
    this.rejects = {};
    this.processing = false;
    this.cache =null;
    const self=this;
    this.worker.onmessage = function(msg){return self.receive(msg)};  
  }
  get types(){
    return {
      sortIndices:SortIndices
    }
  }
  push(object){
    this.cache = object;
    if(!this.processing)this.send()   
  }
  async send(){
    this.processing = true;
    const object = this.cache;
    this.cache = null;
    const [err,results] = await to(this.createPromise(this.msgId++,object));    
    this.callback(err,results);    
  }
  createPromise(msgId,object){
    const {worker,resolves,rejects} = this;
    return new Promise(function (resolve, reject) {
      const msg = {id: msgId,object:object};
      resolves[msgId] = resolve;
      rejects[msgId] = reject;
      worker.postMessage(msg);
      
    });
  }
  receive(msg) {
    this.processing = false;
    if(this.cache)this.send();
    
    const {resolves,rejects} = this;          
    const {id, err, payload} = msg.data;
    if(payload && resolves[id] && !err)resolves[id](payload);
    if(rejects[id])rejects[id](err);
    delete resolves[id]
    delete rejects[id]
  }
}
