import './error-dialog.scss';

import SimpleDialog from './simple-dialog';

export default React.createClass({
	render() {
		return <div className="obojobo-draft--components--modal--error-dialog">
			<SimpleDialog ok title={this.props.title}>
				{this.props.children}
			</SimpleDialog>
		</div>;
	}
});