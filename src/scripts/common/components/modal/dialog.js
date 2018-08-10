import './dialog.scss'

import React from 'react'

import Button from '../../../common/components/button'
import Modal from './modal'

export default class Dialog extends React.Component {
	static get defaultProps() {
		return { centered: true }
	}

	componentDidMount() {
		for (let index = 0; index < this.props.buttons.length; index++) {
			const button = this.props.buttons[index]
			if (button.default) {
				button.focus()
			}
		}
	}

	focusOnFirstElement() {
		if (this.buttons && this.buttons[0]) this.buttons[0].focus()
	}

	render() {
		let styles = null
		if (this.props.width) {
			styles = { width: this.props.width }
		}

		this.buttons = []

		return (
			<div className="obojobo-draft--components--modal--dialog" style={styles}>
				<Modal
					onClose={this.props.onClose}
					focusOnFirstElement={this.focusOnFirstElement.bind(this)}
					className={this.props.modalClassName}
				>
					{this.props.title ? (
						<h1
							className="heading"
							style={{
								textAlign: this.props.centered ? 'center' : null
							}}
						>
							{this.props.title}
						</h1>
					) : null}
					<div
						className="dialog-content"
						style={{
							textAlign: this.props.centered ? 'center' : null
						}}
					>
						{this.props.children}
					</div>
					<div className="controls">
						{this.props.buttons.map((buttonPropsOrText, index) => {
							if (typeof buttonPropsOrText === 'string') {
								return (
									<span key={index} className="text">
										{buttonPropsOrText}
									</span>
								)
							}
							buttonPropsOrText.key = index
							return (
								<Button
									key={index}
									ref={component => (this.buttons[index] = component)}
									{...buttonPropsOrText}
								/>
							)
						})}
					</div>
				</Modal>
			</div>
		)
	}
}
