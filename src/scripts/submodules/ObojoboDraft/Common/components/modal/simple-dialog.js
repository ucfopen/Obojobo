import './simple-dialog.scss';

import ModalUtil from 'ObojoboDraft/Common/util/modal-util';
import Dialog from 'ObojoboDraft/Common/components/modal/dialog';

export default React.createClass({
	getDefaultProps() {
		return {
			ok: false,
			noOrYes: false,
			yesOrNo: false,
			cancelOk: false,
			title: null,
			width: null,
			onCancel() { return ModalUtil.hide(); },
			onConfirm() { return ModalUtil.hide(); }
		};
	},

	render() {
		let buttons;
		let cancelButton = null;
		let confirmButton = null;
		if (this.props.ok) {
			buttons = [
				{
					value: 'OK',
					onClick: this.props.onConfirm,
					default: true
				}
			];

		} else if (this.props.noOrYes) {
			buttons = [
				{
					value: 'No',
					onClick: this.props.onCancel
				},
				'or',
				{
					value: 'Yes',
					onClick: this.props.onConfirm,
					default: true
				}
			];

		} else if (this.props.yesOrNo) {
			buttons = [
				{
					value: 'Yes',
					onClick: this.props.onConfirm
				},
				'or',
				{
					value: 'No',
					onClick: this.props.onCancel,
					default: true
				}
			];

		} else if (this.props.cancelOk) {
			buttons = [
				{
					value: 'Cancel',
					altAction: true,
					onClick: this.props.onCancel
				},
				{
					value: 'OK',
					onClick: this.props.onConfirm,
					default: true
				}
			];
		}

		return <div className="obojobo-draft--components--modal--simple-dialog">
			<Dialog centered buttons={buttons} title={this.props.title} width={this.props.width}>
				{this.props.children}
			</Dialog>
		</div>;
	}
});