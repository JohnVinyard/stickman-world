import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
} from "three";

let GAME_LOOP_STARTED = false;

export const startGameLoop = (
  win: Window,
  req: (callback: FrameRequestCallback) => number
) => {
  if (GAME_LOOP_STARTED) {
    return;
  }

  GAME_LOOP_STARTED = true;

  const scene = new Scene();
  const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  const renderer = new WebGLRenderer();
  renderer.setSize(win.innerWidth, win.innerHeight);
  const canvas = document.getElementById(renderer.domElement.id);
  if (canvas !== null) {
    document.body.removeChild(canvas);
  }
  document.body.prepend(renderer.domElement);

  const geometry = new BoxGeometry(1, 1, 1);
  const material = new MeshBasicMaterial({ color: 0x00ffff });
  const cube = new Mesh(geometry, material);
  scene.add(cube);

  camera.position.z = 5;

  function animate() {
    req(animate);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
  }

  animate();
};
