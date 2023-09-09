import { cameraParser } from './cameraParser';
import { prefabParser } from './prefabParser';
import { lightParser } from './lightParser';
import { UnitySceneBlockParser } from './types';
import { ambientLightParser } from './ambientLightParser';

export const parsers: UnitySceneBlockParser[] = [
  prefabParser,
  cameraParser,
  lightParser,
  ambientLightParser,
];
