Float32Array.prototype.sortIndices = function(desc) {
    const f = desc?(a,b)=>b[1]-a[1]:
                  (a,b)=>a[1]-b[1];
    const copy = this.slice(0);
    const keys = new Array(this.length).fill();
    return keys.map((key,i)=>[i,copy[i]]).sort(f).map(item=>item[0]);
};
Number.prototype.clamp = function(min, max) {
    return Math.min(Math.max(this, min), max);
};

onmessage = function(payload) {
  const id = payload.data.id;
  const object = payload.data.object;
  const array=object.array;
  const desc=object.desc || false;
  let slice=object.slice || [0,0];
  slice[0]=slice[0].clamp(0,array.length-1)
  slice[1]=slice[1].clamp(0,array.length-1)
  
  if(!array)return postMessage({id:id,err:'Worker need an array',payload: null});
  const sortarray = array.sortIndices(desc);
  const slicearray = (slice[0]==slice[1])?sortarray:sortarray.slice(slice[0],slice[1]);
  object.payload =slicearray;
  return postMessage({id:id,err:null,payload:object});
    
};