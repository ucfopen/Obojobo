import Common from 'Common'
import './image.scss'

export default props => {
	let imgStyles
	let data = props.chunk.modelState

	if (data.url == null) {
		return <div className="img-placeholder" />
	}

	switch (data.size) {
		case 'small':
		case 'medium':
		case 'large':
			return <img src={data.url} unselectable="on" alt={data.alt} />
		case 'custom':
			imgStyles = {}

			if (data.width != null) {
				imgStyles.width = data.width + 'px'
			}

			if (data.height != null) {
				imgStyles.height = data.height + 'px'
			}

			return <img src={data.url} unselectable="on" alt={data.alt} style={imgStyles} />
	}
}
