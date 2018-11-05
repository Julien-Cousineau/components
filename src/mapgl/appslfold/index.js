'use strict';

import App from '../app';
import Geometry from '../geometry';
import { quad } from '../primitive';
import Texture from '../texture';
import Program from '../program';
import { clearRect } from '../helper';
import { extend } from '@julien.cousineau/util';
import vs  from '../shaders/mapbox/vs.glsl';
import fs  from '../shaders/mapbox/fs.glsl';
import quadvs  from '../shaders/quad.vs.glsl';
import quadfs  from '../shaders/quad.fs.glsl';
import fquadvs  from '../shaders/mapbox/fquad.vs.glsl';
import fquadfs  from '../shaders/mapbox/fquad.fs.glsl';

import {URL2SLF} from '../../parser';

// const slf = require('../slfjs.js');


export default class AppSlf extends App{
  constructor(options) {
    super(options)


  }
  setCamera(){return} //overwrite function

  setSLF(slf) {
    this.slf = slf;
    
    const geoslf = this.addSLF('slf',slf);
    geoslf.addValue('values',slf.getFrame());
    
    this.addTexture('dtexture',{})
    this.textures['dtexture'].todefaultcolor();
    this.addProgram('points',{
        active:true,
        mode:'POINTS',
        geometryID:'points',
        textureIDs:['dtexture'],
        vs:this.glsl.points.vs,
        fs:this.glsl.points.fs,
    })
     
  }
  get u_matrix(){return this._u_matrix}
  get v_matrix(){throw new Error("Not used in this context")}
  get worldSize(){return this._worldSize}
  drawScene(worldSize, projMatrix) {
    this._u_matrix = projMatrix;
    this._worldSize = worldSize;
    super.drawScene();
  }
  changeAttID(id) {
    if (id != 'mca') { this.changeProgram(false);
      this.geometries.slf.defaultvalueID = id }
    else { this.changeProgram(true); }
  }
  changeProgram(ismca) {
    this.programs['value'].active = (ismca) ? false : true;
    this.programs['quadmca'].active = (ismca) ? true : false;
    this.programs['surfacemca'].active = (ismca) ? true : false;
  }
  updateProgram(ids) {
    let program = Object.create(this.glsl.quadmcadefault);

    program.fs = program.fs.replaceAll("//VARIABLESVAR", ids.map(layer => 'uniform sampler2D {0};'.format(layer.id)).join("\n"))
      .replaceAll("//VARIABLESMINMAX", ids.map(layer => 'uniform vec2 {0}minmax;'.format(layer.id)).join("\n"))
      .replaceAll("//VARIABLESATT", ids.map(layer => 'uniform vec4 {0}att;'.format(layer.id)).join("\n"))
      .replaceAll("//VARIABLESCOMPUTE", ids.map(layer => 'float _{0} = compute({0},{0}minmax,{0}att);\n  fValue += _{0} * {0}att[3];'.format(layer.id)).join("\n"))
      .replaceAll("//VARIABLESCONSTRAIN", ids.map(layer => 'fConstrain *= sign(_{0});'.format(layer.id)).join("\n"));

    this.programs['quadmca'].changeSource(program.vs, program.fs);
  }
}
