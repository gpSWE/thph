import "./main.css"

import * as THREE from "three"
import { Octree } from "three/addons/math/Octree"
import { Capsule } from "three/addons/math/Capsule"

import createWorld from "./world"

window.addEventListener( "DOMContentLoaded", () => {

	document.fonts.ready.then( async () => {

		document.body.style.opacity = 1

		await run()
	} )
} )

async function run() {

	const clock = new THREE.Clock()

	const scene = new THREE.Scene()

	const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1000 )
	camera.rotation.order = "YXZ"

	const renderer = new THREE.WebGLRenderer( { antialias: true } )
	renderer.setPixelRatio( window.devicePixelRatio )
	renderer.setSize( window.innerWidth, window.innerHeight )

	document.body.insertBefore( renderer.domElement, document.body.firstElementChild )

	const GRAVITY = 25

	const NUM_SPHERES = 100
	const SPHERE_RADIUS = 0.2

	const STEPS_PER_FRAME = 5

	const worldOctree = new Octree()

	const playerCollider = new Capsule( new THREE.Vector3( 0, 0.35, 0 ), new THREE.Vector3( 0, 1, 0 ), 0.35 )

	const playerVelocity = new THREE.Vector3()
	const playerDirection = new THREE.Vector3()

	let playerOnFloor = false
	let mouseTime = 0

	const keyStates = {}

	const vector1 = new THREE.Vector3()
	const vector2 = new THREE.Vector3()
	const vector3 = new THREE.Vector3()

	document.addEventListener( "keydown", ( event ) => {

		keyStates[ event.code ] = true
	} )

	document.addEventListener( "keyup", ( event ) => {

		keyStates[ event.code ] = false
	} )

	window.addEventListener( "mousedown", () => {

		document.body.requestPointerLock()

		mouseTime = performance.now()
	} )

	document.body.addEventListener( "mousemove", ( event ) => {

		if ( document.pointerLockElement === document.body ) {

			camera.rotation.y -= event.movementX / 500
			camera.rotation.x -= event.movementY / 500
		}
	} )

	window.addEventListener( "resize", onWindowResize )

	function onWindowResize() {

		camera.aspect = window.innerWidth / window.innerHeight
		camera.updateProjectionMatrix()

		renderer.setSize( window.innerWidth, window.innerHeight )
	}

	function playerCollisions() {

		const result = worldOctree.capsuleIntersect( playerCollider )

		playerOnFloor = false

		if ( result ) {

			playerOnFloor = result.normal.y > 0

			if ( ! playerOnFloor ) {

				playerVelocity.addScaledVector( result.normal, - result.normal.dot( playerVelocity ) )
			}

			playerCollider.translate( result.normal.multiplyScalar( result.depth ) )
		}
	}

	function updatePlayer( deltaTime ) {

		let damping = Math.exp( - 4 * deltaTime ) - 1

		if ( ! playerOnFloor ) {

			playerVelocity.y -= GRAVITY * deltaTime

			// small air resistance
			damping *= 0.1

		}

		playerVelocity.addScaledVector( playerVelocity, damping )

		const deltaPosition = playerVelocity.clone().multiplyScalar( deltaTime )
		playerCollider.translate( deltaPosition )

		playerCollisions()

		camera.position.copy( playerCollider.end )
	}

	function getForwardVector() {

		camera.getWorldDirection( playerDirection )
		playerDirection.y = 0
		playerDirection.normalize()

		return playerDirection
	}

	function getSideVector() {

		camera.getWorldDirection( playerDirection )
		playerDirection.y = 0
		playerDirection.normalize()
		playerDirection.cross( camera.up )

		return playerDirection
	}

	function controls( deltaTime ) {

		const speedDelta = deltaTime * ( playerOnFloor ? 25 : 8 )

		if ( keyStates[ "KeyW" ] ) {

			playerVelocity.add( getForwardVector().multiplyScalar( speedDelta ) )
		}

		if ( keyStates[ "KeyS" ] ) {

			playerVelocity.add( getForwardVector().multiplyScalar( - speedDelta ) )
		}

		if ( keyStates[ "KeyA" ] ) {

			playerVelocity.add( getSideVector().multiplyScalar( - speedDelta ) )
		}

		if ( keyStates[ "KeyD" ] ) {

			playerVelocity.add( getSideVector().multiplyScalar( speedDelta ) )
		}

		if ( playerOnFloor ) {

			if ( keyStates[ "Space" ] ) {

				playerVelocity.y = 15
			}
		}
	}

	// CUSTOM

	const world = createWorld( { scene } )

	worldOctree.fromGraphNode( world )

	function teleportPlayerIfOob() {

		if ( camera.position.y <= - 25 ) {

			playerCollider.start.set( 0, 0.35, 0 )
			playerCollider.end.set( 0, 1, 0 )
			playerCollider.radius = 0.35
			camera.position.copy( playerCollider.end )
			camera.rotation.set( 0, 0, 0 )
		}
	}

	renderer.setAnimationLoop( () => {

		const deltaTime = Math.min( 0.05, clock.getDelta() ) / STEPS_PER_FRAME

		for ( let i = 0; i < STEPS_PER_FRAME; i ++ ) {

			controls( deltaTime )

			updatePlayer( deltaTime )

			teleportPlayerIfOob()
		}

		renderer.render( scene, camera )
	} )
}
