import { UnitySceneBlockParser } from './types';

const DIRECTIONAL_LIGHT_TYPE = '1';

export const directionalLightParser: UnitySceneBlockParser = {
  isParserType(block, { fileIdMapping }) {
    const components = block?.GameObject?.m_Component ?? [];
    if (!components.length) {
      return false;
    }
    const hasLightComponent = !!components.find(
      (c) => fileIdMapping[c?.component?.fileID]?.Light?.m_Type === DIRECTIONAL_LIGHT_TYPE,
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
    let rotation = [1, 1, 1, 1];

    components.forEach((c) => {
      if (c?.Transform?.m_LocalPosition) {
        const { x, y, z } = c?.Transform?.m_LocalPosition;
        position = [
          Number(x) * 100,
          Number(y) * 100,
          Number(z) * -100,
        ];
        rotation = [
          Number(c?.Transform['m_LocalRotation.x'] || 1),
          Number(c?.Transform['m_LocalRotation.y'] || 1),
          -Number(c?.Transform['m_LocalRotation.z'] || 1),
          -Number(c?.Transform['m_LocalRotation.w'] || 1),
        ];
      }
      if (c?.Light?.m_Color) {
        const { r, g, b } = c.Light.m_Color;
        intensity = Number(c.Light.m_Intensity) * 10;

        const parsedColors = [r, g, b].map((v) => Math.floor(Number(v) * 255));

        const threeColor = new THREE.Color(`rgb(${parsedColors})`);
        color = threeColor.getHex();
      }
    });

    const light = new THREE.DirectionalLight(color, intensity);

    light.position.set(...position);
    light.castShadow = true;
    light.rotation.setFromQuaternion(
      new THREE.Quaternion(...rotation),
    );

    return light;
  },
};
