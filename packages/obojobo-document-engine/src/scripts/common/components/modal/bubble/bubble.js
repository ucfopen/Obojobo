import './bubble.scss'

import React from 'react'

const Bubble = props => (
	<div className="obojobo-draft--components--modal--bubble">
		<div className="container">{props.children}</div>
	</div>
)

export default Bubble
