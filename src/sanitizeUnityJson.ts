/* eslint-disable camelcase */
import { parsers } from './parsers';
import { UnitySceneBlockParser } from './parsers/types';

export const sanitizeUnityJson = async ({
  sceneData,
  unityContext,
  metaFiles,
  guidMapping,
  filepathMapping,
  fileIdMapping,
  gltfByGuid,

  THREE,
  cloneGltf,
}: {
  sceneData: any
  unityContext: any,
  metaFiles: any,
  guidMapping: any,
  filepathMapping: any,
  fileIdMapping: any,
  gltfByGuid: any,

  THREE: any,
  cloneGltf: any,
}, {
  blockParsers = parsers,
  extraParsers = [],
}: {
  blockParsers?: UnitySceneBlockParser[],
  extraParsers?: UnitySceneBlockParser[],
} = {}) => {
  const allParsers = blockParsers.concat(extraParsers);
  const environment = {
    unityContext,
    metaFiles,
    guidMapping,
    filepathMapping,
    fileIdMapping,
    gltfByGuid,

    THREE,
    cloneGltf,
  };

  const instancesParsed = (
    await Promise.all(
      sceneData.map(async (block: any) => {
        const parser = allParsers.find((p) => p.isParserType(block, environment));

        if (!parser) {
          return Promise.resolve(null);
        }

        return (
          parser.parseBlock(block, environment)
        );
      }),
    )
  ).filter(Boolean);

  return instancesParsed;
};
