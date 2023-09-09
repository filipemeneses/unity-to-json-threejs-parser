import { UnitySceneBlockParser } from './types';
/* eslint-disable camelcase */
export const prefabParser: UnitySceneBlockParser = {
  type: 'prefab',
  isParserType(block: any) {
    return !!block.PrefabInstance;
  },
  parseBlock(block: any, { guidMapping, filepathMapping, addReference }) {
    const { type } = block;
    const { m_SourcePrefab, m_Modification } = block.PrefabInstance;
    const { guid } = m_SourcePrefab;
    const file = guidMapping[guid];

    if (!file) {
      console.warn('File source is missing. Block:', block);
      return null;
    }

    const { filepath } = guidMapping[guid];
    const { data } = filepathMapping[filepath.replace('.meta', '')];

    // eslint-disable-next-line no-param-reassign
    addReference(guid, data);

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

    return {
      sourceGuid: guid,
      props: instanceProps,
    };
  },
};
