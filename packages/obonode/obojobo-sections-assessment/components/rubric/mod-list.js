import React from 'react'

const ModList = props => (
	<div>
		<p contentEditable={false}>Mods:</p>
		{props.children}
	</div>
)

export default ModList
