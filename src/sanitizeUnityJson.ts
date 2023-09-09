/* eslint-disable camelcase */
import { parsers } from './parsers';
import { UnitySceneBlockParser } from './parsers/types';

export const sanitizeUnityJson = async ({
  unitySceneName,
  unityContext,
}: {
  unitySceneName: string,
  unityContext: any,
}, {
  blockParsers = parsers,
  extraParsers = [],
}: {
  blockParsers?: UnitySceneBlockParser[],
  extraParsers?: UnitySceneBlockParser[],
} = {}) => {
  const unityFiles = unityContext.files;
  const sceneData = unityFiles.find((f) => f.filepath.includes(unitySceneName))?.data;
  if (!sceneData || !Object.keys(sceneData)?.length) return {};

  const metaFiles = unityFiles.filter((f) => f.filepath.endsWith('meta'));
  const guidMapping = metaFiles.reduce((obj: any, file: any) => {
    const guid = file?.data?.guid || file?.data?.[0]?.guid;
    obj[guid] = file;

    return obj;
  }, {});

  if (!guidMapping || !Object.keys(guidMapping)?.length) return {};

  const filepathMapping = unityFiles.reduce((obj, file) => {
    obj[file.filepath] = file;

    return obj;
  }, {});

  if (!filepathMapping || !Object.keys(filepathMapping)?.length) return {};

  const fileIdMapping = sceneData.reduce((mapping: {[key: string]: any}, nextItem: any) => {
    // eslint-disable-next-line no-param-reassign
    mapping[nextItem.fileId] = nextItem;
    return mapping;
  }, {});

  const instancesReferences: {[key: string]: any} = {};

  const addReference = (key: string, value: any) => {
    instancesReferences[key] = value;
  };

  const allParsers = blockParsers.concat(extraParsers);

  const instancesParsed = (
    await Promise.all(
      sceneData.map(async (block: any) => {
        const parser = allParsers.find((p) => p.isParserType(block));

        if (!parser) {
          return Promise.resolve(null);
        }

        // eslint-disable-next-line no-param-reassign
        block.type = parser.type;

        return (
          parser.parseBlock(block, {
            guidMapping,
            filepathMapping,
            fileIdMapping,
            addReference,
          })
        );
      }),
    )
  ).filter(Boolean);

  const threejsParsable = {
    instances: instancesParsed,
    references: instancesReferences,
  };

  return threejsParsable;
};
