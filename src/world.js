import * as THREE from "three"

export default ( { scene } ) => {

	const world = new THREE.Object3D()

	scene.add( world )

	{
		const geometry = new THREE.PlaneGeometry( 100, 100, 100, 100 ).rotateX( - Math.PI / 2 )
		const material = new THREE.MeshBasicMaterial( { color: 0x0000ff, wireframe: true, } )
		const mesh = new THREE.Mesh( geometry, material )
		world.add( mesh )
	}

	{
		const geometry = new THREE.BoxGeometry( 5, 2, 5 )
		const material = new THREE.MeshNormalMaterial( { wireframe: true } )
		const mesh = new THREE.Mesh( geometry, material )
		mesh.position.y = 4
		world.add( mesh )
	}

	{
		const geometry = new THREE.BoxGeometry( 2, 2, 2 )
		const material = new THREE.MeshNormalMaterial( { wireframe: true } )
		const mesh = new THREE.Mesh( geometry, material )
		mesh.position.set( 4, 1, 4 )
		world.add( mesh )
	}

	return world
}
