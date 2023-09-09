import type * as THREE from 'three';

export const assignPosition = (entity: THREE.Group, position?: any) => {
  if (!position) {
    return entity;
  }

  const { x, y, z } = position;
  const parsed = [
    Number(x) * 100,
    Number(y) * 100,
    Number(z) * -100,
  ];

  entity.position.set(...parsed);

  return entity;
};
