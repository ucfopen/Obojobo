import React from 'react'

import { EMPTY_CHAR } from '../../common/text/text-constants'

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
