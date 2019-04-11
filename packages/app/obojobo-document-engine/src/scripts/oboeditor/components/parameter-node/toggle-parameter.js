import React from 'react'
import Common from 'Common'

import './parameter-node.scss'

const { Slider } = Common.components

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

	console.log(props.node.toJSON())

	return (
		<div className={'parameter-node'} {...props.attributes} contentEditable={false}>
			<Slider
				title={props.node.data.get('display')}
				initialChecked={props.node.data.get('checked')}
				handleCheckChange={event => handleCheckChange(event)}
			/>
		</div>
	)
}

const slateToObo = node => {
	const json = {}
	json[node.data.get('name')] = node.data.get('checked')

	return json
}

const oboToSlate = (name, value, display) => ({
	object: 'block',
	type: TOGGLE_PARAMETER,
	data: {
		name: name,
		display: display,
		checked: value
	}
})

const plugins = {
	renderNode(props, editor, next) {
		switch (props.node.type) {
			case TOGGLE_PARAMETER:
				return <Node {...props} />
			default:
				return next()
		}
	},
	schema : {
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
