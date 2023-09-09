import type * as THREE from 'three';
import { decodeAllEntriesAsGltf } from './decodeAllEntriesAsGltf';
import { createGltfClonner } from './three/createGltfClonner';
import { sanitizeUnityJson } from './sanitizeUnityJson';
import type { UnitySceneBlockParser } from './parsers/types';
import { enchanceUnityContext } from './enchanceUnityContext';

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
    const unityFiles = unityContext.files;

    const {
      sceneData,
      metaFiles,
      guidMapping,
      filepathMapping,
      fileIdMapping,
    } = enchanceUnityContext(unitySceneName, unityContext);

    if (!sceneData || !Object.keys(sceneData)?.length) return [];

    const gltfByGuid: any = await decodeAllEntriesAsGltf(
      GLTFLoader,
      { unityFiles, filepathMapping },
    );

    return sanitizeUnityJson(
      {
        sceneData,
        unityContext,
        metaFiles,
        guidMapping,
        filepathMapping,
        fileIdMapping,
        gltfByGuid,

        THREE,
        cloneGltf,
      },
      {
        extraParsers: sanitizers,
      },
    );
  };
};
