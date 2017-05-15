import ObojoboDraft from 'ObojoboDraft';

let { Dialog } = ObojoboDraft.components.modal;
let { ModalUtil } = ObojoboDraft.util;

export default React.createClass({
	onCancel() {
		return ModalUtil.hide();
	},

	onSubmit() {
		ModalUtil.hide();
		return this.props.onSubmit();
	},

	render() {
		return <Dialog width="32rem" buttons={[
			{
				value: 'Submit as incomplete',
				altAction: true,
				dangerous: true,
				onClick: this.onSubmit
			},
			'or',
			{
				value: 'Resume assessment',
				onClick: this.onCancel,
				default: true
			}
		]}>
			<b>Wait! You left some questions blank.</b>
			<br />
			Finish answering all questions and submit again.
		</Dialog>;
	}
});