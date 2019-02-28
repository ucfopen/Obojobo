import '../../viewer-component.scss'

import React from 'react'

const Line = props => {
	return (
		<span className={'text align-left'} data-indent={props.node.data.get('content').indent}>
			{props.children}
		</span>
	)
}

export default Line
