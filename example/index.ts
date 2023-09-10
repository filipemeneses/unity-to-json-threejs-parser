import * as THREE from 'three';
import { createUnityJsonToThreeJsParser } from '../src/createUnityJsonToThreeJsParser';
import { mountThreeJsBaseScene } from './mountThreeJsBaseScene';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import './style.css';
import unityContext from './unity-scene.json';

const main = async () => {
  const { scene, camera } = mountThreeJsBaseScene(document.querySelector('#app'));
  const parseUnityJsonToThreejs = createUnityJsonToThreeJsParser({
    THREE,
    GLTFLoader
  });
  const instances = await parseUnityJsonToThreejs('SampleScene', unityContext);

  instances.forEach((instance) => {
    if (instance instanceof THREE.Camera) {
      camera.copy(instance);
    } else {
      if (Array.isArray(instance)) {
        instance.forEach(i=>scene.add(i))
      } else {
       scene.add(instance);
      }
    }
  });
};

main();
