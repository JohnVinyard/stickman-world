import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  Mesh,
  PlaneGeometry,
  DoubleSide,
  FrontSide,
  DirectionalLight,
  Color,
  SphereGeometry,
  MeshPhongMaterial,
  MultiplyOperation,
  Vector3,
  Vector2,
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
  scene.background = new Color(0x87ceeb);
  const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  const state = new GameState();

  const color = 0xffffff;
  const intensity = 1;
  const light = new DirectionalLight(color, intensity);
  light.position.set(-10, 30, 30);
  light.target.position.set(0, 0, 0);
  scene.add(light);
  scene.add(light.target);

  const renderer = new WebGLRenderer();
  renderer.setSize(win.innerWidth, win.innerHeight);
  const canvas = document.getElementById(renderer.domElement.id);
  if (canvas !== null) {
    document.body.removeChild(canvas);
  }
  document.body.prepend(renderer.domElement);

  const floorGeometry = new PlaneGeometry(100, 100, 1, 1);
  const floorMaterial = new MeshPhongMaterial({
    color: 0xaaaaaa,
    side: DoubleSide,
  });
  const floor = new Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;

  scene.add(floor);

  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      const geometry = new BoxGeometry(3, 50, 3);
      const material = new MeshPhongMaterial({
        color: 0xffffff,
        emissive: 0x0,
        specular: 0x111111,
        shininess: 30,
        combine: MultiplyOperation,
        reflectivity: 1,
        refractionRatio: 0.98,
        side: DoubleSide,
        shadowSide: FrontSide,
      });
      const cube = new Mesh(geometry, material);
      cube.position.y = 25;
      cube.position.x = i * 10;
      cube.position.z = j * 10;

      scene.add(cube);
    }
  }

  const sphere = new SphereGeometry(5);
  const sphereMaterial = new MeshPhongMaterial({
    color: 0xffffff,
    emissive: 0x0,
    specular: 0x111111,
    shininess: 10,
    combine: MultiplyOperation,
    reflectivity: 1,
    refractionRatio: 0.5,
    side: FrontSide,
  });
  const sp = new Mesh(sphere, sphereMaterial);
  sp.position.x = -10;
  sp.position.y = 30;
  sp.position.z = -30;
  scene.add(sp);

  camera.position.y = 1;
  camera.position.z = 50;

  let forwardSpeed = 0;
  let strafeSpeed = 0;

  document.addEventListener("keypress", (event) => {
    if (event.key === "ArrowLeft" || event.key === "a") {
      strafeSpeed += 0.01;
    }

    if (event.key === "ArrowRight" || event.key === "d") {
      strafeSpeed -= 0.01;
    }

    if (event.key === "ArrowUp" || event.key === "w") {
      forwardSpeed += 0.02;
    }

    if (event.key === "ArrowDown" || event.key === "s") {
      forwardSpeed -= 0.02;
    }
  });

  document.addEventListener("mousemove", (event) => {
    const xSpan = document.documentElement.clientWidth / 2;
    const ySpan = document.documentElement.clientHeight / 2;
    const x = event.clientX - xSpan;
    const y = event.clientY - ySpan;
    camera.rotation.y = -((x / xSpan) * Math.PI);
  });

  function animate() {
    req(animate);

    // allow physics to update state
    forwardSpeed *= 0.95;
    strafeSpeed *= 0.95;

    const direction = new Vector3();
    camera.getWorldDirection(direction);

    camera.position.add(direction.multiplyScalar(forwardSpeed));

    // render
    renderer.render(scene, camera);
  }

  animate();
};
