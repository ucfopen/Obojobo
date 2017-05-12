import './inline-nav-button.scss';

import NavUtil from 'Viewer/util/nav-util';

let InlineNavButton = React.createClass({
	onClick() {
		if (this.props.disabled) { return; }

		switch (this.props.type) {
			case 'prev':
				return NavUtil.goPrev();

			case 'next':
				return NavUtil.goNext();
		}
	},

	render() {
		return <div
			className={`viewer--components--inline-nav-button is-${this.props.type}${this.props.disabled ? ' is-disabled' : ' is-enabled'}`}
			onClick={this.onClick}
		>
			{this.props.title}
		</div>;
	}
});


export default InlineNavButton;