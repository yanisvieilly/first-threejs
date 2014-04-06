var WIDTH = 1280;
var HEIGHT = 720;

var FOV = 90;
var ASPECT = WIDTH / HEIGHT;
var NEAR = 0.1;
var FAR = 10000;

var RANDOM_CUBES_NUMBER = 400;

var container = document.getElementById('container');

var controls;
var time = Date.now();

var hasPointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

if (hasPointerLock)
{
    var pointerLockChange = function(e) {
        if (document.pointerLockElement === container || document.mozPointerLockElement === container || document.webkitPointerLockElement === container)
            controls.enabled = true;
        else
            controls.enabled = false;
    }

    document.addEventListener('pointerlockchange', pointerLockChange, false);
    document.addEventListener('mozpointerlockchange', pointerLockChange, false);
    document.addEventListener('webkitpointerlockchange', pointerLockChange, false);

    var pointerLockError = function() {
        console.log('Pointer Lock is found guilty of crashing this awesome game.')
    }

    document.addEventListener('pointerlockerror', pointerLockError, false);
    document.addEventListener('mozpointerlockerror', pointerLockError, false);
    document.addEventListener('webkitpointerlockerror', pointerLockError, false);

    container.addEventListener('click', function(e) {
        container.requestPointerLock = container.requestPointerLock || container.mozRequestPointerLock || container.webkitRequestPointerLock;
        container.requestPointerLock();
    });
}

var renderer = new THREE.WebGLRenderer();
renderer.setSize(WIDTH, HEIGHT);
renderer.setClearColor(0xFADED2, 1.0);
renderer.shadowMapEnabled = true;
container.appendChild(renderer.domElement);

var scene = new THREE.Scene();
scene.fog = new THREE.Fog();

var camera = new THREE.PerspectiveCamera(FOV, ASPECT, NEAR, FAR);
camera.position.set(0, 0, 0);

controls = new THREE.PointerLockControls(camera);
scene.add(controls.getObject());

var raycaster = new THREE.Raycaster();

var playerRays = [
    new THREE.Vector3(0, 0, 1),  // Backward
    new THREE.Vector3(1, 0, 0),  // Left
    new THREE.Vector3(0, 0, -1), // Forward
    new THREE.Vector3(-1, 0, 0)  // Right
];

var cubeGeometry = new THREE.CubeGeometry(20, 20, 20);
var cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xCC0000 });
var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(0, 20, -40);
cube.castShadow = true;
scene.add(cube);

var cubes = [];
for (i = 0; i < RANDOM_CUBES_NUMBER; i++)
{
    var randomNumbers = [Math.random(), Math.random(), Math.random()];
    var randomColor = new THREE.Color().setRGB(Math.floor(randomNumbers[0] * 256), Math.floor(randomNumbers[1] * 256), Math.floor(randomNumbers[2] * 256));
    var randomMaterial = new THREE.MeshLambertMaterial({ color: randomColor.getHex() });
    cubes[i] = new THREE.Mesh(cubeGeometry, randomMaterial);
    cubes[i].position.set(randomNumbers[0] * 1000 - 500, randomNumbers[1] * 500, randomNumbers[2] * 1000 - 500);
    cubes[i].castShadow = true;
    scene.add(cubes[i]);
}

var planeGeometry = new THREE.PlaneGeometry(1000, 1000);
var planeMaterial = new THREE.MeshPhongMaterial({ color: 0x99CCFF });
var plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.receiveShadow = true;
scene.add(plane);

var spotLight = new THREE.SpotLight(0xFFFFFF);
spotLight.position.set(0, 50, 0);
spotLight.target = cube;
spotLight.castShadow = true;
spotLight.shadowCameraNear = 20;
spotLight.shadowCameraFar = 180;
scene.add(spotLight);

var light = new THREE.DirectionalLight(0xFFFFFF);
light.position.set(500, 400, 500);
light.castShadow = true;
light.shadowMapWidth = 2048;
light.shadowMapHeight = 2048;
light.intensity = 1.25;
scene.add(light);

function render() {
    requestAnimationFrame(render);

    for (var i = 0; i < 4; i++)
    {
        raycaster.ray.origin.copy(controls.getObject().position);
        raycaster.ray.origin.y -= 10;
        raycaster.ray.direction.copy(playerRays[i]);
        var intersections = raycaster.intersectObjects(cubes);
        if (intersections.length > 0)
            if (intersections[0].distance < 10)
            {
                if (i == 0)
                    console.log('Backward');
                else if (i == 1)
                    console.log('Left');
                else if (i == 2)
                    console.log('Forward');
                else if (i == 3)
                    console.log('Right');
            }
    }

    controls.update(Date.now() - time);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
    time = Date.now();
}

render();
