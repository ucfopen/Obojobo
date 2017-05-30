export default React.createClass({
	render() {
		return <div>
			<p>{this.props.children}</p>
			<button onClick={this.props.modal.onButtonClick.bind(this, this.props.confirm)}>
				{this.props.buttonLabel || 'OK'}
			</button>
		</div>;
	}
});