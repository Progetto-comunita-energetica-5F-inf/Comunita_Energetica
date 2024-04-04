import * as THREE from 'three';
import { Building, BuildingType, Vector3D } from './models/map';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { PointLight } from 'three';
import { graphics, GraphicsPresets, GraphicsSettings, Quality } from './models/graphics';

//! VITE IMAGE IMPORTS
//? Vite imports images like this, typescript will say its wrong but the vite compiler works
//@ts-ignore 
import bg from "../static/images/ground.jpg";
//@ts-ignore
import sk from "../static/images/sky.jpg";
//! VITE IMAGE IMPORTS

//! TODOS
//TODO: ADD PLACED BUILDINGS TO THE GRID MATRIX
//TODO: REORGANIZE EVERYTHING
//TODO: UPDATE GRAPHICS FUNCTION
//TODO: 1/2 ADD A SPHERE AROUND THE CAMERA WITH CLOUDS TEXTURE AND A LIGHT AT THE TOP AND BOTTOM, 
//TODO: 2/2 MAKE THE SPHERE TURN TO SIMULATE SUNLIGHT AND MOONLIGHT, COLOR THE cursor ACCORDINGLY
//! TODOS

//! GRAPHICS SETTINGS
//? Used throughout the project to decide graphical feqqqqatures
let graphicsSettings: GraphicsSettings;
//? Can be set to use different presets (High, Medium, Low)
graphicsSettings = graphics(GraphicsPresets.High);
//? Or use custom settings
graphicsSettings = {
	ground: false,
	lights: true,
	fog: false,
	antialiasing: false,
	quality: Quality.LowPower
} as GraphicsSettings; // Unnecessary but makes sure its clear
//! GRAPHICS SETTINGS

//? Defines the size of the grid, will later be take the information dynamically from a json
let gridSize = {
	x: 10,
	y: 10
}
let grid: THREE.Mesh[][][] = []; // Contains every entity in the scene for esier access, [0] holds the grid tiles
let selection: THREE.Mesh[][] = []; // Currently selected grid or eventual building

//! THREEjs SETUP
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer({canvas: artifactCanvas, antialias: graphicsSettings.antialiasing });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.powerPreference = graphicsSettings.quality;
document.body.appendChild( renderer.domElement );
//! THREEJS SETUP

//! SCENE SETUP
const light = new PointLight(0xffffff, 400); // Follows the camera for general lighting
const cursor = new PointLight(0xffff00, 5); // Light below the pointer
const cursorLighting = new PointLight(0xffff00, 2); // Light above the pointer
let pointer = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.0, 0.8), new THREE.MeshStandardMaterial({color:0xff0000}))
pointer.position.y = 0.5;
cursorLighting.position.y = 2;
cursor.add(pointer, cursorLighting);
light.position.y = 10;
cursor.position.y = 1.5;
cursor.decay = 1;
const texture = new THREE.TextureLoader().load( bg );
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set( 25 + gridSize.x, 25 + gridSize.x );
let gruond = new THREE.Mesh(new THREE.CircleGeometry(50 + Math.max(gridSize.x, gridSize.y), 32), new THREE.MeshStandardMaterial({map:texture}))
gruond.rotation.x = -1.566666; //? Horizontal rotation for some reason
gruond.position.y = 0;
const sky = new THREE.TextureLoader().load( sk );
sky.wrapS = THREE.RepeatWrapping;
sky.wrapT = THREE.RepeatWrapping;
let globeGeometry = new THREE.SphereGeometry(200, 100, 100)
let globe = new THREE.Mesh(globeGeometry, new THREE.MeshStandardMaterial({map:sky, side: THREE.DoubleSide}))
scene.add(new THREE.AmbientLight(), cursor, globe)
if (graphicsSettings.lights) scene.add(light); else light.intensity = 0;
if (graphicsSettings.ground) scene.add(gruond);
if (graphicsSettings.fog) scene.fog = new THREE.Fog( 0x444444, 0, 200 );
//! SCENE SETUP

//! CONTROLS
const controls = new OrbitControls(camera, renderer.domElement)
controls.maxDistance = 20;
controls.minDistance = 13;
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.rotateSpeed = 0.3;
controls.enableZoom = false;
//! CONTROLS

function buildEntity(building: Building, color: number) {
	const geometry = new THREE.BoxGeometry(building.size.x * 0.95, building.size.y * 0.95, building.size.z * 0.95);
	const material = new THREE.MeshStandardMaterial( { color: color } );
	const cube = new THREE.Mesh( geometry, material );
	//? Everything is shifted by 0.5 in both x and z to center the pointer selection
	cube.position.z = building.position.z + 0.5;
	cube.position.x = building.position.x + 0.5;
	cube.position.y = building.position.y;
	scene.add( cube );
	return cube;
}

//! BUILD GRID
function buildGrid(gridSize): THREE.Mesh[][] {
	let tempGrid: THREE.Mesh[][] = []
	for (let index = 0; index < gridSize.x; index++) {
		let temp: THREE.Mesh[] = []
		for (let jndex = 0; jndex < gridSize.y; jndex++) {
			temp.push(buildEntity({
				type: BuildingType.GridTile,
				position: {x:index, y:1, z:jndex},
				size: {x:1, y:0.01, z:1}
			}, 0x999999))
		}
		tempGrid.push(temp);
		temp = [];
	}
	return tempGrid;
}
grid.push(buildGrid(gridSize)); //* POSITION 0: GRID
grid.push([]);                  //* POSITION 1: BUILDINGS
grid.push([]);                  //* POSITION 2: SOLAR PANELS
//? Fill the grids with dummy data
for (let index = 0; index < gridSize.x; index++) {
	let temp: THREE.Mesh[] = []
	for (let jndex = 0; jndex < gridSize.y; jndex++) {
		temp.push(buildEntity({type: BuildingType.SolarPanel, position: {x: 0, y: 0, z: 0}, size: {x: 0, y: 0, z: 0}}, 0x000000));
	}
	grid[1].push(temp);
	grid[2].push(temp);
}
//! BUILD GRID

let selectionBuilding: THREE.Mesh[][] = [];
let hovered = grid[0][Math.floor(cursor.position.x)][Math.floor(cursor.position.z)].position;
function cursorPosition() {
	//pointer.position.y = 0.5;
	try {
		selectionBuilding = grid[1][Math.floor(hovered.x)][Math.floor(hovered.z)];
		hovered = grid[0][Math.floor(cursor.position.x)][Math.floor(cursor.position.z)].position;
		selection.material.color = new THREE.Color(0x999999);
	} catch (e) {
		// ignore
	}
	let col = grid[1][Math.floor(hovered.x)][Math.floor(hovered.z)].material.color;
	selectionBuilding.material.color = new THREE.Color(0x555555);
	console.log(col);
	
	if (col.r + col.g + col.b > 0) {
		
		selectionBuilding = grid[1][Math.floor(hovered.x)][Math.floor(hovered.z)];
		selectionBuilding.material.color = new THREE.Color(0xffff00);
	} else {
	}
	selection = grid[0][Math.floor(hovered.x)][Math.floor(hovered.z)]
	selection.material.color = new THREE.Color(0xffff00);
	//pointer.position.y += selection.scale.y;
}

let halfX = Math.floor(grid[0].length / 2)
let halfY = Math.floor(grid[0][halfX].length / 2)

gruond.position.x = grid[0][halfX][halfY].position.x;
gruond.position.z = grid[0][halfX][halfY].position.z;
controls.target.x = grid[0][halfX][halfY].position.x;
controls.target.z = grid[0][halfX][halfY].position.z;
controls.mouseButtons.RIGHT = THREE.MOUSE.ROTATE;
controls.mouseButtons.LEFT = THREE.MOUSE.PAN;

globe.position.x = halfX;
globe.position.z = halfY;

//? Debug function that shows basic information about the camera and target
let debugCondition = false;
function debugging() {
	let round = (num: number) => Math.floor(num * 100) / 100;
	return "\nCAMERA ROTATION\n\tX: " + round(camera.rotation.x) +
		"\n\tZ: " + round(camera.rotation.z) +
		"\n\tY: " + round(camera.rotation.y) +
		"\n\nCAMERA POSITION\n\tX: " + round(camera.position.x) +
		"\n\tZ: " + round(camera.position.z) +
		"\n\tY: " + round(camera.position.y) +
		"\n\nTARGET POSITION" +
		"\n\tX: " + round(controls.target.x) +
		"\n\tZ: " + round(controls.target.z) +
		"\n\tY: " + round(controls.target.y) +
		"\n\nDISTANCE FROM TARGET: " + round(controls.getDistance())
}
//? Simple function that moves the pointer up and down
let animationCondition = false;
function pointerAnimation() {
	let p = pointer.position.y;
	if (p >= 0.5) animationCondition = true;
	if (p <= 0) animationCondition = false;
	if (animationCondition) pointer.position.y -= 0.01;		
	else pointer.position.y += 0.01;
}
function updateCameraPosition() {
	light.position.z = camera.position.z;
	light.position.x = camera.position.x;
	cursor.position.z = controls.target.z;
	cursor.position.x = controls.target.x;
	camera.position.y = 10;
	controls.target.y = 0;
}

function placeBuilding(building: Building) {
	const widthFix = 0.15; // Added to x and z size to fill the gaps between grid tiles
	let position = building.position;
	let size = building.size;	
	let placedBuilding = buildEntity({
		type: building.type,
		position: {
			x: position.x - +(size.x % 2 == 0) * 0.5, 
			z: position.z - +(size.z % 2 == 0) * 0.5, 
			y: 1 + size.y / 2
		},
		size: {
			//? +boolean >> true: 1, false: 0, ex1: +false >> 1, ex2: 2 + +true >> 3
			//? Funky javascript ¯\_(ツ)_/¯
			x: size.x + +(size.x > 1) * widthFix, 
			z: size.z + +(size.z > 1) * widthFix,
			y: size.y
		}
	}, 0x555555)
	grid[1][position.x][position.z] = placedBuilding;

}

[
	{type: BuildingType.House, position: {x: 3, z: 3, y: 0}, size: {x: 2, z:3, y: 1}},
	{type: BuildingType.House, position: {x: 6, z: 3, y: 0}, size: {x: 3, z:1, y: 1}},
].forEach(building => placeBuilding(building))

//! ANIMATION LOOP
function animate() {
	requestAnimationFrame( animate );

	if (debugCondition) console.log(debugging());
	
	//! UPDATE FUNCTIONS
	cursorPosition();
	pointerAnimation();

	//* Must be done last!
	updateCameraPosition(); //? Updates the camera and all its related variables
	//! UPDATE FUNCTIONS

	controls.update();
	renderer.render( scene, camera );
}
animate();
//! ANIMATION LOOP

//! KEYBOARD COMMANDS
//* [SPACE]: Auto rotate
//* [?]: Enable debug information in the console
//* [R]: Reset the cursor to the initial position
document.addEventListener("keyup", e => {
	if (e.key == " ") controls.autoRotate = !controls.autoRotate;
	if (e.key == "?") debugCondition = !debugCondition;
	if (e.key == "r") controls.target.x = halfX; controls.target.z = halfY;
})
//! KEYBOARD COMMANDS