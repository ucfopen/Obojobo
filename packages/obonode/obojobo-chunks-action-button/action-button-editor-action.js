import React, { memo } from 'react'

const ActionButtonEditorAction = props => {
	let description

	switch (props.type) {
		case 'nav:goto':
			if (props.updated.id) {
				description = `Go to ${props.updated.id}`
			} else {
				description = 'Go to ""'
			}
			// eslint-disable-next-line no-undefined
			if (props.updated.id && props.updated.ignoreLock === undefined ? true : props.updated.ignoreLock) {
				description = `${description} (Ignore Navigation Lock)`
			}

			break
		case 'nav:prev':
			description = 'Go to the previous page'
			break
		case 'nav:next':
			description = 'Go to the next page'
			break
		case 'nav:openExternalLink':
			if (props.updated.url) {
				description = `Open ${props.updated.url}`
			} else {
				description = 'Open ""'
			}

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
			description = `Start an attempt for "${props.updated.id}"`
			break
		case 'assessment:endAttempt':
			description = `End an attempt for "${props.updated.id}"`
			break
		case 'viewer:alert':
			description = 'Display a popup message'
			break
		case 'viewer:scrollToTop':
			description = 'Scroll to the top of the page'
			break
		case 'focus:component':
			description = `Focus on "${props.updated.id}"`
			break
	}

	return (
		<div className="trigger">
			<span>{description}</span>
		</div>
	)
}

export default memo(ActionButtonEditorAction)
