export default class Question extends React.Component {
	render() {
		return (
			<div>
				<p>
					{this.props.children}
				</p>
				<button
					onClick={this.props.modal.onButtonClick.bind(
						this,
						this.props.cancelOnReject ? this.props.cancel : this.props.reject
					)}
				>
					{this.props.rejectButtonLabel || 'No'}
				</button>
				<button onClick={this.props.modal.onButtonClick.bind(this, this.props.confirm)}>
					{this.props.confirmButtonLabel || 'Yes'}
				</button>
			</div>
		)
	}
}
