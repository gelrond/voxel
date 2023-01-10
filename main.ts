// ********************************************************************************************************************
import { Color, DirectionalLight, HemisphereLight, PerspectiveCamera, Scene, SpotLight, Vector3, WebGLRenderer } from 'three';
// ********************************************************************************************************************
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// ********************************************************************************************************************
import { VoxelManager } from './code/voxels/voxel-manager';
// ********************************************************************************************************************

// ********************************************************************************************************************
// scene & renderer
// ********************************************************************************************************************
const scene = new Scene();
scene.background = new Color('#111111');
const renderer = new WebGLRenderer({ antialias: true });

// ********************************************************************************************************************
// camera
// ********************************************************************************************************************
const camera = new PerspectiveCamera(50, 1, 0.1, 1000);
camera.position.set(0, 32, -128);
new OrbitControls(camera, renderer.domElement);

// ********************************************************************************************************************
// lighting
// ********************************************************************************************************************
const hemisphere = new HemisphereLight('#e0e0ff', '#a08899', 1);
hemisphere.position.set(0, 512, 0);
scene.add(hemisphere);
const sun = new DirectionalLight('#ffffa0', 1);
sun.position.set(-1, 0.75, 1);
scene.add(sun);

// ********************************************************************************************************************
// voxels
// ********************************************************************************************************************
const voxels = new VoxelManager(scene);
voxels.update(new Vector3());

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
    voxels.update(new Vector3());
}
initialise();
