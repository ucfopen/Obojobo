import React, { memo } from 'react'

const ActionButtonEditorAction = props => {
	let description

	switch(props.type){
		case 'nav:goto':
			description = `Go to "${props.value.id}"`
			break
		case 'nav:prev':
			description = 'Go to the previous page'
			break
		case 'nav:next':
			description = 'Go to the next page'
			break
		case 'nav:openExternalLink':
			description = `Open ${props.value.url}`
			break
		case 'nav:lock':
			description = 'Lock navigation'
			break
		case 'nav:unlock':
			description = 'Unlock navigation'
			break
		case 'nav:open':
			description = 'Open the navigation menu'
			break
		case 'nav:close':
			description = 'Close the navigation menu'
			break
		case 'nav:toggle':
			description = 'Toggle the navigation drawer'
			break
		case 'assessment:startAttempt':
			description = `Start an attempt for "${props.value.id}"`
			break
		case 'assessment:endAttempt':
			description = `End an attempt for "${props.value.id}"`
			break
		case 'viewer:alert':
			description = 'Display a popup message'
			break
		case 'viewer:scrollToTop':
			description = 'Scroll to the top of the page'
			break
		case 'focus:component':
			description = `Focus on "${props.value.id}"`
			break
	}

	return (
		<div className="trigger">
			<span>{description}</span>
		</div>
	)
}

export default memo(ActionButtonEditorAction)
