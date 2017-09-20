import Common from 'Common'

let { Dialog } = Common.components.modal
let { ModalUtil } = Common.util

export default class AttemptIncompleteDialog extends React.Component {
	onCancel() {
		return ModalUtil.hide()
	}

	onSubmit() {
		ModalUtil.hide()
		return this.props.onSubmit()
	}

	render() {
		return (
			<Dialog
				width="32rem"
				buttons={[
					{
						value: 'Submit as incomplete',
						altAction: true,
						dangerous: true,
						onClick: this.onSubmit.bind(this)
					},
					'or',
					{
						value: 'Resume assessment',
						onClick: this.onCancel.bind(this),
						default: true
					}
				]}
			>
				<b>Wait! You left some questions blank.</b>
				<br />
				Finish answering all questions and submit again.
			</Dialog>
		)
	}
}
