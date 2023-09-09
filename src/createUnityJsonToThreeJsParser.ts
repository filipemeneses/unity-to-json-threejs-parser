import type * as THREE from 'three';
import { interpretScene } from './interpretScene';

export const createUnityJsonToThreeJsParser = ({ THREE, GLTFLoader }) => {
  const parseGltf = async (fbxObject: any): Promise<THREE.Group> => (
    new Promise((resolve, reject) => {
      new GLTFLoader().parse(fbxObject, '', (e: any) => {
        resolve(e);
      }, (e: any) => {
        reject(e);
      });
    })
  );
  function decode(base64: string) {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i += 1) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  const cloneGltf = (gltf: any) => {
    const clone = {
      animations: gltf.animations,
      scene: gltf.scene.clone(true),
    };

    const skinnedMeshes: any = {};

    gltf.scene.traverse((node: any) => {
      if (node.isSkinnedMesh) {
        skinnedMeshes[node.name] = node;
      }
    });

    const cloneBones: any = {};
    const cloneSkinnedMeshes: any = {};

    clone.scene.traverse((node: any) => {
      if (node.isBone) {
        cloneBones[node.name] = node;
      }

      if (node.isSkinnedMesh) {
        cloneSkinnedMeshes[node.name] = node;
      }
    });

    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const name in skinnedMeshes) {
      const skinnedMesh = skinnedMeshes[name];
      const { skeleton } = skinnedMesh;
      const cloneSkinnedMesh = cloneSkinnedMeshes[name];

      const orderedCloneBones = [];

      for (let i = 0; i < skeleton.bones.length; i += 1) {
        const cloneBone = cloneBones[skeleton.bones[i].name];
        orderedCloneBones.push(cloneBone);
      }

      cloneSkinnedMesh.bind(
        new THREE.Skeleton(orderedCloneBones, skeleton.boneInverses),
        cloneSkinnedMesh.matrixWorld,
      );
    }

    return clone;
  };

  type ThreeJSObject = THREE.PerspectiveCamera | THREE.Group

  const parseUnityJsonToThreejs = async (unitySceneContext: any): Promise<ThreeJSObject[]> => {
    const threeJsParsable: any = await interpretScene(unitySceneContext);
    const gltfObjects: any = {};

    await Promise.all(Object.entries(threeJsParsable.references)
      .map(async ([key, value]) => {
        try {
          gltfObjects[key] = await parseGltf(
            decode(value as string),
          );
        } catch (e) {
          console.error(e);
        }
      }));

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

  return parseUnityJsonToThreejs;
};
