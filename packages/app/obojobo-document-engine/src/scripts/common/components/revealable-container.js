import './revealable-container.scss'

import React from 'react'

const RevealableContainer = ({ className, children, ...props }) => (
	<div className="obojobo-draft--components--revealable-container-wrapper">
		<div
			className={`obojobo-draft--components--revealable-container${
				className ? ' ' + className : ''
			}`}
			{...props}
		>
			{children}
		</div>
	</div>
)

export default RevealableContainer
