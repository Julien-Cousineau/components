Float32Array.prototype.max = function(){
    var max = -Infinity, i = 0, len = this.length;
    for ( ; i < len; i++ )
      if ( this[i] > max ) max = this[i];
    return max;
};
Float32Array.prototype.min = function(){
    var min = +Infinity, i = 0, len = this.length;
    for ( ; i < len; i++ )
      if ( this[i] < min ) min = this[i];
    return min;
};

Float32Array.prototype.sortIndices = function(desc) {
    const f = desc?(a,b)=>b[1]-a[1]:
                  (a,b)=>a[1]-b[1];
    const copy = this.slice(0);
    const keys = new Array(this.length).fill();
    return keys.map((key,i)=>[i,copy[i]]).sort(f).map(item=>item[0]);
};
  

onmessage = function(payload) {
  const id = payload.data.id;
  let array=payload.data.array;
  
  if(!array)return postMessage({id:id,err:'Function does not exist',payload: null});
  const newarray = array.sortIndices(true);
  
  return postMessage({id:id,err:null,payload:newarray.slice(0,250)});
    
};