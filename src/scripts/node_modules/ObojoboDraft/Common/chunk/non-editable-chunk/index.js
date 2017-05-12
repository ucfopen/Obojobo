export default React.createClass({
	getDefaultProps() {
		return {indent: 0};
	},

	render() {
		return <div className={`non-editable-chunk${this.props.className ? ` ${this.props.className}` : ''}`} contentEditable="false" data-indent={this.props.indent}>
			{ this.props.children }
		</div>;
	}
});