// ********************************************************************************************************************
import { Color, DirectionalLight, FogExp2, HemisphereLight, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from 'three';
// ********************************************************************************************************************
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// ********************************************************************************************************************
import { VoxelManager } from './code/voxels/voxel-manager';
// ********************************************************************************************************************

// ********************************************************************************************************************
// scene & renderer
// ********************************************************************************************************************
const scene = new Scene();
scene.background = new Color('#0099ff');
scene.fog = new FogExp2('#0099ff', 0.007);
const renderer = new WebGLRenderer({ antialias: false });
renderer.shadowMap.enabled = true;

// ********************************************************************************************************************
// camera
// ********************************************************************************************************************
const camera = new PerspectiveCamera(50, 1, 0.1, 200);
camera.position.set(0, 40, -70);
new OrbitControls(camera, renderer.domElement);

// ********************************************************************************************************************
// hemisphere light
// ********************************************************************************************************************
const hemisphere = new HemisphereLight('#0094ff', '#007f0e', 1);
hemisphere.position.set(0, 100, 0);
scene.add(hemisphere);

// ********************************************************************************************************************
// sun light
// ********************************************************************************************************************
const sun = new DirectionalLight('#ffffa0', 1);
sun.castShadow = true;
sun.shadow.camera.top = 50;
sun.shadow.camera.bottom = -50;
sun.shadow.camera.left = -50;
sun.shadow.camera.right = 50;
sun.shadow.mapSize.width = 1024;
sun.shadow.mapSize.height = 1024;
sun.shadow.camera.near = 0.1;
sun.shadow.camera.far = 200;
sun.position.set(0, 100, 100);
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
    voxels.update(new Vector3());
    requestAnimationFrame(update);
    renderer.render(scene, camera);
}
initialise();
