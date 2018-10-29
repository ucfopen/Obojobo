import './modal.scss'

import React from 'react'

import DeleteButton from '../../../common/components/delete-button'
import ModalUtil from '../../../common/util/modal-util'

class Modal extends React.Component {
	constructor() {
		super()
		this.boundKeyUp = this.onKeyUp.bind(this)
	}

	componentDidMount() {
		document.addEventListener('keyup', this.boundKeyUp)
	}

	componentWillUnmount() {
		document.removeEventListener('keyup', this.boundKeyUp)
	}

	onKeyUp(event) {
		if (event.keyCode === 27) {
			//ESC
			if (this.props.onClose) {
				this.props.onClose()
			} else {
				ModalUtil.hide()
			}
		}
	}

	onTabTrapFocus() {
		if (this.props.onClose) {
			return this.refs.closeButton.focus()
		} else if (this.props.focusOnFirstElement) {
			return this.props.focusOnFirstElement()
		}
	}

	render() {
		return (
			<div
				className={
					'obojobo-draft--components--modal--modal' +
					(this.props.className ? ' ' + this.props.className : '')
				}
				role="dialog"
				aria-labelledby="obojobo-draft--components--modal--modal--content"
			>
				<input
					className="first-tab"
					ref="firstTab"
					type="text"
					onFocus={this.onTabTrapFocus.bind(this)}
				/>
				{this.props.onClose ? (
					<DeleteButton ref="closeButton" onClick={this.props.onClose} />
				) : null}
				<div className="content" id="obojobo-draft--components--modal--modal--content">
					{this.props.children}
				</div>
				<input
					className="last-tab"
					ref="lastTab"
					type="text"
					onFocus={this.onTabTrapFocus.bind(this)}
				/>
			</div>
		)
	}
}

export default Modal
