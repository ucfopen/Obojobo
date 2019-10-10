const actionList = [
	{
		type: 'nav:goto',
		description: 'Go to',
		values: [
			{
				key: 'id',
				description: 'Node',
				type: 'input'
			}
		]
	},
	{
		type: 'nav:prev',
		description: 'Go to the previous page'
	},
	{
		type: 'nav:next',
		description: 'Go to the next page'
	},
	{
		type: 'nav:openExternalLink',
		description: 'Open a webpage',
		values: [
			{
				key: 'url',
				description: 'URL',
				type: 'input'
			}
		]
	},
	{
		type: 'nav:lock',
		description: 'Lock navigation'
	},
	{
		type: 'nav:unlock',
		description: 'Unlock navigation'
	},
	{
		type: 'nav:open',
		description: 'Open the navigation menu'
	},
	{
		type: 'nav:close',
		description: 'Close the navigation menu'
	},
	{
		type: 'nav:toggle',
		description: 'Toggle the navigation drawer'
	},
	{
		type: 'assessment:startAttempt',
		description: 'Start an attempt for'
	},
	{
		type: 'assessment:endAttempt',
		description: 'End an attempt for'
	},
	{
		type: 'viewer:alert',
		description: 'Display a popup message'
	},
	{
		type: 'viewer:scrollToTop',
		description: 'Scroll to the top of the page'
	},
	{
		type: 'focus:component',
		description: 'Focus on a specific node'
	}

]

export default actionList