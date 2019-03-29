import './viewer-component.scss'

import Common from 'obojobo-document-engine/src/scripts/common'
import React from 'react'
import Viewer from 'obojobo-document-engine/src/scripts/viewer'

const { OboComponent } = Viewer.components
const { focus } = Common.page

export default class Page extends React.Component {
	static focusOnContent(model) {
		const firstModel = model.children.at(0)
		if (!firstModel) return

		focus(firstModel.getDomEl())
	}

	render() {
		return (
			<OboComponent
				model={this.props.model}
				moduleData={this.props.moduleData}
				className="obojobo-draft--pages--page"
			>
				{this.props.model.children.models.map((child, index) => {
					const Component = child.getComponentClass()

					return <Component key={index} model={child} moduleData={this.props.moduleData} />
				})}
			</OboComponent>
		)
	}
}
