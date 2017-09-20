import Common from 'Common'

export default class Image extends React.Component {
	render() {
		let imgStyles
		let data = this.props.chunk.modelState

		if (data.url == null) {
			imgStyles = {
				backgroundImage: Common.util.getBackgroundImage(
					require('svg-url-loader?noquotes!./assets/bg.svg')
				),
				backgroundSize: '16px',
				height: '300px'
			}

			return <div className="img-placeholder" style={imgStyles} />
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
}
