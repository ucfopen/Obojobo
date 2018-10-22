import './image.scss'

import React from 'react'

const Image = props => {
	let imgStyles
	const data = props.chunk.modelState

	if (!data.url) {
		return <div className="img-placeholder" />
	}

	const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
	const urlIsUUID = uuidRegex.test(data.url)
	let imgEndpoint
	if (urlIsUUID) {
		// Endpoint: /api/media/:mediaId/:size
		if (data.width && data.height) imgEndpoint = `/api/media/${data.width}x${data.height}/`
		else imgEndpoint = `/api/media/${data.url}/${data.size}`
	}

	const src = urlIsUUID ? imgEndpoint : data.url

	switch (data.size) {
		case 'small':
		case 'medium':
		case 'large':
			return <img src={src} unselectable="on" alt={data.alt} />
		case 'custom':
			imgStyles = {}

			if (data.width) {
				imgStyles.width = data.width + 'px'
			}

			if (data.height) {
				imgStyles.height = data.height + 'px'
			}

			return <img src={src} unselectable="on" alt={data.alt} style={imgStyles} />
	}
}

export default Image
