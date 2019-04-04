import '../../viewer-component.scss'

import React from 'react'

const Cell = props => {
	if (props.node.data.get('content').header) {
		return <th>{props.children}</th>
	}
	return <td>{props.children}</td>
}

export default Cell
