import React from 'react'
import { Block } from 'slate'

import emptyNode from './empty-node.json'
import Icon from './icon'
import Node from './editor-component'
import Schema from './schema'
import Common from 'Common'

const BUTTON_NODE = 'ObojoboDraft.Chunks.ActionButton'

const requiresValue = {
	'nav:goto': value => {
		const json = JSON.parse(value)
		return json.id
	},
	'nav:openExternalLink': value => {
		const json = JSON.parse(value)
		return json.url
	},
	'assessment:startAttempt': value => {
		const json = JSON.parse(value)
		return json.id
	},
	'assessment:endAttempt': value => {
		const json = JSON.parse(value)
		return json.id
	},
	js: value => {
		return typeof value === typeof ''
	},
	'viewer:alert': value => {
		const json = JSON.parse(value)
		return !!json.title && !!json.message
	}
}

const Trigger = props => {
	return (
		<div className={'trigger'} key={props.type}>
			<div>
				<p>{props.type}</p>
			</div>
			<div>
				<p>{props.value}</p>
			</div>
			<button className={'delete-node'} onClick={props.update}>
				x
			</button>
		</div>
	)
}

const insertNode = change => {
	change
		.insertBlock(Block.fromJSON(emptyNode))
		.focus()
}

const slateToObo = node => {
	const json = {}
	json.id = node.key
	json.type = node.type
	json.content = {}
	const nodeContent = node.data.get('content')
	json.content.label = nodeContent.label || ''
	json.content.triggers = [
		{
			type: 'onClick',
			actions: nodeContent.actions.map(action => {
				return {
					type: action.type,
					value: action.value !== '' ? JSON.parse(action.value) : {}
				}
			})
		}
	]

	json.children = []
	return json
}

const oboToSlate = node => {
	const json = {}
	json.object = 'block'
	json.key = node.id
	json.type = node.type

	json.data = { content: {} }
	json.data.content.label = node.content.label
	if (!json.data.content.label && node.content.textGroup) {
		node.content.textGroup.forEach(line => {
			json.data.content.label = line.text.value
		})
	}

	json.data.content.actions = []
	if (node.content.triggers) {
		json.data.content.actions = node.content.triggers[0].actions.map(action => {
			return {
				type: action.type,
				value: action.value ? JSON.stringify(action.value) : ''
			}
		})
	}

	return json
}

const plugins = {
	renderNode(props) {
		switch (props.node.type) {
			case BUTTON_NODE:
				return <Node {...props} {...props.attributes} />
		}
	},
	schema: Schema
}

const ActionButton = {
	name: BUTTON_NODE,
	components: {
		Node,
		Trigger,
		Icon
	},
	helpers: {
		insertNode,
		slateToObo,
		oboToSlate,
		requiresValue
	},
	json: {
		emptyNode
	},
	plugins
}

Common.Store.registerEditorModel('ObojoboDraft.Chunks.ActionButton', {
	name: 'Button',
	icon: Icon,
	isInsertable: true,
	insertJSON: emptyNode,
	slateToObo,
	oboToSlate,
	plugins
})

export default ActionButton
