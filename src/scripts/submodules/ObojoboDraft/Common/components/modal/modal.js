import './modal.scss';

import DeleteButton from 'ObojoboDraft/Common/components/delete-button';

export default React.createClass({
	componentDidMount() {
		if (this.props.onClose) {
			return document.addEventListener('keyup', this.onKeyUp);
		}
	},

	componentWillUnmount() {
		if (this.props.onClose) {
			return document.removeEventListener('keyup', this.onKeyUp);
		}
	},

	onKeyUp(event) {
		if (event.keyCode === 27) { //ESC
			return this.props.onClose();
		}
	},

	onTabTrapFocus() {
		if (this.props.onClose) {
			return this.refs.closeButton.focus();
		} else if (this.props.focusOnFirstElement) {
			return this.props.focusOnFirstElement();
		}
	},

	render() {
		return <div className="obojobo-draft--components--modal--modal">
			<input className="first-tab" ref="firstTab" type="text" onFocus={this.onTabTrapFocus} />
			{
				this.props.onClose
				?
				<DeleteButton ref="closeButton" onClick={this.props.onClose} />
				:
				null
			}
			<div className="content">
				{this.props.children}
			</div>
			<input className="last-tab" ref="lastTab" type="text" onFocus={this.onTabTrapFocus} />
		</div>;
	}
});