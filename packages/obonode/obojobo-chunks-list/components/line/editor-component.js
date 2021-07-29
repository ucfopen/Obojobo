import '../../viewer-component.scss'

import React from 'react'

const Line = ({ element, children }) => {
	const attr = {}
	if (element.content && element.content.hangingIndent) {
		attr['data-hanging-indent'] = element.content.hangingIndent
	}

	if (
		children &&
		children.props &&
		children.props.node &&
		children.props.node.children &&
		children.props.node.children[0]
	) {
		const color = children.props.node.children[0].color
		if (color && typeof color !== 'undefined') attr['style'] = { color }
	}

	return (
		<div>
			<li {...attr}>
				<span style={{ color: 'black' }}>{children}</span>
			</li>
		</div>
	)
}

export default Line
