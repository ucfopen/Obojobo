import React from 'react'

import ModalUtil from '../../../common/util/modal-util'
import SimpleDialog from './simple-dialog'

import './prompt.scss'

class ImageProperties extends React.Component {
	constructor(props) {
		super(props)

		this.state = this.props.content
	}

	onKeyUp(event) {
		if (event.keyCode === 27) {
			return ModalUtil.hide()
		}

		if (event.key === "Enter") {
			return this.props.onConfirm(this.state.text)
		}
	}

	handleAltTextChange(event) {
		const alt = event.target.value

		return this.setState({alt})
	}

	focusOnFirstElement() {
		return this.refs.input.focus()
	}

	render() {
		return (
			<SimpleDialog
				cancelOk
				title="Figure Properties"
				onConfirm={() => this.props.onConfirm(this.state)}
				focusOnFirstElement={this.focusOnFirstElement.bind(this)}>
				<label htmlFor="altInput">Alt Text:</label>
				<input
					type="text"
					id="altInput"
					value={this.state.alt}
					onKeyUp={this.onKeyUp.bind(this)}
					onChange={event => this.handleTextChange(event)}
					ref={'input'}
					size="50"/>
			</SimpleDialog>
		)
	}
}

export default ImageProperties
