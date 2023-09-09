import * as THREE from 'three';
import { parseUnityJsonToThreejs } from '../src/parseUnityJsonToThreejs';
import { mountThreeJsBaseScene } from './mountThreeJsBaseScene';
import './style.css';
import unityScene from './unity-scene.json';

const main = async () => {
  const { scene, camera } = mountThreeJsBaseScene(document.querySelector('#app'));

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
