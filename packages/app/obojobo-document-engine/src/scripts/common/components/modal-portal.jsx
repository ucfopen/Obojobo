import React from 'react'
import ReactDOM from 'react-dom'
import waitForElement from '../util/wait-for-element'
import ModalContainer from './modal-container'

class ModalPortal extends React.Component {
	constructor(props) {
		super(props)
		this.state = { isDOMElementReady: false }
	}

	async componentDidMount() {
		await waitForElement(`#${ModalContainer.PORTAL_CONTAINER_DOM_ID}`)
		this.setState({ isDOMElementReady: true })
	}

	render() {
		if (!this.state.isDOMElementReady) {
			return null
		}

		return ReactDOM.createPortal(
			this.props.children,
			document.getElementById(ModalContainer.PORTAL_CONTAINER_DOM_ID)
		)
	}
}

export default ModalPortal
