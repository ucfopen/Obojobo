import './viewer-component.scss'
import './editor-component.scss'

import React from 'react'

const HTML = props => {
	return (
		<div className={'obojobo-draft--chunks--html viewer pad'}>
			<pre>{props.children}</pre>
		</div>
	)
}

export default HTML
