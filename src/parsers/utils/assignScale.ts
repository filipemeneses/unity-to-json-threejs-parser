import type * as THREE from 'three';

export const assignScale = (entity: THREE.Group, scale?: any) => {
  if (!scale) {
    return entity;
  }

  const { x, y, z } = scale;
  const parsed = [
    Number(x) * 100,
    Number(y) * 100,
    Number(z) * -100,
  ];

  entity.scale.set(...parsed);

  return entity;
};
