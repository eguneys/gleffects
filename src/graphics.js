import { objMap } from './util2';
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

  const heroWidth = height * 0.5;

  let hero = makeQuad(gl, {
    uSqueeze: makeUniform2fvSetter("uSqueeze"),
    uResolution: makeUniformSetter2f("uResolution"),
    uTime: makeUniformSetter("uTime"),
    uMatrix: makeUniform3fvSetter("uMatrix")
  }, heroWidth, heroWidth);

  this.addHero = (props) => {
    addQuad(hero, {
      uSqueeze: [props.squeeze],
      uTime: [props.tick],
      ...baseUniforms(props)
    });
  };

  const baseUniforms = ({
    pivot,
    translation,
    rotation,
    scale
  }) =>
  {
    const uMatrix = mat3.transform([width, height],
                                  translation,
                                  rotation,
                                  scale,
                                  pivot);

    return {
      uResolution: [gl.canvas.width, gl.canvas.height],
      uMatrix: [uMatrix]
    };
  };

  const addQuad = (quad, uniformArgs) => {
    const cookUniforms = Object.keys(quad.uniforms).map(key => {
      let setter = quad.uniforms[key];
      let args = uniformArgs[key];
      return () => {
        setter(...args);
      };
    });
    this.minibatch.push({...quad, uniforms: cookUniforms });
  };
  
  this.render = () => {

    this.addHero({
      tick: state.game.tick,
      squeeze: [u.PI* 0.0, 1.0],
      translation: [width*0.5 - heroWidth* 0.5, height*0.5 - heroWidth* 0.5],
      rotation: Math.PI * 0.0, 
      scale: [1.0, 1.0],
      pivot: [heroWidth*0.5, heroWidth*0.5]
    });

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

const makeUniformSetter = name => (gl, program) => (...args) => gl.uniform1f(gl.getUniformLocation(program, name), ...args);


const makeUniformSetter2f = name => (gl, program) => (...args) => gl.uniform2f(gl.getUniformLocation(program, name), ...args);

const makeUniform2fvSetter = name => (gl, program) => (vec) => gl.uniform2fv(gl.getUniformLocation(program, name), vec);

const makeUniform3fvSetter = name => (gl, program) => (matrix) => gl.uniformMatrix3fv(gl.getUniformLocation(program, name), false, matrix);

function makeQuad(gl, uniforms, width, height) {

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

  return {
    width,
    height,
    program,
    vao,
    uniforms: objMap(uniforms, (_, v) => v(gl, program))
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
