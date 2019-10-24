import './viewer-component.scss'

import React from 'react'
import Node from 'obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component'

const LIST_LEVEL_NODE = 'ObojoboDraft.Chunks.List.Level'

const unorderedBullets = ['disc', 'circle', 'square']
const orderedBullets = ['decimal', 'upper-alpha', 'upper-roman', 'lower-alpha', 'lower-roman']

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
			const bulletList = content.listStyles.type === 'unordered' ? unorderedBullets : orderedBullets
			const previousBulletList =
				content.listStyles.type === 'unordered' ? orderedBullets : unorderedBullets

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
		const type = this.props.node.data.get('content').listStyles.type
		const other = type === 'ordered' ? 'Unordered' : 'Ordered'
		return (
			<Node {...this.props}>
				<div className={'text-chunk obojobo-draft--chunks--list pad'}>
					{this.props.children}
					<button onClick={() => this.toggleType()}>{'Swap to ' + other}</button>
				</div>
			</Node>
		)
	}
}

export default List
