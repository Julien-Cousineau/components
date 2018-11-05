'use strict';

import MapGL from '../mapgl';

export default class MapGLMapBox extends MapGL{
  constructor(options) {
    super(options);
    this.mapbox=true;
  }
  setCamera(){return} //overwrite function

  get u_matrix(){return this._u_matrix}
  get v_matrix(){return null}
  get worldSize(){return this._worldSize}
  get zoom(){return this._zoom}
  drawScene(worldSize,zoom, projMatrix) {
     
    this._u_matrix = projMatrix;
    this._worldSize = worldSize
    this._zoom = zoom;
    super.drawScene();
  }
}
