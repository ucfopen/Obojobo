import React from 'react'

const Settings = props => {
	return (
		<div className={'settings pad'}>
			<span contentEditable={false} className={'label'}>
				{'Assessment Settings'}
			</span>
			<div>{props.children}</div>
		</div>
	)
}

export default Settings
