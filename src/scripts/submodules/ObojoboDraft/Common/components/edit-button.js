import './edit-button.scss';

import getBackgroundImage from 'ObojoboDraft/Common/util/get-background-image';
import editButton from 'svg-url-loader?noquotes!./edit-button/assets/edit.svg';

export default React.createClass({
	getDefaultProps() {
		return {indent: 0};
	},

	render() {
		let editButtonStyles =
			{backgroundImage: Common.util.getBackgroundImage(editButton)};

		return <div className="obojobo-draft--components--edit-button">
			<button
				onClick={this.props.onClick}
				style={editButtonStyles}
				tabIndex={this.props.shouldPreventTab ? '-1' : 1}
				disabled={this.props.shouldPreventTab}
			>Edit</button>
		</div>;
	}
});