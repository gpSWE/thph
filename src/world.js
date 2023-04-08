import * as THREE from "three"
import { fromLonLat } from "./lib/fromLonLat"
import { Earcut } from "./lib/Earcut"
import d_landuse_low from "./data/d_landuse_low"

export default ( { scene } ) => {

	const world = new THREE.Object3D()

	scene.add( world )

	{
		const vertices2D = []
		const vertices3D = []

		for ( const [ lon, lat ] of d_landuse_low.geometry.coordinates[ 0 ] ) {

			const [ x, z ] = fromLonLat( lon, lat )

			vertices2D.unshift( [ x * 0.01, z * 0.01 ] )
			vertices3D.push( x * 0.01, 0, z * 0.01 )
		}

		const indices = Earcut.triangulate( vertices2D.flat() )

		const geometry = new THREE.BufferGeometry().setAttribute( "position", new THREE.Float32BufferAttribute( vertices3D, 3 ) )
		geometry.setIndex( indices )
		const material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true, } )
		const mesh = new THREE.Mesh( geometry, material )

		world.add( mesh )
	}

	const center = new THREE.Vector3()
	new THREE.Box3().setFromObject( world ).getCenter( center )
	world.position.sub( center )

	return world
}
