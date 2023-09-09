import { UnitySceneBlockParser } from './types';
/* eslint-disable camelcase */
export const prefabParser: UnitySceneBlockParser = {
  isParserType(block: any) {
    return !!block.PrefabInstance;
  },
  parseBlock(block: any, {
    guidMapping,
    cloneGltf,
    gltfByGuid,
    THREE,
  }) {
    const { type } = block;
    const { m_SourcePrefab, m_Modification } = block.PrefabInstance;
    const { guid } = m_SourcePrefab;
    const file = guidMapping[guid];
    const sourceGuid = guid;

    if (!file) {
      console.warn('File source is missing. Block:', block);
      return null;
    }

    const { filepath } = guidMapping[guid];

    if (!m_Modification) {
      return null;
    }

    const { m_Modifications } = m_Modification;
    const instanceProps = m_Modifications.reduce((obj: any, modification: any) => {
      // eslint-disable-next-line no-param-reassign
      obj[
        modification.propertyPath
      ] = modification.value;

      return obj;
    }, { filepath, type });

    const clone = cloneGltf(gltfByGuid[sourceGuid]);
    const instanceGroup = clone.scene;
    instanceGroup.name = instanceProps.m_Name;

    const changeableGroup = instanceGroup;

    const positionX = 100 * Number(instanceProps['m_LocalPosition.x']);
    const positionY = 100 * Number(instanceProps['m_LocalPosition.y']);
    const positionZ = -100 * Number(instanceProps['m_LocalPosition.z']);

    const scaleX = 100 * Number(instanceProps['m_LocalScale.x'] || 1);
    const scaleY = 100 * Number(instanceProps['m_LocalScale.y'] || 1);
    const scaleZ = -100 * Number(instanceProps['m_LocalScale.z'] || 1);

    const rotationW = Number(instanceProps['m_LocalRotation.w'] || 1);
    const rotationX = Number(instanceProps['m_LocalRotation.x'] || 1);
    const rotationY = Number(instanceProps['m_LocalRotation.y'] || 1);
    const rotationZ = Number(instanceProps['m_LocalRotation.z'] || 1);

    changeableGroup.position.set(positionX, positionY, positionZ);

    changeableGroup.scale.setX(scaleX);
    changeableGroup.scale.setY(scaleY);
    changeableGroup.scale.setZ(scaleZ);

    changeableGroup.rotation.setFromQuaternion(
      new THREE.Quaternion(rotationX, rotationY, -rotationZ, -rotationW),
    );

    return instanceGroup;
  },
};
