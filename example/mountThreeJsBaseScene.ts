import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createPixelPostprocessing } from './addPixelPostprocessing';

export const mountThreeJsBaseScene = (container: Element) => {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
  });

  const width = window.innerWidth;
  const height = window.innerHeight;

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.BasicShadowMap;

  const camera = new THREE.PerspectiveCamera(
    45,
    width / height,
    1,
    2000,
  );
  camera.position.set(100, 200, 300);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000);
  scene.fog = new THREE.Fog(0xa0a0a0, 200, 5000);

  const grid = new THREE.GridHelper(2000, 20, 0x000000, 0x000000);
  grid.material.opacity = 0.2;
  grid.material.transparent = true;
  scene.add(grid);

  // const directionalLight = new THREE.DirectionalLight(0xfffecd, 1.5);
  // directionalLight.position.set(100, 100, 100);
  // directionalLight.castShadow = true;
  // directionalLight.shadow.mapSize.set(2048, 2048);
  // scene.add(directionalLight);

  const { pixelRender } = createPixelPostprocessing({
    THREE,
    camera,
    renderer,
    scene,
  });
  let render;

  render = () => { renderer.render(scene, camera); };

  // render = () => { pixelRender(); };

  let controls;

  // controls = new OrbitControls(camera, renderer.domElement);

  container.appendChild(renderer.domElement);

  const tick = () => {
    requestAnimationFrame(tick);

    render();

    if (controls) controls.update();
    // renderer.render(scene, camera);
  };

  tick();

  return { scene, camera, renderer };
};
