import './editor-component.scss'

import React from 'react'
import { Block } from 'slate'
import Common from 'obojobo-document-engine/src/scripts/common'
import emptyMod from './empty-mod.json'

const { Button } = Common.components
const MOD_LIST_NODE = 'ObojoboDraft.Sections.Assessment.Rubric.ModList'

class Rubric extends React.Component {
	constructor(props) {
		super(props)
		this.state = this.props.node.data.get('content')
		this.deleteNode = this.deleteNode.bind(this)
		this.addMod = this.addMod.bind(this)
	}

	addMod() {
		// If we are adding the first mod, we need to add a ModList
		if (this.props.node.nodes.size < 5) {
			const modlist = Block.create({
				type: MOD_LIST_NODE,
				nodes: [emptyMod]
			})
			return this.props.editor.insertNodeByKey(this.props.node.key, this.props.node.nodes.size, modlist)
		}

		const modlist = this.props.node.nodes.get(4)

		const mod = Block.create(emptyMod)
		return this.props.editor.insertNodeByKey(modlist.key, modlist.nodes.size, mod)
	}

	deleteNode() {
		return this.props.editor.removeNodeByKey(this.props.node.key)
	}

	render() {
		return (
			<div className='rubric pad'>
				<h1 contentEditable={false}>Rubric</h1>
				<div className='parameter-node' contentEditable={false}>
					{`Type: ${this.state.type}`}
				</div>
				{this.props.children}
				<Button className='add-button' onClick={this.addMod}>
					Add Mod
				</Button>
				<Button className='delete-button' onClick={this.deleteNode}>
					×
				</Button>
			</div>
		)
	}
}

export default Rubric
