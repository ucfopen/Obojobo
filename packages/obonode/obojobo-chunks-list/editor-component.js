import './viewer-component.scss'
import './editor-component.scss'

import React from 'react'
import Node from 'obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component'
import withSlateWrapper from 'obojobo-document-engine/src/scripts/oboeditor/components/node/with-slate-wrapper'
import ListStyles from './list-styles'

const LIST_LEVEL_NODE = 'ObojoboDraft.Chunks.List.Level'

class List extends React.Component {
	constructor(props) {
		super(props)
	}

	toggleType() {
		const content = this.props.node.data.get('content')
		content.listStyles.type = content.listStyles.type === 'unordered' ? 'ordered' : 'unordered'

		const levels = this.props.node.filterDescendants(desc => desc.type === LIST_LEVEL_NODE)

		const { editor } = this.props

		levels.forEach(levelNode => {
			const levelContent = levelNode.data.get('content')
			levelContent.type = content.listStyles.type
			const bulletList =
				content.listStyles.type === 'unordered'
					? ListStyles.UNORDERED_LIST_BULLETS
					: ListStyles.ORDERED_LIST_BULLETS
			const previousBulletList =
				content.listStyles.type === 'unordered'
					? ListStyles.ORDERED_LIST_BULLETS
					: ListStyles.UNORDERED_LIST_BULLETS

			// bullet style will be different depending on tab indentation
			// the index of the current bullet style is preserved between toggling
			levelContent.bulletStyle =
				bulletList[previousBulletList.indexOf(levelContent.bulletStyle) % bulletList.length]

			// modify the level node
			return editor.setNodeByKey(levelNode.key, {
				data: { content: levelContent }
			})
		})
	}

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
