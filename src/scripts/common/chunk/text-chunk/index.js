export default class TextChunk extends React.Component {
	static get defaultProps() {
		return { indent: 0 }
	}

	render() {
		return (
			<div className={`text-chunk${this.props.className ? ` ${this.props.className}` : ''}`}>
				{this.props.children}
			</div>
		)
	}
}
