
import Worker_Operations from "worker!./operations.js";

export default class WebWorker{
  constructor(options){
    if (!window.Worker)throw new Error("Web Worker does exist in the Web Browser");
    if(!options.type)throw new Error("WorkerWeb must have a type");
    if(!options.callback)console.warn("WorkerWeb must have a callback");
    this.type = options.type;
    this.types={
      operations:new Worker_Operations()
    }
    this.callback = options.callback || function(value){console.log(value)};
    
    if(!this.types[this.type])throw new Error("Worker does not exist")
    this.worker = this.types[this.type];
    this.msgId = 0;
    this.resolves = {};
    this.rejects = {};
    this.processing = false;
    this.cache =null;
    
    const self=this;
    this.worker.onmessage = function(msg){return self.receive(msg)};  
  }

  push(object){
    this.cache = object;
    if(!this.processing)this.send()     
  }
  async send(){
    this.processing = true;
    const object = this.cache;
    this.cache = null;
    const results = await this.createPromise(this.msgId++,object);    
    this.callback(results);
  }
  createPromise(msgId,object){
    const {worker,resolves,rejects} = this;
    return new Promise(function (resolve, reject) {
      const msg = {id: msgId,object:object};
      resolves[msgId] = resolve;
      rejects[msgId] = reject;
      worker.postMessage(msg);
    })
  }
  receive(msg) {
    this.processing = false;
    if(this.cache)this.send();
    
    const {resolves,rejects} = this;          
    const {id, err, payload} = msg.data;
    if (payload && resolves[id])resolves[id](payload);
    if(rejects[id])rejects[id](err?err:'Got nothing');
    delete resolves[id]
    delete rejects[id]
  }
}