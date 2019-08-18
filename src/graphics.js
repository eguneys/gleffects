import * as u from './util';

import vShaderSource from './shaders/main.vert';
import fShaderSource from './shaders/main.frag';

export default function Graphics(state, gl) {

  const { width, height } = state.game;

  let vShader = createShader(gl, gl.VERTEX_SHADER, vShaderSource);
  let fShader = createShader(gl, gl.FRAGMENT_SHADER, fShaderSource);

  let program = createProgram(gl, vShader, fShader);

  let posAttrLocation = gl.getAttribLocation(program, "a_position");
  let posBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);


  /*
    (-1, 1).( 1, 1)
        .
    (-1,-1).( 1,-1)
   */
  let positions = [
    -1, 1,
    -1, -1,
    1, -1,
    -1, 1,
    1,-1,
    1, 1
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  let vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  gl.enableVertexAttribArray(posAttrLocation);

  let size = 2,
      type = gl.FLOAT,
      normalize = false,
      stride = 0,
      offset = 0;

  gl.vertexAttribPointer(posAttrLocation, 
                         size,
                         type,
                         normalize,
                         stride,
                         offset);

  

  let resUniformLocation = gl.getUniformLocation(program, "u_resolution");
  
  


  gl.clearColor(0, 0, 0, 0);

  this.render = () => {
    
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);

    gl.uniform2f(resUniformLocation, gl.canvas.width, gl.canvas.height);

    gl.bindVertexArray(vao);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    

  };

}

function createShader(gl, type, source) {
  let shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

  if (success) {
    return shader;
  }

  console.error(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
  return null;
};

function createProgram(gl, vShader, fShader) {
  let program = gl.createProgram();
  gl.attachShader(program, vShader);
  gl.attachShader(program, fShader);
  gl.linkProgram(program);
  let success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.error(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
  return null;
}
