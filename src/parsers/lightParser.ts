import { UnitySceneBlockParser } from './types';

export const lightParser: UnitySceneBlockParser = {
  isParserType(block, { fileIdMapping }) {
    const components = block?.GameObject?.m_Component ?? [];
    if (!components.length) {
      return false;
    }
    const hasLightComponent = !!components.find(
      (c) => !!fileIdMapping[c?.component?.fileID]?.Light,
    );

    return hasLightComponent;
  },
  parseBlock(block, { fileIdMapping, THREE }) {
    const components = (block?.GameObject?.m_Component ?? []).map(
      (c) => fileIdMapping[c?.component?.fileID],
    ).filter(Boolean);

    if (!components.length) {
      return null;
    }

    let position = [0, 0, 0];
    let color = 0xfff;
    let intensity = 1;
    let distance = 0;

    components.forEach((c) => {
      if (c?.Transform?.m_LocalPosition) {
        const { x, y, z } = c?.Transform?.m_LocalPosition;
        position = [
          Number(x) * 100,
          Number(y) * 100,
          Number(z) * -100,
        ];
      }
      if (c?.Light?.m_Color) {
        const { r, g, b } = c.Light.m_Color;
        intensity = Number(c.Light.m_Intensity) * 10000;
        distance = Number(c.Light.m_Range) * 10000;

        const parsedColors = [r, g, b].map((v) => Math.floor(Number(v) * 255));

        const threeColor = new THREE.Color(`rgb(${parsedColors})`);
        color = threeColor.getHex();
      }
    });

    const light = new THREE.PointLight(color, intensity, distance);
    light.position.set(...position);
    light.castShadow = true;

    return light;
    // return light;
  },
};
