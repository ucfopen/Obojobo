import './delete-button.scss';

export default React.createClass({
	getDefaultProps() {
		return {indent: 0};
	},

	focus() {
		return ReactDOM.findDOMNode(this.refs.button).focus();
	},

	render() {
		return <div className="obojobo-draft--components--delete-button">
			<button
				ref="button"
				onClick={this.props.onClick}
				tabIndex={this.props.shouldPreventTab ? '-1' : this.props.tabIndex}
				disabled={this.props.shouldPreventTab}
			>
				Delete
			</button>
		</div>;
	}
});