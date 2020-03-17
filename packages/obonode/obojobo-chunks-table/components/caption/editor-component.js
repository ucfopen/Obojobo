import '../../viewer-component.scss'

import React, { memo } from 'react'

const Caption = props => (
	<caption>
		<b>{props.children}</b>
	</caption>
)

export default memo(Caption)
