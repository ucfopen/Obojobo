import './image.scss'

import React from 'react'

const Image = props => {
	const data = props.chunk.modelState

	if (!data.url) {
		return <div className="img-placeholder" />
	}

	const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
	const isUrlUUID = uuidRegex.test(data.url)
	let src

	if (isUrlUUID && (data.height || data.width)) {
		src = `/api/media/${data.url}/${data.width || '*'}x${data.height || '*'}`
	} else if (isUrlUUID) {
		src = `/api/media/${data.url}/${data.size}`
	} else {
		src = data.url
	}

	const imgStyles = {}
	if (data.size === 'custom') {
		if (data.width) {
			imgStyles.width = data.width + 'px'
		}

		if (data.height) {
			imgStyles.height = data.height + 'px'
		}
	}

	return (
		<img
			src={src}
			unselectable="on"
			alt={data.alt}
			style={imgStyles}
			onError={e => {
				e.target.onerror = null
				e.target.src = 'https://via.placeholder.com/150/FF0000/FFF?text=Invalid'
				e.target.alt = 'Invalid Image'
			}}
		/>
	)
}

export default Image
