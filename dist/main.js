var ASPECT, FAR, FOV, HEIGHT, NEAR, RANDOM_CUBES_NUMBER, WIDTH, camera, container, controls, cube, cubeGeometry, cubeMaterial, cubes, hasPointerLock, i, light, plane, planeGeometry, planeMaterial, playerRays, pointerLockChange, pointerLockError, randomColor, randomMaterial, randomNumbers, raycaster, render, renderer, scene, spotLight, _i;

WIDTH = 1280;

HEIGHT = 720;

FOV = 90;

ASPECT = WIDTH / HEIGHT;

NEAR = 0.1;

FAR = 10000;

RANDOM_CUBES_NUMBER = 400;

container = document.getElementById('container');

hasPointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

if (hasPointerLock) {
  pointerLockChange = function(e) {
    if (document.pointerLockElement === container || document.mozPointerLockElement === container || document.webkitPointerLockElement === container) {
      return controls.enabled = true;
    } else {
      return controls.enabled = false;
    }
  };
  document.addEventListener('pointerlockchange', pointerLockChange, false);
  document.addEventListener('mozpointerlockchange', pointerLockChange, false);
  document.addEventListener('webkitpointerlockchange', pointerLockChange, false);
  pointerLockError = function() {
    return console.log('Pointer Lock is found guilty of crashing this awesome game.');
  };
  document.addEventListener('pointerlockerror', pointerLockError, false);
  document.addEventListener('mozpointerlockerror', pointerLockError, false);
  document.addEventListener('webkitpointerlockerror', pointerLockError, false);
  container.addEventListener('click', function(e) {
    container.requestPointerLock = container.requestPointerLock || container.mozRequestPointerLock || container.webkitRequestPointerLock;
    return container.requestPointerLock();
  });
}

document.addEventListener('keydown', function(e) {
  if (e.keyCode === 70) {
    container.requestFullScreen = container.requestFullScreen || container.mozRequestFullScreen || container.webkitRequestFullScreen;
    return container.requestFullScreen();
  }
});

renderer = new THREE.WebGLRenderer();

renderer.setSize(WIDTH, HEIGHT);

renderer.setClearColor(0xFADED2, 1.0);

renderer.shadowMapEnabled = true;

container.appendChild(renderer.domElement);

scene = new THREE.Scene();

scene.fog = new THREE.Fog();

camera = new THREE.PerspectiveCamera(FOV, ASPECT, NEAR, FAR);

camera.position.set(0, 0, 0);

controls = new THREE.PointerLockControls(camera);

scene.add(controls.getObject());

cubeGeometry = new THREE.BoxGeometry(20, 20, 20);

cubeMaterial = new THREE.MeshLambertMaterial({
  color: 0xCC0000
});

cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

cube.position.set(0, 20, -40);

cube.castShadow = true;

scene.add(cube);

cubes = [];

for (i = _i = 0; 0 <= RANDOM_CUBES_NUMBER ? _i <= RANDOM_CUBES_NUMBER : _i >= RANDOM_CUBES_NUMBER; i = 0 <= RANDOM_CUBES_NUMBER ? ++_i : --_i) {
  randomNumbers = [Math.random(), Math.random(), Math.random()];
  randomColor = new THREE.Color().setRGB(Math.floor(randomNumbers[0] * 256), Math.floor(randomNumbers[1] * 256), Math.floor(randomNumbers[2] * 256));
  randomMaterial = new THREE.MeshLambertMaterial({
    color: randomColor.getHex()
  });
  cubes[i] = new THREE.Mesh(cubeGeometry, randomMaterial);
  cubes[i].position.set(randomNumbers[0] * 1000 - 500, randomNumbers[1] * 500, randomNumbers[2] * 1000 - 500);
  cubes[i].castShadow = true;
  scene.add(cubes[i]);
}

planeGeometry = new THREE.PlaneBufferGeometry(1000, 1000);

planeMaterial = new THREE.MeshPhongMaterial({
  color: 0x99CCFF
});

plane = new THREE.Mesh(planeGeometry, planeMaterial);

plane.rotation.x = -Math.PI / 2;

plane.receiveShadow = true;

scene.add(plane);

spotLight = new THREE.SpotLight(0xFFFFFF);

spotLight.position.set(0, 50, 0);

spotLight.target = cube;

spotLight.castShadow = true;

spotLight.shadowCameraNear = 20;

spotLight.shadowCameraFar = 180;

scene.add(spotLight);

light = new THREE.DirectionalLight(0xFFFFFF);

light.position.set(500, 400, 500);

light.castShadow = true;

light.shadowMapWidth = 2048;

light.shadowMapHeight = 2048;

light.intensity = 1.25;

scene.add(light);

raycaster = new THREE.Raycaster();

playerRays = [new THREE.Vector3(0, 0, 1), new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, -1), new THREE.Vector3(-1, 0, 0)];

render = function() {
  var intersections, playerPosition, _j;
  requestAnimationFrame(render);
  for (i = _j = 0; _j <= 3; i = ++_j) {
    playerPosition = controls.getObject().position.clone();
    playerPosition.y -= 10;
    raycaster.set(playerPosition, playerRays[i]);
    intersections = raycaster.intersectObjects(cubes);
    if (intersections.length > 0 && intersections[0].distance < 10) {
      if (i === 0) {
        console.log('Backward');
      } else if (i === 1) {
        console.log('Left');
      } else if (i === 2) {
        console.log('Forward');
      } else if (i === 3) {
        console.log('Right');
      }
    }
  }
  controls.update();
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  return renderer.render(scene, camera);
};

render();
