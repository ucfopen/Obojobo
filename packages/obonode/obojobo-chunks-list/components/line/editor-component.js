import '../../viewer-component.scss'

import React from 'react'

const Line = props => {
	return (
		<div>
			<li data-hanging-indent={props.node.data.get('hangingIndent')}>{props.children}</li>
		</div>
	)
}

export default Line
