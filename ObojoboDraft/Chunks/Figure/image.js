import './image.scss'

import React from 'react'

const Image = props => {
	let imgStyles
	const data = props.chunk.modelState

	if (!data.url) {
		return <div className="img-placeholder" />
	}

	switch (data.size) {
		case 'small':
		case 'medium':
		case 'large':
			return <img src={data.url} unselectable="on" alt={data.alt} />
		case 'custom':
			imgStyles = {}

			if (data.width) {
				imgStyles.width = data.width + 'px'
			}

			if (data.height) {
				imgStyles.height = data.height + 'px'
			}

			return <img src={data.url} unselectable="on" alt={data.alt} style={imgStyles} />
	}
}

export default Image
