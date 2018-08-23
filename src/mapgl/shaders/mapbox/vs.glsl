precision mediump float;

#define PI 3.1415926535897932384626433832795

attribute vec3 position;
attribute float value;
uniform mat4 u_matrix;
uniform float worldSize;

varying float fValue;

float lngX(float lng) {
  return  (180.0 + lng) * worldSize / 360.0;
}
float latY(float lat) {
  float y = 180.0 / PI * log(tan(PI / 4.0 + lat * PI / 360.0));
  return (180.0 -y) * worldSize / 360.0;
}



void main() {
  gl_Position = u_matrix * vec4(lngX(position[0]),latY(position[1]),position[2], 1.0);
  gl_PointSize = 10.0;
  fValue = value;
}