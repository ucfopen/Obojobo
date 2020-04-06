import './viewer-component.scss'
import './editor-component.scss'

import React from 'react'
import Node from 'obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component'
import withSlateWrapper from 'obojobo-document-engine/src/scripts/oboeditor/components/node/with-slate-wrapper'

class List extends React.Component {
	render() {
		return (
			<Node {...this.props}>
				<div className={'text-chunk obojobo-draft--chunks--list pad'}>
					{this.props.children}
				</div>
			</Node>
		)
	}
}

export default withSlateWrapper(List)
