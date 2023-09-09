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
    const unityFiles = unityContext.files;
    const sceneData = unityFiles.find((f) => f.filepath.includes(unitySceneName))?.data;
    if (!sceneData || !Object.keys(sceneData)?.length) return [];

    const metaFiles = unityFiles.filter((f) => f.filepath.endsWith('meta'));
    const guidMapping = metaFiles.reduce((obj: any, file: any) => {
      const guid = file?.data?.guid || file?.data?.[0]?.guid;
      obj[guid] = file;

      return obj;
    }, {});

    if (!guidMapping || !Object.keys(guidMapping)?.length) {
      return [];
    }

    const filepathMapping = unityFiles.reduce((obj, file) => {
      obj[file.filepath] = file;

      return obj;
    }, {});

    if (!filepathMapping || !Object.keys(filepathMapping)?.length) {
      return [];
    }

    const fileIdMapping = sceneData.reduce((mapping: {[key: string]: any}, nextItem: any) => {
    // eslint-disable-next-line no-param-reassign
      mapping[nextItem.fileId] = nextItem;
      return mapping;
    }, {});

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
