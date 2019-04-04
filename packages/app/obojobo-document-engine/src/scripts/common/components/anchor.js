import React from 'react'

const EMPTY_CHAR = String.fromCharCode(8203)

const Anchor = props => (
	<span
		{...props}
		className="anchor"
		contentEditable={true}
		tabIndex={props.shouldPreventTab ? '-1' : ''}
		suppressContentEditableWarning={true}
		data-group-index={`anchor:${props.name}`}
	>
		{EMPTY_CHAR}
	</span>
)

export default Anchor
