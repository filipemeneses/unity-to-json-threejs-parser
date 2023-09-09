export const getBlockComponents = (block: any, fileIdMapping: any) => (
  (block?.GameObject?.m_Component ?? []).map(
    (c) => fileIdMapping[c?.component?.fileID],
  ).filter(Boolean)
);
