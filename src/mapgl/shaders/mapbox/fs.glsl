precision highp float;
uniform sampler2D dtexture;
uniform vec2 minmax;
uniform float base;
varying float fvalue;
  

float minimum = min(minmax[0],minmax[1]);
float maximum = max(minmax[0],minmax[1]);
float slope = 1.0 / abs(maximum-minimum);
float _dir = -1.0 * sign(minmax[1]-minmax[0]);
  
void main() {
  
  float color = pow((clamp(fvalue,minimum,maximum)-minimum) * slope,base);
  
  float _value = max(color*_dir,(_dir*-1.0) - color);
  vec2 ramp_pos = vec2(
    fract(32.0 * _value),
    floor(32.0 * _value) / 32.0);

  gl_FragColor = texture2D(dtexture, ramp_pos);
}