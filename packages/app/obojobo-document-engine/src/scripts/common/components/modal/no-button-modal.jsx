import React from 'react'

const NoButtonModal = props => (
	<div
		className="obojobo-draft--components--modal--modal"
		role="dialog"
		aria-labelledby="obojobo-draft--components--modal--modal--content"
	>
		<div className="content" id="obojobo-draft--components--modal--modal--content">
			{props.children}
		</div>
	</div>
)

export default NoButtonModal
