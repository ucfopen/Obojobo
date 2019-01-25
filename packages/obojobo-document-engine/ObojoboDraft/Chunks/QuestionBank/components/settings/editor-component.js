import './editor-component.scss'

import React from 'react'

const Settings = props => {
	return (
		<div className={'qb-settings'}>
			<div>{props.children}</div>
		</div>
	)
}

export default Settings
