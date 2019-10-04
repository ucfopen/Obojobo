import React from 'react'

import './editor-component.scss'

class MCAssessment extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		const questionType = this.props.node.data.get('questionType') || 'default'

		return (
			<div
				className={`component obojobo-draft--chunks--mc-assessment editor--mc-assessment is-type-${questionType}`}
			>
				{this.props.children}
			</div>
		)
	}
}

export default MCAssessment
