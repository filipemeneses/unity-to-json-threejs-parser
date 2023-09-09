export const createGltfClonner = ({ THREE }) => (gltf: any) => {
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
