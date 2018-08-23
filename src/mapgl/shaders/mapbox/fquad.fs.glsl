precision mediump float;
uniform sampler2D dtexture;
// uniform sampler2D fbtexture;
uniform vec2 minmax;
// uniform float dtextureRes;
// varying float fvindices;
varying float fvalue;


  
// float divider = 1.0 / ;
void main() {  
   
  float _value = clamp(fvalue,0.0,1.0);
  vec2 ramp_pos = vec2(1.0,(_value - 0.0) / abs(1.0-0.00));
  gl_FragColor = texture2D(dtexture, ramp_pos);
}