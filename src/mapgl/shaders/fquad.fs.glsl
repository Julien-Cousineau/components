precision mediump float;
uniform sampler2D dtexture;
uniform vec2 minmax;
varying float fvalue;
  
float divider = 1.0 / abs(minmax[1]-minmax[0]);
  
void main() {
  float color = (fvalue-minmax[0]) * divider;
  vec2 ramp_pos = vec2(
    fract(32.0 * color),
    floor(32.0 * color) / 32.0);

  gl_FragColor = texture2D(dtexture, ramp_pos);
}