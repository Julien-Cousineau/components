precision mediump float;
attribute vec3 position;
attribute float values;
uniform mat4 u_matrix;
uniform mat4 v_matrix;
varying float fValue;
  
void main() {
  gl_Position = u_matrix * v_matrix *vec4(position, 1);
  fValue = values;
  gl_PointSize = 10.0;
}