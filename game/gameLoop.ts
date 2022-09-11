import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  PlaneGeometry,
} from "three";
import GameState from "./State";

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

  const state = new GameState();

  const cubes: Mesh<BoxGeometry, MeshBasicMaterial>[] = [];

  for (let i = 0; i < 4; i++) {
    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshBasicMaterial({ color: Math.random() * 0xffffff });
    const cube = new Mesh(geometry, material);

    cube.position.x = Math.random() * 10;
    cube.position.y = Math.random() * 10;

    scene.add(cube);

    cubes.push(cube);
  }

  camera.position.z = 5;

  const speed = {
    x: 0,
    y: 0,
  };

  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      speed.x += 0.01;
    }

    if (event.key === "ArrowRight") {
      speed.x -= 0.01;
    }

    if (event.key === "ArrowUp") {
      speed.y += 0.01;
    }

    if (event.key === "ArrowDown") {
      speed.y -= 0.01;
    }
  });

  function animate() {
    req(animate);

    // handle user input to update state
    cubes.forEach((cube) => {
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
    });

    // allow physics to update state
    speed.x *= 0.93;
    speed.y *= 0.93;

    camera.position.x += speed.x;
    camera.position.y += speed.y;

    // render
    renderer.render(scene, camera);
  }

  animate();
};
