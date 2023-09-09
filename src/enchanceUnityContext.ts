export const enchanceUnityContext = (unitySceneName: string, unityContext: any) => {
  const unityFiles = unityContext.files;
  const sceneData = unityFiles.find((f) => f.filepath.includes(unitySceneName))?.data;

  const metaFiles = unityFiles.filter((f) => f.filepath.endsWith('meta'));
  const guidMapping = metaFiles.reduce((obj: any, file: any) => {
    const guid = file?.data?.guid || file?.data?.[0]?.guid;
    obj[guid] = file;

    return obj;
  }, {});

  if (!guidMapping || !Object.keys(guidMapping)?.length) {
    return {};
  }

  const filepathMapping = unityFiles.reduce((obj, file) => {
    obj[file.filepath] = file;

    return obj;
  }, {});

  if (!filepathMapping || !Object.keys(filepathMapping)?.length) {
    return {};
  }

  const fileIdMapping = sceneData.reduce((mapping: {[key: string]: any}, nextItem: any) => {
    // eslint-disable-next-line no-param-reassign
    mapping[nextItem.fileId] = nextItem;
    return mapping;
  }, {});

  return {
    sceneData,
    metaFiles,
    guidMapping,
    filepathMapping,
    fileIdMapping,
  };
};
