import './simple-dialog.scss'

import React from 'react'

import ModalUtil from '../../util/modal-util'
import Dialog from './dialog'

class SimpleDialog extends React.Component {
	constructor(props) {
		super(props)

		this.focusOnFirstElement = this.focusOnFirstElement.bind(this)
	}

	focusOnFirstElement() {
		if (this.props.focusOnFirstElement) {
			this.props.focusOnFirstElement()
		}
	}

	render() {
		let buttons
		if (this.props.ok) {
			buttons = [
				{
					updated: 'OK',
					onClick: this.props.onConfirm,
					default: true
				}
			]
		} else if (this.props.noOrYes) {
			buttons = [
				{
					updated: 'No',
					onClick: this.props.onCancel
				},
				'or',
				{
					updated: 'Yes',
					onClick: this.props.onConfirm,
					default: true
				}
			]
		} else if (this.props.yesOrNo) {
			buttons = [
				{
					updated: 'Yes',
					onClick: this.props.onConfirm
				},
				'or',
				{
					updated: 'No',
					onClick: this.props.onCancel,
					default: true
				}
			]
		} else {
			buttons = [
				{
					updated: 'Cancel',
					altAction: true,
					onClick: this.props.onCancel
				},
				{
					updated: 'OK',
					onClick: this.props.onConfirm,
					default: true
				}
			]
		}

		return (
			<div className="obojobo-draft--components--modal--simple-dialog">
				<Dialog
					centered
					buttons={buttons}
					title={this.props.title}
					width={this.props.width}
					focusOnFirstElement={this.focusOnFirstElement}
					preventEsc={this.props.preventEsc}
				>
					{this.props.children}
				</Dialog>
			</div>
		)
	}
}

SimpleDialog.defaultProps = {
	ok: false,
	noOrYes: false,
	yesOrNo: false,
	cancelOk: false,
	title: null,
	width: null,
	preventEsc: false,
	onCancel() {
		return ModalUtil.hide()
	},
	onConfirm() {
		return ModalUtil.hide()
	}
}

export default SimpleDialog
