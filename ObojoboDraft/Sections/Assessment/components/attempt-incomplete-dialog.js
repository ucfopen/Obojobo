import Common from 'Common'

let { Dialog } = Common.components.modal
let { ModalUtil } = Common.util

const onCancel = () => {
	ModalUtil.hide()
}

const onSubmit = submitProp => {
	ModalUtil.hide()
	submitProp()
}

export default props => (
	<Dialog
		buttons={[
			{
				value: 'Submit as incomplete',
				altAction: true,
				isDangerous: true,
				onClick: onSubmit.bind(null, props.onSubmit)
			},
			'or',
			{
				value: 'Resume assessment',
				onClick: onCancel,
				default: true
			}
		]}
	>
		<b>Wait! You left some questions blank.</b>
		<br />
		Finish answering all questions and submit again.
	</Dialog>
)
