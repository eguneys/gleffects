import { objMap } from './util2';

import vMainShader from './shaders/main.vert';
import fMainShader from './shaders/main.frag';
import vTextureShader from './shaders/texture.vert';
import fTextureShader from './shaders/texture.frag';
import fHoleShader from './shaders/hole.frag';
import fFieldShader from './shaders/field.frag';

import pFDefsShader from './shaders/defs.partial.frag';
import pFUtilShader from './shaders/util.partial.frag';
import pFNumbersShader from './shaders/numbers.partial.frag';


const partialShaders = {
  'futil': pFUtilShader,
  'fdefs': pFDefsShader,
  'fnumbers': pFNumbersShader
};

const rawShaders = {
  'vmain': vMainShader,
  'fmain': fMainShader,
  'vtexture': vTextureShader,
  'ftexture': fTextureShader,
  'fhole': fHoleShader,
  'ffield': fFieldShader
};

const regexInclude = /#include (\w+)/;


const shaderMap = objMap(rawShaders,
                         (_, v) => process(v));


function process(source) {
  const matches = source.match(regexInclude);

  if (matches) {

    const match = matches[1];

    source = source.replace(matches[0], partialShaders[matches[1]]);

    return process(source);
  } else {
    return source;
  }
}

export default shaderMap;
