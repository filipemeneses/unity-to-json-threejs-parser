import { UnitySceneBlockParser } from './types';

export const ambientLightParser: UnitySceneBlockParser = {
  isParserType(block) {
    return !!block?.RenderSettings?.m_FogColor;
  },
  parseBlock(block, { THREE }) {
    const { r, g, b } = block?.RenderSettings?.m_FogColor;
    const intensity = Number(block?.RenderSettings?.m_AmbientIntensity) * 3;

    const parsedColors = [r, g, b].map((v) => Math.floor(Number(v) * 255));

    const threeColor = new THREE.Color(`rgb(${parsedColors})`);

    const light = new THREE.AmbientLight(threeColor.getHex(), intensity);

    return light;
  },
};
