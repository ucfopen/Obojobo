export default React.createClass({
	getDefaultProps() {
		return {indent: 0};
	},

	render() {
		return <div className={`text-chunk${this.props.className ? ` ${this.props.className}` : ''}`}>
			{this.props.children}
		</div>;
	}
});