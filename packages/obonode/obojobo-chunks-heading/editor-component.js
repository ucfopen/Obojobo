import './viewer-component.scss'
import './editor-component.scss'

import React from 'react'
import Node from 'obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component'

class Heading extends React.Component {
	render() {
		const content = this.props.node.data.get('content')
		const HTag = `h${content.level || 1}`

		return (
			<Node {...this.props}>
				<div
					className={'text-chunk obojobo-draft--chunks--heading pad'}
					ref={this.nodeRef}>
					<HTag>
						<span className={`text align-${content.align}`}>{this.props.children}</span>
					</HTag>
				</div>
			</Node>
		)
	}
}

export default Heading
