// ********************************************************************************************************************
import { Color, DirectionalLight, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
// ********************************************************************************************************************
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// ********************************************************************************************************************
import { VoxelManager } from './code/voxels/voxel-manager';
// ********************************************************************************************************************

// ********************************************************************************************************************
// scene & renderer
// ********************************************************************************************************************
const scene = new Scene();
scene.background = new Color('#333333');
const renderer = new WebGLRenderer({ antialias: true });

// ********************************************************************************************************************
// camera
// ********************************************************************************************************************
const camera = new PerspectiveCamera(50, 1, 0.1, 1000);
camera.position.set(0, 64, -512);
new OrbitControls(camera, renderer.domElement);

// ********************************************************************************************************************
// lighting
// ********************************************************************************************************************
const sun = new DirectionalLight('#f0f0d0', 1.0);
sun.position.set(0, 0.5, 1);
scene.add(sun);

// ********************************************************************************************************************
// voxels
// ********************************************************************************************************************
const voxels = new VoxelManager(scene);

// ********************************************************************************************************************
// initialise
// ********************************************************************************************************************
function initialise() {
    addEventListener('resize', resize);
    document.body.appendChild(renderer.domElement);
    resize();
    update();
}

// ********************************************************************************************************************
// resize
// ********************************************************************************************************************
function resize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// ********************************************************************************************************************
// update
// ********************************************************************************************************************
function update() {
    requestAnimationFrame(update);
    renderer.render(scene, camera);
    voxels.update(camera.position);
}
initialise();