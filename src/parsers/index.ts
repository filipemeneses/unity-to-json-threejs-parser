import { cameraParser } from './cameraParser';
import { prefabParser } from './prefabParser';
import { lightParser } from './lightParser';
import { UnitySceneBlockParser } from './types';
import { ambientLightParser } from './ambientLightParser';
import { directionalLightParser } from './directionalLightParser';
import { planeParser } from './planeParser';

export const parsers: UnitySceneBlockParser[] = [
  prefabParser,
  cameraParser,
  lightParser,
  ambientLightParser,
  directionalLightParser,
  planeParser,
];
