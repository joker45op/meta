import './App.css'
import * as THREE from 'three'
import { PointLight } from 'three//lights/PointLight'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { GridHelper , PointLightHelper } from 'three'
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls'
import { AmbientLight } from 'three'


// scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x00f5ff)

// camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.z = 2.7
camera.position.y = 3.2
camera.lookAt(0,0.75,0)

// renderer
const renderer = new THREE.WebGL1Renderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// clock
const clock = new THREE.Clock()

// plane
const planeGeometry = new THREE.BoxGeometry(30, 0.01, 30)
const planeMaterial = new THREE.MeshStandardMaterial({color: 0xbb9a59})
const plane = new THREE.Mesh(planeGeometry,planeMaterial)
scene.add(plane)

// point light
const plight = new PointLight(0xffffff)
plight.position.set(5,10,2)
scene.add(plight)

const plightHelper = new PointLightHelper(plight)
scene.add(plightHelper)

//ambient light
const alight = new AmbientLight(0xffffff)
scene.add(alight)

// grid
const gridHelper = new GridHelper(10, 50)
// scene.add(gridHelper)

// orbit controls
// const orbitControls = new OrbitControls(camera,renderer.domElement)
// scene.add(orbitControls)

// character
let character 
const loader = new GLTFLoader()
loader.load('/assets/character/scene.gltf',
  (obj) => {
    character = obj.scene
    character.position.y = 0.005
    character.scale.set(0.1, 0.1, 0.1)
    scene.add(character)  
  },
  (xhr) => { 
    console.log(xhr)
  },
  (err) => { 
    console.log(err)
  }  
)


// road blocks
function create_road(x,z){
  const texture = new THREE.TextureLoader().load('/assets/road.png')
  const road = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.001, 0.5),
    new THREE.MeshBasicMaterial({map:texture})
  )
  road.position.y = 0.01
  road.position.z = -z
  road.position.x = x
  scene.add(road)
}
// creating road
for (let i = 0; i < 5; i += 0.5) {
  create_road(0,i)
  create_road(0.5,i)
  create_road(-0.5, i)
  create_road(0,-i)
  create_road(0.5,-i)
  create_road(-0.5,-i)
}


let building1
function create_building(path,x,y,z,scale,ry = Math.PI){
  loader.load(path,
    (obj) => { 
      building1 = obj.scene
      building1.position.set(x, y, z)
      building1.rotation.y = ry
      building1.scale.set(scale,scale,scale)
      scene.add(building1)
    },
    (xhr) => { },
    (err) => { }
  )
}
create_building('/assets/building1/scene.gltf',1.5,0.001,0,0.012)
create_building('/assets/building1/scene.gltf',1.5,0.001,1.6,0.012)
// create_building('/assets/building1/scene.gltf', 1.5, 0.001, 3.2,0.012)
// create_building('/assets/building1/scene.gltf',1.5,0.001,4.8,0.012)
create_building('/assets/building1/scene.gltf',1.5,0.001,-1.6,0.012)
create_building('/assets/building1/scene.gltf',1.5,0.001,-3.2,0.012)

create_building('/assets/low_poly_building (1)/scene.gltf',-1.35 ,0.001,0,0.3,0)
create_building('/assets/low_poly_building (1)/scene.gltf',-1.35 ,0.001,1.6,0.3,0)
// create_building('/assets/low_poly_building (1)/scene.gltf', -1.35 , 0.001, 3.2,0.3,0)
// create_building('/assets/low_poly_building (1)/scene.gltf',-1.35 ,0.001,4.8,0.3,0)
create_building('/assets/low_poly_building (1)/scene.gltf',-1.35 ,0.001,-1.6,0.3,0)
create_building('/assets/low_poly_building (1)/scene.gltf',-1.35 ,0.001,-3.2,0.3,0)


// image holder
const stand_texture = new THREE.TextureLoader().load('/assets/streetview/stand.jpg')
const stand = new THREE.Mesh(
  new THREE.BoxGeometry(0.5, 0.001, 0.5),
  new THREE.MeshBasicMaterial({map:stand_texture})
)
stand.position.z = -4.8
stand.position.y = 0.1
scene.add(stand)


// animation loop  
let id
function animate() {
  if (character !== undefined) {
    camera.lookAt(character.position.x,character.position.y+0.75,character.position.z)
    // console.log(character.position)
    if (character.position.z >= -5.4 && character.position.z < -4.6) {
      if (document.body.lastChild.tagName === 'CANVAS') {
        document.body.removeChild(document.body.lastChild)
        const img1 = document.createElement("img")
        img1.src = "/assets/streetview/img1.jpeg"
        document.body.appendChild(img1)
        const img2 = document.createElement("img")
        img2.src = "/assets/streetview/img2.jpeg"
        document.body.appendChild(img2)
        const img3 = document.createElement("img")
        img3.src = "/assets/streetview/img3.jpeg"
        document.body.appendChild(img3)
      }
    }
  }
  renderer.render(scene, camera)
  id = requestAnimationFrame(animate)
}
animate()


function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}


// move state
let [ moveForward, moveLeft, moveRight, moveBack] = [false,false,false,false]

// move
function move(char) { 
  if (moveForward) {
    if(moveLeft) char.rotation.y = 3*Math.PI / 4
    char.position.z -= 0.065
    char.rotation.y = Math.PI / 2
  }
  if (moveLeft) {
    char.position.x -= 0.065
    char.rotation.y = Math.PI
  }
  if (moveRight) {
    char.position.x += 0.065
    char.rotation.y = 0
  }
  if (moveBack) {
    char.position.z += 0.065
    char.rotation.y = -Math.PI / 2
  }
}



window.addEventListener('keypress', (e) => {
  if (e.key === 'w' || e.key === 'W') {
    character.rotation.y = Math.PI / 2
    character.position.z -= 0.05
    camera.position.z -= 0.05
  }
  if (e.key === 'a' || e.key === 'A') {     
    character.position.x -= 0.05
    camera.position.x -= 0.05
    character.rotation.y = Math.PI
  }
  if (e.key === 'd' || e.key === 'D') {  
    character.position.x += 0.05
    camera.position.x += 0.05
    character.rotation.y = 0
  }
  if (e.key === 's' || e.key === 'S') {
    character.rotation.y = -Math.PI / 2
    character.position.z += 0.05
    camera.position.z += 0.05
  }  
})




// window.addEventListener('keydown', (e) => { 
//   if (e.key === 'w' || e.key === 'W') {
//     moveForward = true
//   }
//   else if (e.key === 'a' || e.key === 'A') { 
//     moveLeft = true
//     // character.rotation.y += 0.07
//   }
//   else if (e.key === 'd' || e.key === 'D') { 
//     moveRight = true
//     // character.rotation.y -= 0.07
//   }
//   else if (e.key === 's' || e.key === 'S') { 
//     moveBack = true
//   }
//   move(character)
// })

// keyUP
// window.addEventListener('keyup', (e) => { 
//   if (e.key === 'w' || e.key === 'W') {
//     moveForward = false
//   }
//   else if (e.key === 'a' || e.key === 'A') { 
//     moveLeft = false
//     // character.rotation.y += 0.07
//   }
//   else if (e.key === 'd' || e.key === 'D') { 
//     moveRight = false
//     // character.rotation.y -= 0.07
//   }
//   else if (e.key === 's' || e.key === 'S') { 
//     moveBack = false
//   }

  // move(character)
//})



window.addEventListener('resize', onWindowResize())

function App() {

  return (
    <div className="App">
    </div>
  )
}

export default App
