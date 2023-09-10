import { UnitySceneBlockParser } from './types';

const SPOT_LIGHT_TYPE = '2';

export const lightParser: UnitySceneBlockParser = {
  isParserType(block, { fileIdMapping }) {
    const components = block?.GameObject?.m_Component ?? [];
    if (!components.length) {
      return false;
    }
    const hasLightComponent = !!components.find(
      (c) => fileIdMapping[c?.component?.fileID]?.Light?.m_Type === SPOT_LIGHT_TYPE,
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
    let shouldCastShadow = false;

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

        intensity = Number(c.Light.m_Intensity) * 1000000;
        distance = Number(c.Light.m_Range) * 1000000;

        const parsedColors = [r, g, b].map((v) => Math.floor(Number(v) * 255));
        console.log('%cThis text has a yellow background!', `background-color: rgb(${parsedColors})`);

        const threeColor = new THREE.Color(`rgb(${parsedColors})`);
        color = threeColor.getHex();
      }
      if (c?.Light?.m_Shadows) {
        shouldCastShadow = c.Light.m_Shadows.m_Type !== '0';
        console.log(c.Light.m_Shadows.m_Type);
      }
    });

    const light = new THREE.PointLight(color, intensity, distance);
    light.position.set(...position);
    console.log({ shouldCastShadow });
    light.castShadow = shouldCastShadow;

    const sphere = new THREE.SphereGeometry(0.5, 32, 16);
    light.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: 0xffaa00 })));

    return light;
  },
};
