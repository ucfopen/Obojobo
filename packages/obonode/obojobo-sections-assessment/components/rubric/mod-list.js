import React from 'react'

const ModList = props => {
	return (
		<div>
			<p contentEditable={false}>{'Mods:'}</p>
			{props.children}
		</div>
	)
}

export default ModList
