import React from 'react'

const HTML = props => {
	return (
		<div className={'obojobo-draft--chunks--html html-editor viewer pad'}>
			<pre>{props.children}</pre>
		</div>
	)
}

export default HTML
