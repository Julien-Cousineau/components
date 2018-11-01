import vs  from './vs.glsl';
import fs  from './fs.glsl';
import circlefs  from './circle.fs.glsl';
import quadvs from './quad.vs.glsl';
import quadfs from './quad.fs.glsl';
import quadmfs from './quadm.fs.glsl';
import fquadvs  from './fquad.vs.glsl';
import fquadfs  from './fquad.fs.glsl';

import m_vs  from './mapbox/vs.glsl';
import m_fs  from './mapbox/fs.glsl';
// import m_quadvs from './mapbox/quad.vs.glsl';
// import m_quadfs from './mapbox/quad.fs.glsl';
import m_fquadvs  from './mapbox/fquad.vs.glsl';
import m_fquadfs  from './mapbox/fquad.fs.glsl';


export default {
    points:{
        vs:vs,
        fs:fs,
        circlefs:circlefs
    },
    quad:{
        vs:quadvs,
        fs:quadfs,
        mfs:quadmfs,
    },
    fquad:{
        vs:fquadvs,
        fs:fquadfs,
    },
    mapbox:{
      points:{
        vs:m_vs,
        fs:m_fs,
        circlefs:circlefs
      },
      quad:{
          vs:quadvs,
          fs:quadfs,
      },
      fquad:{
          vs:m_fquadvs,
          fs:m_fquadfs,
      }
    }
}