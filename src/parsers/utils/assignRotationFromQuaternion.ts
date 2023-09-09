import type * as THREE from 'three';

export const assignRotationFromQuaternion = (entity: THREE.Group, rotation?: any, THREE: any) => {
  if (!rotation) {
    return entity;
  }

  const {
    x, y, z, w,
  } = rotation;

  const parsed = [
    Number(x || 1),
    Number(y || 1),
    -Number(z || 1),
    -Number(w || 1),
  ];

  entity.rotation.setFromQuaternion(
    new THREE.Quaternion(...parsed),
  );

  return entity;
};
