import './image.scss'

import React from 'react'
import Common from 'obojobo-document-engine/src/scripts/common'

const isOrNot = Common.util.isOrNot

class Image extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			isError: false,
			isLoaded: false
		}

		this.boundOnError = this.onError.bind(this)
		this.boundOnLoad = this.onLoad.bind(this)
	}

	onError() {
		this.setState({
			isError: true
		})
	}

	onLoad() {
		this.setState({
			isLoaded: true
		})
	}

	render() {
		const data = this.props.chunk.modelState

		if (!data.url) {
			return <div className="img-placeholder" />
		}

		const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
		const isUrlUUID = uuidRegex.test(data.url)
		let src

		if (!isUrlUUID) {
			// If this is an external URL we simply use that url:
			src = data.url
		} else if (data.height || data.width) {
			// Else, we have a UUID internal URL.
			// If width and/or height are defined we use those values:
			src = `/api/media/${data.url}/${data.width || '*'}x${data.height || '*'}`
		} else if (data.size === 'custom') {
			// Otherwise, no width or height is defined. If size is custom in this case,
			// then we want the native size of the image:
			src = `/api/media/${data.url}/original`
		} else {
			// Finally, size must be one of the defaults (small, medium, large)
			src = `/api/media/${data.url}/${data.size}`
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

		return this.state.isError ? (
			<div
				className={
					'obojobo-draft--chunks--figure--image is-not-valid' +
					isOrNot(this.state.isLoaded, 'loaded')
				}
				style={imgStyles}
			/>
		) : (
			<img
				className={
					'obojobo-draft--chunks--figure--image is-valid' + isOrNot(this.state.isLoaded, 'loaded')
				}
				src={src}
				unselectable="on"
				alt={data.alt}
				style={imgStyles}
				onLoad={this.boundOnLoad}
				onError={this.boundOnError}
				loading="lazy"
			/>
		)
	}
}

export default Image
