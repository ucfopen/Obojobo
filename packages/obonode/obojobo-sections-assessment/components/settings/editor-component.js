import React from 'react'

const Settings = props => (
	<div className={'settings pad'}>
		<span contentEditable={false} className={'label'}>
			{'Assessment Settings'}
		</span>
		<div>{props.children}</div>
	</div>
)

export default Settings
