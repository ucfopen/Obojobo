import '../../viewer-component.scss'

import React, { memo } from 'react'

const Caption = props => (
	<div className="obojobo-draft--chunks--table--caption">{props.children}</div>
)

export default memo(Caption)
