import * as u from './util';

import mat3 from './matrix';

import vShaderSource from './shaders/main.vert';
import fShaderSource from './shaders/main.frag';

export default function Graphics(state, gl) {

  const { width, height } = state.game;

  gl.clearColor(0, 0, 0, 1);
  // https://stackoverflow.com/questions/18439897/webgl-fragment-shader-opacity
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
  gl.enable(gl.BLEND);
  gl.disable(gl.DEPTH_TEST);


  this.minibatch = [];

  let quad = makeQuad(gl, width, height);

  let smallQuad = makeQuad(gl, width * 0.5, height * 0.5);

  this.addQuad = (quad, uniformArgs) => {
    const cookUniforms = Object.keys(quad.uniforms).map(key => {
      let setter = quad.uniforms[key];
      let args = uniformArgs[key];
      return () => setter(...args);
    });
    this.minibatch.push({...quad, uniforms: cookUniforms });
  };

  this.quad = (quad, translation, rotation = 0, scale = [1, 1], pivot = [quad.width/2,quad.height/2]) => {

    let matrix = mat3.identity();
    matrix = mat3.multiply(matrix,
                           mat3.projection(width,
                                           height));

    matrix = mat3.multiply(matrix,
                           mat3.translation(translation[0],
                                            translation[1]));

    matrix = mat3.multiply(matrix,
                           mat3.translation(pivot[0],
                                            pivot[1]));

    matrix = mat3.multiply(matrix,
                           mat3.rotation(rotation));

    matrix = mat3.multiply(matrix,
                           mat3.scaling(scale[0],
                                        scale[1]));
    matrix = mat3.multiply(matrix,
                           mat3.translation(-pivot[0],
                                            -pivot[1]));

    this.addQuad(quad, {
      uResolution: [gl.canvas.width, gl.canvas.height],
      uMatrix: [matrix]
    });
  };
  
  this.render = () => {

    this.quad(smallQuad, [0.0, 1.0], Math.PI * 0.1, [1.0, 1.0]);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);

    this.minibatch.forEach(({
      program,
      uniforms,
      vao
    }) => {

      gl.useProgram(program);

      uniforms.forEach(_ => _());

      gl.bindVertexArray(vao);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    });

    this.minibatch = [];
  };

}

function makeQuad(gl, width, height) {

  let vShader = createShader(gl, gl.VERTEX_SHADER, vShaderSource);
  let fShader = createShader(gl, gl.FRAGMENT_SHADER, fShaderSource);

  let program = createProgram(gl, vShader, fShader);

  let posAttrLocation = gl.getAttribLocation(program, "aPosition");
  let posBuffer = gl.createBuffer();

  let vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  gl.enableVertexAttribArray(posAttrLocation);

  gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
  

  let left = 0,
      right = width,
      down = 0,
      up = height;
  /*
    (-1, 1).( 1, 1)
    .
    (-1,-1).( 1,-1)
  */
  let positions = [
    left, down,
    left, up,
    right, down,
    left, up,
    right, down,
    right, up
  ];


  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);


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


  let texCoordAttrLocation = gl.getAttribLocation(program, "aTexCoord");

  let texCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);

  left = -1,
  right = 1,
  down = -1,
  up = 1;
  /*
    (-1, 1).( 1, 1)
    .
    (-1,-1).( 1,-1)
  */
  positions = [
    left, down,
    left, up,
    right, down,
    left, up,
    right, down,
    right, up
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  gl.enableVertexAttribArray(texCoordAttrLocation);

  size = 2,
  type = gl.FLOAT,
  normalize = true,
  stride = 0,
  offset = 0;

  gl.vertexAttribPointer(texCoordAttrLocation, 
                         size,
                         type,
                         normalize,
                         stride,
                         offset);



  const makeUniformSetter = (name) => (...args) => gl.uniform2f(gl.getUniformLocation(program, name), ...args);

  const makeUniform3fvSetter = (name) => (matrix) => gl.uniformMatrix3fv(gl.getUniformLocation(program, name), false, matrix);

  return {
    width,
    height,
    program,
    vao,
    uniforms: {
      uResolution: makeUniformSetter("uResolution"),
      uMatrix: makeUniform3fvSetter("uMatrix")
    }
  };
};

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
