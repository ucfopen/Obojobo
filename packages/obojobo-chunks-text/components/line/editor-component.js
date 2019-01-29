import '../../viewer-component.scss'

import React from 'react'

const Line = props => {
	return (
		<span
			className={'text align-' + props.node.data.get('align')}
			data-indent={props.node.data.get('indent')}
		>
			{props.children}
		</span>
	)
}

export default Line
