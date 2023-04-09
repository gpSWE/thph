import * as THREE from "three"
import * as turf from "@turf/turf"
import { fromLonLat } from "./lib/fromLonLat"
import { Earcut } from "./lib/Earcut"
import park_low from "./data/park_low"

export default ( { scene } ) => {

	const world = new THREE.Object3D()

	scene.add( world )

	const center = [ 69.24840894433316,41.31650726459839 ] // PARK

	// LAND

	{
		// const vertices = []

		// const land = turf.circle( center, 0.5 ).geometry.coordinates[ 0 ]

		// for ( const [ lon, lat ] of land ) {

		// 	const [ x, y, z ] = fromLonLat( lon, lat, center[ 0 ], center[ 1 ] )

		// 	vertices.push( x, y, z )
		// }

		// const indices = Earcut.triangulate( vertices, [], 3 )

		// const geometry = new THREE.BufferGeometry().setAttribute( "position", new THREE.Float32BufferAttribute( vertices, 3 ) ).setIndex( indices )
		// geometry.rotateX( - Math.PI / 2 )
		// const material = new THREE.MeshBasicMaterial( { color: 0x157c05, wireframe: false } )
		// const mesh = new THREE.Mesh( geometry, material )

		// world.add( mesh )
	}

	// PARK

	{

		const vertices3D = []

		const countours = park_low.features[ 0 ].geometry.coordinates[ 0 ]
		const holes = park_low.features[ 0 ].geometry.coordinates[ 1 ]

		for ( const [ lon, lat ] of countours ) {

			const [ x, y, z ] = fromLonLat( lon, lat, center[ 0 ], center[ 1 ] )

			vertices3D.push( x, y, z )
		}

		for ( const [ lon, lat ] of holes ) {

			const [ x, y, z ] = fromLonLat( lon, lat, center[ 0 ], center[ 1 ] )

			vertices3D.push( x, y, z )
		}

		const indices = Earcut.triangulate( vertices3D, [], 3 )

		const geometry = new THREE.BufferGeometry().setAttribute( "position", new THREE.Float32BufferAttribute( vertices3D, 3 ) ).setIndex( indices )
		geometry.rotateX( - Math.PI / 2 )
		const material = new THREE.MeshBasicMaterial( { color: 0x94e56b, wireframe: false, depthTest: false, } )
		const mesh = new THREE.Mesh( geometry, material )

		world.add( mesh )
	}

	return world
}
