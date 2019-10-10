import './viewer-component.scss'

import React from 'react'
import Node from 'obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component'

const Text = props => {
	return (
		<Node {...props}>
			<div className={'text-chunk obojobo-draft--chunks--single-text pad'}>
				{props.children}
			</div>
		</Node>
	)
}

export default Text
