import Common from 'Common'
import { FOCUS_ON_ASSESSMENT_CONTENT } from '../../assessment-event-constants'
import React from 'react'

const Dispatcher = Common.flux.Dispatcher

class AssessmentPreTest extends React.Component {
	constructor() {
		super()
		this.boundFocusOnContent = this.focusOnContent.bind(this)
	}

	componentDidMount() {
		Dispatcher.on(FOCUS_ON_ASSESSMENT_CONTENT, this.boundFocusOnContent)
	}

	componentWillUnmount() {
		Dispatcher.off(FOCUS_ON_ASSESSMENT_CONTENT, this.boundFocusOnContent)
	}

	focusOnContent() {
		const Component = this.props.model.getComponentClass()
		if (!Component || !Component.focusOnContent) return false

		Component.focusOnContent(this.props.model)

		return true
	}

	render() {
		const Component = this.props.model.getComponentClass()

		return (
			<div className="pre-test">
				<Component model={this.props.model} moduleData={this.props.moduleData} />
			</div>
		)
	}
}

export default AssessmentPreTest
