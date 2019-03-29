import './modal-container.scss'

import React from 'react'

const ModalContainer = props => (
	<div className="obojobo-draft--components--modal-container">
		<div className="content">{props.children}</div>
	</div>
)

export default ModalContainer
