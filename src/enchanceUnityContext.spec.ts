import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { enchanceUnityContext } from './enchanceUnityContext';

describe('enchanceUnityContext', () => {
  it('should parse unity JSON file with a given scene', async () => {
    const sceneJson = JSON.parse(
      (await readFile(resolve(__dirname, './fixture/unityProject.json'))).toString(),

    );
    const context = enchanceUnityContext('SampleScene.unity', sceneJson);

    expect(
      Object.keys(context),
    ).toEqual(['sceneData', 'metaFiles', 'guidMapping', 'filepathMapping', 'fileIdMapping']);

    expect(
      context.sceneData,
    ).toHaveLength(17);
    expect(
      context.metaFiles,
    ).toHaveLength(64);
    expect(
      Object.values(context.guidMapping),
    ).toHaveLength(64);
    expect(
      Object.values(context.filepathMapping),
    ).toHaveLength(66);
    expect(
      Object.values(context.fileIdMapping),
    ).toHaveLength(17);
  });
});
