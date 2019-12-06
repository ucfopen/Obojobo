import './editor-component.scss'

import React from 'react'
import Common from 'obojobo-document-engine/src/scripts/common'

class Assessment extends React.Component {
	constructor(props) {
		super(props)
		this.state = this.props.node.data.get('content')
	}

	render() {
		return (
			<div className={'obojobo-draft--sections--assessment'}>
				{this.props.children}
			</div>
		)
	}
}

export default Assessment
