import './bubble.scss';

export default React.createClass({
	render() {
		return <div className="obojobo-draft--components--modal--bubble">
			<div className="container">{this.props.children}</div>
		</div>;
	}
});