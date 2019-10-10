import './list-dialog.scss'

import React from 'react'

import ModalUtil from '../../../common/util/modal-util'
import Dialog from '../../../common/components/modal/dialog'

class ListDialog extends React.Component {
	focusOnFirstElement() {
		if (this.props.focusOnFirstElement) {
			return this.props.focusOnFirstElement()
		}
	}

	render() {
		const buttons = [
			{
				value: '×',
				onClick: this.props.onClose,
				className: 'delete-button'
			}
		]

		return (
			<div className="obojobo-draft--components--modal--list-dialog">
				<Dialog
					centered
					buttons={buttons}
					title={this.props.title}
					width={this.props.width}
					onClose={this.props.onClose}
					focusOnFirstElement={this.focusOnFirstElement.bind(this)}>
					{this.props.children}
				</Dialog>
			</div>
		)
	}
}

ListDialog.defaultProps = {
	title: null,
	width: null,
	onClose() {
		return ModalUtil.hide()
	}
}

export default ListDialog
