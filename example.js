import React from 'react';
import * as THREE from 'three';
import { PointLight, AmbientLight } from 'three';
import { GridHelper } from 'three/src/helpers/GridHelper'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader'

// import './App.css';


const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75,window.innerWidth / window.innerHeight,0.1,1000)
camera.position.z = 5

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const plight = new PointLight(0xffffff)
const alight = new AmbientLight()
const gridHelper = new GridHelper(200, 50)
const orbitHelper = new OrbitControls(camera,renderer.domElement)

scene.add(plight,alight,gridHelper,orbitHelper)


const plane = () => {
  
  var size = {x:10,y:10,z:1}

  const geometery = new THREE.BoxGeometry(size.x,size.y,size.z)
  const material = new THREE.MeshBasicMaterial({color:0x00ff00})
  const plane = new THREE.Mesh(geometery, material)
  scene.add(plane)
}

function animate(){ 
  requestAnimationFrame(animate)
  
  plane.rotateX(+0.01)
  plane.rotateY(+0.005)
  plane.rotateZ(+0.02)
  
  renderer.render(scene, camera, plight)
}
  
animate()


function App() {
  return (
    <></>
  );
}

export default App;