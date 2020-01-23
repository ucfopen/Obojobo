import './viewer-component.scss'

import React from 'react'
import Node from 'obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component'

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

export default Code
