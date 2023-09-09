import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export const mountThreeJsBaseScene = (container: Element) => {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
  });

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    2000,
  );
  camera.position.set(100, 200, 300);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000);
  scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000);

  const grid = new THREE.GridHelper(2000, 20, 0x000000, 0x000000);
  grid.material.opacity = 0.2;
  grid.material.transparent = true;
  scene.add(grid);

  // const controls = new OrbitControls( camera, renderer.domElement );

  container.appendChild(renderer.domElement);

  const tick = () => {
    requestAnimationFrame(tick);

    // controls.update();
    renderer.render(scene, camera);
  };

  tick();

  return { scene, camera, renderer };
};
