import { objMap } from './util2';

import vMainShader from './shaders/main.vert';
import fHeroShader from './shaders/hero.frag';
import fWallShader from './shaders/wall.frag';
import vTextureShader from './shaders/texture.vert';
import fTextureShader from './shaders/texture.frag';
import vFontShader from './shaders/font.vert';

import fBackgroundShader from './shaders/background.frag';

import pFColorsShader from './shaders/colors.partial.frag';
import pFDefsShader from './shaders/defs.partial.frag';
import pFUtilShader from './shaders/util.partial.frag';

// remove on production
import pFEffectsShader from './shaders/effects.partial.frag';


const partialShaders = {
  'futil': pFUtilShader,
  'fdefs': pFDefsShader,
  'fcolors': pFColorsShader,
  'feffects': pFEffectsShader
};

const rawShaders = {
  'vmain': vMainShader,
  'vfont': vFontShader,
  'fhero': fHeroShader,
  'fwall': fWallShader,
  'vtexture': vTextureShader,
  'ftexture': fTextureShader,
  'fbg': fBackgroundShader
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
