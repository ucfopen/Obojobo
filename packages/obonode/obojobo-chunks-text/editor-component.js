import './viewer-component.scss'

import React from 'react'
import Node from 'obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component'
import withSlateWrapper from 'obojobo-document-engine/src/scripts/oboeditor/components/node/with-slate-wrapper'

const Text = props => {
	return (
		<Node {...props}>
			<div className={'text-chunk obojobo-draft--chunks--single-text pad'}>{props.children}</div>
		</Node>
	)
}

export default withSlateWrapper(Text)
