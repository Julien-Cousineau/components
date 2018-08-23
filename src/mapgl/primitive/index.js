
module.exports.randompoints=function(_npoints,_extent){
    const npoints = _npoints || 100;
    const extent = _extent || [-1,-1,1,1];
    const minx=extent[0],
          miny=extent[1],
          maxx=extent[2],
          maxy=extent[3],
          position = new Float32Array(npoints * 3), //X, Y, Y         
          values   = new Float32Array(npoints);
    for(let i=0,index=0;i<npoints * 3;i++,index+=3){
      position[index]=Math.random()*(maxx-minx)+minx;
      position[index+1]=Math.random()*(maxy-miny)+miny;
      position[index+2]=0.0;
    }
    for(let i=0;i<npoints;i++){
      values[i]=Math.random()*1.0;
    }
    return {type:'points',position:position,values:values};
  }
module.exports.quad=function(){
    return {type:'points',position:new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]),positionNumComponents:2};
  }
module.exports.grid=function(_nrow,_ncol,_origin){
    const nrow = _nrow || 3;
    const ncol = _ncol || 3;
    const origin = _origin || [0,0];
    const npoints =  nrow * ncol,
          nelem   =  (nrow-1)*(ncol-1)*2,
          position = new Float32Array(npoints * 3),
          indices = new Uint16Array(nelem * 3),
          values = new Float32Array(npoints);

    let index   = 0;      
    for(let j=0;j<ncol;j++){
      for(let i=0;i<nrow;i++){          
        position[index] = i+origin[0];
        position[index+1] = j+origin[1];
        position[index+2] = 0.0;
        index+=3;
      }
    }

    index = 0;        
    for(let icol=0;icol<(ncol-1);icol++){
      for(let irow=0;irow<(nrow-1);irow++){
        indices[index]  =irow*ncol+icol;
        indices[index+1]=(irow+1)*ncol + (icol+1);
        indices[index+2]=irow*ncol+(icol+1);        
        indices[index+3]=irow*ncol+icol;
        indices[index+4]=(irow+1)*ncol + icol;
        indices[index+5]=(irow+1)*ncol + (icol+1);        
        index+=6;
      }
    }  
    for(let i=0;i<npoints;i++)values[i]=Math.random()*1.0;
    return {type:'surface',position:position,indices:indices,values:values};
    // return {type:'surface',position:position,indices:indices};
  }

