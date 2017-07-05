export default class SimpleMessage extends React.Component {
	render() {
		return (
			<div>
				<p>
					{this.props.children}
				</p>
				<button onClick={this.props.modal.onButtonClick.bind(null, this.props.confirm)}>
					{this.props.buttonLabel || 'OK'}
				</button>
			</div>
		)
	}
}
