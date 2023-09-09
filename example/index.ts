import * as THREE from 'three';
import { createUnityJsonToThreeJsParser } from '../src/createUnityJsonToThreeJsParser';
import { mountThreeJsBaseScene } from './mountThreeJsBaseScene';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import './style.css';
import unityScene from './unity-scene.json';

const main = async () => {
  const { scene, camera } = mountThreeJsBaseScene(document.querySelector('#app'));
  const parseUnityJsonToThreejs = createUnityJsonToThreeJsParser({
    THREE,
    GLTFLoader
  });
  const instances = await parseUnityJsonToThreejs(unityScene);

  instances.forEach((instance) => {
    if (instance instanceof THREE.Group) {
      scene.add(instance);
    }
    if (instance instanceof THREE.Camera) {
      camera.copy(instance);
    }
  });
};

main();
