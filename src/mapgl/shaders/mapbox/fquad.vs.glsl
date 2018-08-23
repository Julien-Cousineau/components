precision mediump float;

#define PI 3.1415926535897932384626433832795

attribute vec3 position;
attribute float vindices;
uniform mat4 u_matrix;
uniform float dtextureRes;
// uniform mat4 v_matrix;
uniform float worldSize;
// varying float fvindices;
uniform sampler2D fbtexture;
varying float fvalue;
float lngX(float lng) {
  return  (180.0 + lng) * worldSize / 360.0;
}
float latY(float lat) {
  float y = 180.0 / PI * log(tan(PI / 4.0 + lat * PI / 360.0));
  return (180.0 -y) * worldSize / 360.0;
}

uniform vec2 minmax;
// float divider = 1.0 / abs(minmax[1]-minmax[0]);
float decode(vec2 pair){
    float y = pair[0] * 255.0; //0-1 x 255
    float x = pair[1] * 255.0 * 255.0;
    return ((y+x) / 255.0 / 255.0 * (minmax[1]-minmax[0])) + minmax[0];
}



void main() {
  gl_Position = u_matrix * vec4(lngX(position[0]),latY(position[1]),position[2], 1.0);
  // fvindices = vindices;
  gl_PointSize = 10.0;
  float x = (fract(vindices / dtextureRes) * dtextureRes) + 0.5; // We want the middle of pixel
  float y = floor(vindices / dtextureRes) + 0.5; // We want the middle of pixel
  vec2 pos    = vec2(x,y);
  vec4 color = texture2D(fbtexture, pos / dtextureRes);
  // vec4 color = vec4(0,0.5,0,1);
  fvalue = decode(color.rg);
  // fvalue = minmax[1];
  
  
}