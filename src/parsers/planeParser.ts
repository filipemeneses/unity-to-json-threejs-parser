import { UnitySceneBlockParser } from './types';
import { assignPosition } from './utils/assignPosition';
import { assignRotationFromQuaternion } from './utils/assignRotationFromQuaternion';
import { assignScale } from './utils/assignScale';
import { getBlockComponents } from './utils/getBlockComponents';

export const planeParser: UnitySceneBlockParser = {
  isParserType(block, { fileIdMapping }) {
    const components = block?.GameObject?.m_Component ?? [];

    if (!components.length) {
      return false;
    }

    const isPlane = !!components.find(
      (c) => fileIdMapping[c?.component?.fileID]?.MeshFilter?.m_Mesh?.fileID === '10209',
    );

    return isPlane;
  },
  parseBlock(block, { fileIdMapping, THREE }) {
    const components = getBlockComponents(block, fileIdMapping);

    if (!components.length) {
      return null;
    }

    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100),
      new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false }),
    );

    components.forEach((c) => {
      if (c?.Transform) {
        assignPosition(plane, c?.Transform?.m_LocalPosition);

        const { x: sx, y: sy, z: sz } = c?.Transform?.m_LocalScale;

        const parsed = [
          Number(sx) * 10,
          Number(sz) * 10,
          Number(sy) * 10,
        ];
        plane.scale.set(...parsed);

        const {
          x, y, z,
        } = c?.Transform?.m_LocalEulerAnglesHint;

        plane.rotation.set(
          ((Number(x || 1) + 90) / 180) * -Math.PI,
          (Number(y || 1) / 180) * Math.PI,
          (Number(z || 1) / 180) * Math.PI,
          'XYZ',
        );
      }
    });

    plane.receiveShadow = true;

    return plane;
  },
};
