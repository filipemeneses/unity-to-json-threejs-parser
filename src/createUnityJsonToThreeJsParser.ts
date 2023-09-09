import type * as THREE from 'three';
import { decodeAllEntriesAsGltf } from './decodeAllEntriesAsGltf';
import { createGltfClonner } from './three/createGltfClonner';
import { sanitizeUnityJson } from './sanitizeUnityJson';
import type { UnitySceneBlockParser } from './parsers/types';

export const createUnityJsonToThreeJsParser = (
  {
    // eslint-disable-next-line no-shadow
    THREE,
    GLTFLoader,
  }: {
    THREE: any,
    GLTFLoader: any
  },
  {
    sanitizers,
  }: {
    sanitizers?: UnitySceneBlockParser[]
  } = {},
) => {
  const cloneGltf = createGltfClonner({ THREE });
  type ThreeJSObject = THREE.PerspectiveCamera | THREE.Group

  return async (
    unitySceneName: string,
    unityContext: any,
  ): Promise<ThreeJSObject[]> => {
    const threeJsParsable: any = await sanitizeUnityJson(
      {
        unitySceneName,
        unityContext,
      },
      {
        extraParsers: sanitizers,
      },
    );

    const gltfObjects: any = await decodeAllEntriesAsGltf(GLTFLoader, threeJsParsable.references);

    const instances: ThreeJSObject[] = [];

    const parsePrefab = (instance: any) => {
      const clone = cloneGltf(gltfObjects[instance.sourceGuid]);
      const instanceGroup = clone.scene;
      instanceGroup.name = instance.props.m_Name;

      const changeableGroup = instanceGroup;

      const { props } = instance;

      const positionX = 100 * Number(props['m_LocalPosition.x']);
      const positionY = 100 * Number(props['m_LocalPosition.y']);
      const positionZ = -100 * Number(props['m_LocalPosition.z']);

      const scaleX = 100 * Number(props['m_LocalScale.x'] || 1);
      const scaleY = 100 * Number(props['m_LocalScale.y'] || 1);
      const scaleZ = -100 * Number(props['m_LocalScale.z'] || 1);

      const rotationW = Number(props['m_LocalRotation.w'] || 1);
      const rotationX = Number(props['m_LocalRotation.x'] || 1);
      const rotationY = Number(props['m_LocalRotation.y'] || 1);
      const rotationZ = Number(props['m_LocalRotation.z'] || 1);

      changeableGroup.position.set(positionX, positionY, positionZ);

      changeableGroup.scale.setX(scaleX);
      changeableGroup.scale.setY(scaleY);
      changeableGroup.scale.setZ(scaleZ);

      changeableGroup.rotation.setFromQuaternion(
        new THREE.Quaternion(rotationX, rotationY, -rotationZ, -rotationW),
      );

      instances.push(instanceGroup);
    };

    const parseCamera = (instance: any) => {
      const {
        x, y, z,
      } = instance.props.transform.m_LocalPosition;
      const localRotation = instance.props.transform.m_LocalRotation;
      const unityCamera = instance.props.camera;

      const camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        1,
        2000,
      );
      camera.position.setX(Number(x) * 100);
      camera.position.setY(Number(y) * 100);
      camera.position.setZ(Number(z) * -100);
      camera.fov = Number(unityCamera['field of view']) + 5.8;

      const rotationW = Number(localRotation.w || 1);
      const rotationX = Number(localRotation.x || 1);
      const rotationY = Number(localRotation.y || 1);
      const rotationZ = Number(localRotation.z || 1);

      camera.updateProjectionMatrix();

      camera.rotation.setFromQuaternion(
        new THREE.Quaternion(rotationX, rotationY, -rotationZ, -rotationW),
      );

      instances.push(camera);
    };

    threeJsParsable.instances.forEach((instance: any) => {
      const handles: {[key: string]: any} = {
        prefab: parsePrefab,
        camera: parseCamera,
      };

      const handler = handles[instance.props.type];
      if (!handler) {
        return;
      }

      handler(instance);
    });

    return instances;
  };
};
