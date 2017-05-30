import './modal-container.scss';


export default React.createClass({
	render() {
		return <div className="obojobo-draft--components--modal-container">
			<div className="content">
				{this.props.children}
			</div>
		</div>;
	}
});