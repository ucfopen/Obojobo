import './simple-dialog.scss'

import ModalUtil from '../../../common/util/modal-util'
import Dialog from '../../../common/components/modal/dialog'

const SimpleDialog = props => {
	let buttons
	let cancelButton = null
	let confirmButton = null
	if (props.ok) {
		buttons = [
			{
				value: 'OK',
				onClick: props.onConfirm,
				default: true
			}
		]
	} else if (props.noOrYes) {
		buttons = [
			{
				value: 'No',
				onClick: props.onCancel
			},
			'or',
			{
				value: 'Yes',
				onClick: props.onConfirm,
				default: true
			}
		]
	} else if (props.yesOrNo) {
		buttons = [
			{
				value: 'Yes',
				onClick: props.onConfirm
			},
			'or',
			{
				value: 'No',
				onClick: props.onCancel,
				default: true
			}
		]
	} else {
		buttons = [
			{
				value: 'Cancel',
				altAction: true,
				onClick: props.onCancel
			},
			{
				value: 'OK',
				onClick: props.onConfirm,
				default: true
			}
		]
	}

	return (
		<div className="obojobo-draft--components--modal--simple-dialog">
			<Dialog centered buttons={buttons} title={props.title} width={props.width}>
				{props.children}
			</Dialog>
		</div>
	)
}

SimpleDialog.defaultProps = {
	ok: false,
	noOrYes: false,
	yesOrNo: false,
	cancelOk: false,
	title: null,
	width: null,
	onCancel() {
		return ModalUtil.hide()
	},
	onConfirm() {
		return ModalUtil.hide()
	}
}

export default SimpleDialog
