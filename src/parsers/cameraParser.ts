import { UnitySceneBlockParser } from './types';

export const cameraParser: UnitySceneBlockParser = {
  type: 'camera',
  isParserType(block) {
    return block?.GameObject?.m_TagString === 'MainCamera';
  },
  parseBlock(block, { fileIdMapping, THREE }) {
    const components = block.GameObject.m_Component.map((
      ({ component }: { component: any }) => fileIdMapping[component.fileID]
    ));

    let props = {};

    components.forEach((component: any) => {
      const isTransform = !!component?.Transform;
      if (isTransform) {
        props = {
          ...props,
          transform: component.Transform,
        };
      }

      const isCamera = !!component?.Camera;
      if (isCamera) {
        props = {
          ...props,
          camera: component.Camera,
        };
      }
    });

    const {
      x, y, z,
    } = props.transform.m_LocalPosition;
    const localRotation = props.transform.m_LocalRotation;
    const unityCamera = props.camera;
    const isOrthographic = unityCamera.orthographic === '1';

    const width = window.innerWidth;
    const height = window.innerHeight;

    let camera;

    if (isOrthographic) {
      camera = new THREE.OrthographicCamera(
        width / -2,
        width / 2,
        height / 2,
        height / -2,
        1,
        10000,
      );
    } else {
      camera = new THREE.PerspectiveCamera(
        45,
        width / height,
        1,
        10000,
      );
    }

    camera.position.setX(Number(x) * 100);
    camera.position.setY(Number(y) * 100);
    camera.position.setZ(Number(z) * -100);
    camera.fov = Number(unityCamera['field of view']) + 5.8;

    const rotationW = Number(localRotation.w || 1);
    const rotationX = Number(localRotation.x || 1);
    const rotationY = Number(localRotation.y || 1);
    const rotationZ = Number(localRotation.z || 1);

    camera.updateProjectionMatrix();

    camera.rotation.setFromQuaternion(
      new THREE.Quaternion(rotationX, rotationY, -rotationZ, -rotationW),
    );

    return camera;
  },
};
