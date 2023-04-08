function fromLonLat( λ, ϕ, R = 6_378_137.82 ) {

	if ( λ < - 180 || λ > 180 ) {

		const amplitude = 180

		λ = ( ( ( 2 * amplitude * λ / 360 - 180 ) % 360 ) + 360 ) % 360 - amplitude
	}

	if ( ϕ < - 90 || ϕ > 90 ) {

		const amplitude = 90

		ϕ = 4 * amplitude / 360 * Math.abs( ( ( ( ϕ - amplitude ) % 360 ) + 360 ) % 360 - 180 ) - amplitude
	}

	return [
		R * λ * Math.PI / 180,
		R * Math.log( Math.tan( Math.PI * 0.25 + 0.5 * ϕ * Math.PI / 180 ) ),
	]
}

export {
	fromLonLat,
}
