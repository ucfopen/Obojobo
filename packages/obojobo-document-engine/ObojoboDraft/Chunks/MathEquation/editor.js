import React from 'react'
import Common from 'Common'

import emptyNode from './empty-node.json'
import Icon from './icon'
import Node from './editor-component'
import Schema from './schema'
import Converter from './converter'

const MATH_NODE = 'ObojoboDraft.Chunks.MathEquation'

const plugins = {
	renderNode(props) {
		switch (props.node.type) {
			case MATH_NODE:
				return <Node {...props} {...props.attributes} />
		}
	},
	schema: Schema
}

Common.Registry.registerModel('ObojoboDraft.Chunks.MathEquation', {
	name: 'Math Equation',
	icon: Icon,
	isInsertable: true,
	insertJSON: emptyNode,
	slateToObo: Converter.slateToObo,
	oboToSlate: Converter.oboToSlate,
	plugins
})

const MathEquation = {
	name: MATH_NODE,
	components: {
		Node,
		Icon
	},
	helpers: {
		slateToObo: Converter.slateToObo,
		oboToSlate: Converter.oboToSlate
	},
	json: {
		emptyNode
	},
	plugins
}

export default MathEquation
