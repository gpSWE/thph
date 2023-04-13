import * as THREE from "three"
import * as turf from "@turf/turf"
import { fromLonLat } from "./lib/fromLonLat"
import { Earcut } from "./lib/Earcut"
import LAND from "./data/land"
import VIRGINIA from "./data/virginia"

export default ( { scene } ) => {

	const world = new THREE.Object3D()

	scene.add( world )

	{
		const light = new THREE.DirectionalLight( 0xffffff, 0.5 )
		light.position.set( 0, 50, 0 )
		scene.add( light )
	}

	{
		const light = new THREE.HemisphereLight( 0x0000ff, 0xffffff, 0.5 )
		light.position.set( 0, 50, 0 )
		scene.add( light )
	}

	// LAND

	{
		const geometry = new THREE.BufferGeometry()
		geometry.setIndex( LAND.index )
		geometry.setAttribute( "position", new THREE.Float32BufferAttribute( LAND.position, 3 ) )
		geometry.setAttribute( "uv", new THREE.Float32BufferAttribute( LAND.uv, 2 ) )
		geometry.setAttribute( "normal", new THREE.Float32BufferAttribute( LAND.normal, 3 ) )
		geometry.rotateX( - Math.PI / 2 )
		const material = new THREE.MeshStandardMaterial( { color: 0x00ff00 } )
		const mesh = new THREE.Mesh( geometry, material )
		world.add( mesh )
	}

	for ( const data of VIRGINIA ) {

		let depthTest = false

		if (
			data.properties.type === "house" ||
			data.properties.type === "school"
		) {

			depthTest = true
		}

		const material = new THREE.MeshNormalMaterial( { depthTest: depthTest } )

		const geometry = new THREE.BufferGeometry()
		geometry.setIndex( data.index )
		geometry.setAttribute( "position", new THREE.Float32BufferAttribute( data.position, 3 ) )
		geometry.setAttribute( "uv", new THREE.Float32BufferAttribute( data.uv, 2 ) )
		geometry.setAttribute( "normal", new THREE.Float32BufferAttribute( data.normal, 3 ) )
		geometry.rotateX( - Math.PI / 2 )
		const mesh = new THREE.Mesh( geometry, material )
		world.add( mesh )
	}

	return world
}
