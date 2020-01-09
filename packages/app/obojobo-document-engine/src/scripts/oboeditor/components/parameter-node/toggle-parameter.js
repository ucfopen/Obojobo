import React from 'react'
import Common from 'obojobo-document-engine/src/scripts/common'

import './parameter-node.scss'

const { Switch } = Common.components

const TOGGLE_PARAMETER = 'oboeditor.toggle-parameter'

const Node = props => {
	const handleCheckChange = checked => {
		const editor = props.editor

		return editor.setNodeByKey(props.node.key, {
			data: {
				checked,
				name: props.node.data.get('name'),
				display: props.node.data.get('display'),
				type: props.node.data.get('type')
			}
		})
	}

	return (
		<div className={'parameter-node'} contentEditable={false}>
			<Switch
				title={props.node.data.get('display')}
				initialChecked={props.node.data.get('checked')}
				handleCheckChange={event => handleCheckChange(event)}
			/>
		</div>
	)
}

const slateToObo = node => ({ [node.data.get('name')]: node.data.get('checked') })

const oboToSlate = (name, checked, display) => ({
	object: 'block',
	type: TOGGLE_PARAMETER,
	data: {
		name,
		display,
		checked
	}
})

const plugins = {
	renderNode(props, editor, next) {
		switch (props.node.type) {
			case TOGGLE_PARAMETER:
				return <Node {...props} {...props.attributes} />
			default:
				return next()
		}
	},
	schema: {
		blocks: {
			'oboeditor.toggle-parameter': {
				isVoid: true
			}
		}
	}
}

const ToggleParameter = {
	components: {
		Node
	},
	helpers: {
		slateToObo,
		oboToSlate
	},
	plugins
}

export default ToggleParameter
