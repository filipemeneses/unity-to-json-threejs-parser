import type * as THREE from 'three';

const parseGltf = async (GLTFLoader: any, fbxObject: any): Promise<THREE.Group> => (
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

export const decodeAllEntriesAsGltf = async (
  GLTFLoader: any,
  { filepathMapping, unityFiles },
) => {
  const gltfObjects: {[key:string]: any} = {};
  await Promise.all(
    unityFiles
      .filter((f) => f.filepath.endsWith('.fbx'))
      .map(async (f) => {
        const metaFile = filepathMapping[`${f.filepath}.meta`];
        const { guid } = metaFile.data[0];
        const value = f.data;
        gltfObjects[guid] = await parseGltf(
          GLTFLoader,
          decode(value as string),
        );
      }),
  );
  return gltfObjects;
};
