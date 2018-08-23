precision mediump float;

uniform sampler2D dtexture;
uniform vec2 minmax;

varying float fValue;

float divider = 1.0 / abs(minmax[1] - minmax[0]);

void main() {  
  float value = (clamp(fValue,minmax[0],minmax[1]) - minmax[0]) * divider;
  gl_FragColor = texture2D(dtexture, vec2(0.0,value));
}
