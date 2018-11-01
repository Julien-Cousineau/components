
import Worker_Operations from "worker-loader!./operations.js";

export default class WebWorker{
  constructor(options){
    // if (!window.Worker)throw new Error("Web Worker does exist in the Web Browser");
    if(!options.type)throw new Error("WorkerWeb must have a type");
    if(!options.callback)console.warn("WorkerWeb must have a callback");
    this.type = options.type;
    this.types={
      operations:new Worker_Operations()
    }
    
    
    if(!this.types[this.type])throw new Error("Worker does not exist")
    this.worker = this.types[this.type];
    
    
    
    // const self=this;
    // this.worker.onmessage = function(msg){return self.receive(msg)};  
  }

  // push(object){
  //   this.cache = object;
  //   if(!this.processing)this.send()     
  // }
  get(options){
    const {worker}=this;
    
    return new Promise(function (resolve, reject) {
      worker.onmessage = function(msg){
        console.log(msg)
        if(msg.data.err)reject(msg.data.err)
        resolve(msg.data.payload)
      };
      worker.postMessage(options);
    })
  }
  
}