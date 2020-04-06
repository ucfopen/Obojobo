import './viewer-component.scss'

import React from 'react'
import Node from 'obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component'
import withSlateWrapper from 'obojobo-document-engine/src/scripts/oboeditor/components/node/with-slate-wrapper'

const Code = props => {
	return (
		<Node {...props}>
			<div className={`text-chunk obojobo-draft--chunks--code pad`}>
				<pre>
					<code>{props.children}</code>
				</pre>
			</div>
		</Node>
	)
}

export default withSlateWrapper(Code)
