import '../../viewer-component.scss'

import React from 'react'

const Line = props => (
	<span
		className={'text align-' + props.node.data.get('align')}
		data-indent={props.node.data.get('indent')}
		data-hanging-indent={props.node.data.get('hangingIndent')}
	>
		{props.children}
	</span>
)

export default Line
