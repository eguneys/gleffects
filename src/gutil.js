import shaderMap from './shaders';
import * as G from './graphics';

import * as text from './text';

export function makeTextDraw(g, texture) {

  const textureInfo = new G.makeTextureInfoForUniform("uTexture");

  const posInfo = new G.makeBufferInfoForAttribute("aPosition", 2),
        texInfo = new G.makeBufferInfoForAttribute("aTexCoord", 2);

  let dInfo = g.makeDraw({
    vSource: shaderMap['vfont'],
    fSource: shaderMap['ftexture'],
    bufferInfos: [
      posInfo,
      texInfo
    ],
    textureInfos: [textureInfo],
    uniforms: {
      uMatrix: G.makeUniform3fvSetter("uMatrix")
    }
  });

  textureInfo.set(texture);

  return (str, props) => {
    let vert = text.makeVerticesForString(str);
    posInfo.set(vert.arrays.position, g.gl.DYNAMIC_DRAW);
    texInfo.set(vert.arrays.texcoord, g.gl.DYNAMIC_DRAW);

    props.width = vert.width;
    props.height = vert.height;

    g.addQuad(dInfo, props, {}, vert.numVertices);

    return {
      width: vert.width,
      height: vert.height
    };
  };
}

export function makeSprite(g, width, height) {
  const textureInfo = new G.makeTextureInfoForUniform("uTexture");

  let dInfo = g.makeQuad({
    vSource: shaderMap['vtexture'],
    fSource: shaderMap['ftexture'],
    textureInfos: [textureInfo],
    uniforms: {
      uMatrix: G.makeUniform3fvSetter("uMatrix")
    }
  }, width, height);

  return (props, uniforms, texture) => {
    if (texture) {
      textureInfo.set(texture);
    }
    g.addQuad(dInfo, props, uniforms);
  };
}
