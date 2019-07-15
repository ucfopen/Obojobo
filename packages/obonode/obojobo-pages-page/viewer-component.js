import './viewer-component.scss'

import React from 'react'
import Viewer from 'obojobo-document-engine/src/scripts/viewer'

const { OboComponent } = Viewer.components
const { FocusUtil } = Viewer.util

export default class Page extends React.Component {
	static focusOnContent(model, opts) {
		const firstModel = model.children.at(0)
		if (!firstModel) return

		FocusUtil.focusComponent(firstModel.get('id'), opts)
	}

	render() {
		return (
			<OboComponent
				model={this.props.model}
				moduleData={this.props.moduleData}
				className="obojobo-draft--pages--page"
			>
				{this.props.children}
			</OboComponent>
		)
	}
}
