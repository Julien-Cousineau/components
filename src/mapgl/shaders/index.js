import vs  from './vs.glsl';
import fs  from './fs.glsl';
import quadvs from './quad.vs.glsl';
import quadfs from './quad.fs.glsl';
import fquadvs  from './fquad.vs.glsl';
import fquadfs  from './fquad.fs.glsl';
export default {
    points:{
        vs:vs,
        fs:fs
    },
    quad:{
        vs:quadvs,
        fs:quadfs,
    },
    fquad:{
        vs:fquadvs,
        fs:fquadfs,
    }    
}