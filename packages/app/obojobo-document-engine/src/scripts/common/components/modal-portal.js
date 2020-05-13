import React from 'react'
import ReactDOM from 'react-dom'

import Common from 'obojobo-document-engine/src/scripts/common'

class ModalPortal extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		const modalContainerEl = document.getElementById(
			Common.components.ModalContainer.PORTAL_CONTAINER_DOM_ID
		)

		console.log('SUP HOMIE')

		return modalContainerEl ? ReactDOM.createPortal(this.props.children, modalContainerEl) : null
	}
}

export default ModalPortal
