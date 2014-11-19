WIDTH = 1280
HEIGHT = 720

FOV = 90
ASPECT = WIDTH / HEIGHT
NEAR = 0.1
FAR = 10000

RANDOM_CUBES_NUMBER = 400

container = document.getElementById 'container'

hasPointerLock = 'pointerLockElement' of document or 'mozPointerLockElement' of document or 'webkitPointerLockElement' of document

if hasPointerLock
  pointerLockChange = (e) ->
    if document.pointerLockElement is container or document.mozPointerLockElement is container or document.webkitPointerLockElement is container
      controls.enabled = true
    else
      controls.enabled = false

  document.addEventListener 'pointerlockchange', pointerLockChange, false
  document.addEventListener 'mozpointerlockchange', pointerLockChange, false
  document.addEventListener 'webkitpointerlockchange', pointerLockChange, false

  pointerLockError = -> console.log 'Pointer Lock is found guilty of crashing this awesome game.'

  document.addEventListener 'pointerlockerror', pointerLockError, false
  document.addEventListener 'mozpointerlockerror', pointerLockError, false
  document.addEventListener 'webkitpointerlockerror', pointerLockError, false

  container.addEventListener 'click', (e) ->
    container.requestPointerLock = container.requestPointerLock or container.mozRequestPointerLock or container.webkitRequestPointerLock
    container.requestPointerLock()

renderer = new THREE.WebGLRenderer()
renderer.setSize WIDTH, HEIGHT
renderer.setClearColor 0xFADED2, 1.0
renderer.shadowMapEnabled = true
container.appendChild renderer.domElement

scene = new THREE.Scene()
scene.fog = new THREE.Fog()

camera = new THREE.PerspectiveCamera FOV, ASPECT, NEAR, FAR
camera.position.set 0, 0, 0

controls = new THREE.PointerLockControls camera
scene.add controls.getObject()

cubeGeometry = new THREE.BoxGeometry 20, 20, 20
cubeMaterial = new THREE.MeshLambertMaterial { color: 0xCC0000 }
cube = new THREE.Mesh cubeGeometry, cubeMaterial
cube.position.set 0, 20, -40
cube.castShadow = true
scene.add cube

cubes = []
for i in [0..RANDOM_CUBES_NUMBER]
  randomNumbers = [Math.random(), Math.random(), Math.random()]
  randomColor = new THREE.Color().setRGB Math.floor(randomNumbers[0] * 256), Math.floor(randomNumbers[1] * 256), Math.floor(randomNumbers[2] * 256)
  randomMaterial = new THREE.MeshLambertMaterial { color: randomColor.getHex() }
  cubes[i] = new THREE.Mesh cubeGeometry, randomMaterial
  cubes[i].position.set randomNumbers[0] * 1000 - 500, randomNumbers[1] * 500, randomNumbers[2] * 1000 - 500
  cubes[i].castShadow = true
  scene.add cubes[i]

planeGeometry = new THREE.PlaneBufferGeometry 1000, 1000
planeMaterial = new THREE.MeshPhongMaterial { color: 0x99CCFF }
plane = new THREE.Mesh planeGeometry, planeMaterial
plane.rotation.x = -Math.PI / 2
plane.receiveShadow = true
scene.add plane

spotLight = new THREE.SpotLight 0xFFFFFF
spotLight.position.set 0, 50, 0
spotLight.target = cube
spotLight.castShadow = true
spotLight.shadowCameraNear = 20
spotLight.shadowCameraFar = 180
scene.add spotLight

light = new THREE.DirectionalLight 0xFFFFFF
light.position.set 500, 400, 500
light.castShadow = true
light.shadowMapWidth = 2048
light.shadowMapHeight = 2048
light.intensity = 1.25
scene.add light

raycaster = new THREE.Raycaster()

playerRays = [
  new THREE.Vector3 0, 0, 1  # Backward
  new THREE.Vector3 1, 0, 0  # Left
  new THREE.Vector3 0, 0, -1 # Forward
  new THREE.Vector3 -1, 0, 0 # Right
]

render = ->
  requestAnimationFrame render

  for i in [0..3]
    playerPosition = controls.getObject().position.clone()
    playerPosition.y -= 10
    raycaster.set playerPosition, playerRays[i]
    intersections = raycaster.intersectObjects cubes
    if intersections.length > 0 and intersections[0].distance < 10
      if i is 0
        console.log 'Backward'
      else if i is 1
        console.log 'Left'
      else if i is 2
        console.log 'Forward'
      else if i is 3
        console.log 'Right'

  controls.update()
  cube.rotation.x += 0.01
  cube.rotation.y += 0.01
  renderer.render scene, camera

render()
