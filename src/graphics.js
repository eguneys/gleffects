import shaderMap from './shaders';

import { objMap } from './util2';
import * as u from './util';

import mat3 from './matrix';

export default function Graphics(state, gl) {

  const { width, height } = state.game;

  gl.clearColor(0, 0, 0, 1);
  // https://stackoverflow.com/questions/57612782/how-to-render-objects-without-blending-with-transparency-enabled-in-webgl/57613578#57613578
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.enable(gl.BLEND);
  gl.disable(gl.DEPTH_TEST);


  this.minibatch = [];

  this.addHero = (hero, props) => {
    addQuad(hero, {
      uSqueeze: [props.squeeze],
      uTime: [props.tick],
      ...baseUniforms(props)
    });
  };

  this.addTexture = (quad, props, uniforms) => {
    addQuad(quad, {
      uTexture: [],
      ...uniforms,
      ...baseUniforms(props)
    });
  };

  this.addQuad = (quad, props, uniforms) => {
    addQuad(quad, {
      ...uniforms,
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
        if (!args) {
          throw new Error("undefined uniform " + key);
        }
        setter(...args);
      };
    });
    this.minibatch.push({...quad, uniforms: cookUniforms });
  };

  this.makeQuad = ({
    name,
    vSource,
    fSource,
    uniforms
  }, width, height) => {
    vSource = vSource || shaderMap['vmain'];

    let vShader = createShader(gl, gl.VERTEX_SHADER, vSource);
    let fShader = createShader(gl, gl.FRAGMENT_SHADER, fSource);

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
      name,
      width,
      height,
      program,
      vao,
      uniforms: objMap(uniforms, (_, v) => v(gl, program))
    };
  };

  this.makeSprite = ({
    texture,
    fSource,
    uniforms
  }, width, height) => {
    fSource = fSource || shaderMap['ftexture'];

    const textureUnit = 0;
    
    let res = this.makeQuad({
      vSource: shaderMap['vtexture'],
      fSource,
      uniforms: {
        ...uniforms,
        uResolution: makeUniform2fSetter("uResolution"),
        uMatrix: makeUniform3fvSetter("uMatrix"),
        uTexture: makeUniform1iSetter("uTexture", textureUnit)
      }
    }, width, height);

    let glTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, glTexture);

    const format = gl.RGBA,
          type = gl.UNSIGNED_BYTE;
    gl.texImage2D(gl.TEXTURE_2D, 0, format, format, type, texture);
    // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    res = {
      texture: glTexture,
      textureUnit,
      ...res
    };

    return res;    
  };

  this.render = () => {

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);

    this.minibatch.forEach(({
      program,
      uniforms,
      vao,
      texture,
      textureUnit
    }) => {

      gl.useProgram(program);

      uniforms.forEach(_ => _());


      if (texture) {
        gl.activeTexture(gl.TEXTURE0 + textureUnit);
        gl.bindTexture(gl.TEXTURE_2D, texture);
      }

      gl.bindVertexArray(vao);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    });

    this.minibatch = [];
  };
}

export const makeUniform1iSetter = (name, args) => (gl, program) => () => gl.uniform1i(gl.getUniformLocation(program, name), args);

export const makeUniform1fSetter = name => (gl, program) => (...args) => gl.uniform1f(gl.getUniformLocation(program, name), ...args);


export const makeUniform2fSetter = name => (gl, program) => (...args) => gl.uniform2f(gl.getUniformLocation(program, name), ...args);

export const makeUniform2fvSetter = name => (gl, program) => (vec) => gl.uniform2fv(gl.getUniformLocation(program, name), vec);

export const makeUniform3fvSetter = name => (gl, program) => (matrix) => gl.uniformMatrix3fv(gl.getUniformLocation(program, name), false, matrix);

function createShader(gl, type, source) {
  let shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

  if (success) {
    return shader;
  }

  console.error('Cannot create shader: [' + source + '] ' + gl.getShaderInfoLog(shader));
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
