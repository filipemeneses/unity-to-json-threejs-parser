/* eslint-disable no-param-reassign */
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPixelatedPass } from 'three/addons/postprocessing/RenderPixelatedPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

export const createPixelPostprocessing = ({
  THREE,
  camera,
  renderer,
  scene,
}) => {
  const PIXEL_SIZE = 8;

  const rendererSize = renderer.getSize(new THREE.Vector2());
  const aspectRatio = rendererSize.x / rendererSize.y;
  const pixelsPerScreenWidth = Math.floor(rendererSize.x / PIXEL_SIZE);
  const pixelsPerScreenHeight = Math.floor(rendererSize.y / PIXEL_SIZE);

  const composer = new EffectComposer(renderer);
  const renderPixelatedPass = new RenderPixelatedPass(6, scene, camera);
  composer.addPass(renderPixelatedPass);

  const outputPass = new OutputPass();
  composer.addPass(outputPass);

  renderPixelatedPass.setPixelSize(PIXEL_SIZE);

  function pixelAlignFrustum() {
  // 0. Get Pixel Grid Units
    const worldScreenWidth = ((camera.right - camera.left) / camera.zoom);
    const worldScreenHeight = ((camera.top - camera.bottom) / camera.zoom);
    const pixelWidth = worldScreenWidth / pixelsPerScreenWidth;
    const pixelHeight = worldScreenHeight / pixelsPerScreenHeight;

    // 1. Project the current camera position along its local rotation bases
    const camPos = new THREE.Vector3(); camera.getWorldPosition(camPos);
    const camRot = new THREE.Quaternion(); camera.getWorldQuaternion(camRot);
    const camRight = new THREE.Vector3(1.0, 0.0, 0.0).applyQuaternion(camRot);
    const camUp = new THREE.Vector3(0.0, 1.0, 0.0).applyQuaternion(camRot);
    const camPosRight = camPos.dot(camRight);
    const camPosUp = camPos.dot(camUp);

    // 2. Find how far along its position is along these bases in pixel units
    const camPosRightPx = camPosRight / pixelWidth;
    const camPosUpPx = camPosUp / pixelHeight;

    // 3. Find the fractional pixel units and convert to world units
    const fractX = camPosRightPx - Math.round(camPosRightPx);
    const fractY = camPosUpPx - Math.round(camPosUpPx);

    // 4. Add fractional world units to the left/right top/bottom to align with the pixel grid
    camera.left = -aspectRatio - (fractX * pixelWidth);
    camera.right = aspectRatio - (fractX * pixelWidth);
    camera.top = 1.0 - (fractY * pixelHeight);
    camera.bottom = -1.0 - (fractY * pixelHeight);
    camera.updateProjectionMatrix();
  }
  const pixelRender = () => {
    pixelAlignFrustum();
    composer.render();
  };

  return { pixelAlignFrustum, pixelRender };
};
