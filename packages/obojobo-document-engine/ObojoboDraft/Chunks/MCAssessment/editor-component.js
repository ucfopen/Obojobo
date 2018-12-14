import './viewer-component.scss'

import React from 'react'

class MCAssessment extends React.Component {
	constructor(props) {
		super(props)
		this.state = props.node.data.get('content')
	}
	render() {
		return (
			<div
				className={
					'component obojobo-draft--chunks--mc-assessment is-response-type-pick-one-multiple-correct is-mode-practice is-not-showing-explanation is-not-scored'
				}
			>
				{this.props.children}
			</div>
		)
	}
}

export default MCAssessment
