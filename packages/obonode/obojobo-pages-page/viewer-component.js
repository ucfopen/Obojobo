import './viewer-component.scss'

import React from 'react'
import Viewer from 'obojobo-document-engine/src/scripts/viewer'

const { OboComponent } = Viewer.components
const { FocusUtil } = Viewer.util

class Page extends React.Component {
	// static focusOnContent(model, opts) {
	// 	const firstModel = model.children.at(0)
	// 	if (!firstModel) return

	// 	FocusUtil.focusComponent(firstModel.get('id'), opts)
	// }

	render() {
		console.log('Page')
		return (
			<OboComponent
				// model={this.props.model}
				// moduleData={this.props.moduleData}
				className="obojobo-draft--pages--page"
			>
				{/* {this.props.model.children.models.map((child, index) => {
					const Component = child.getComponentClass()

					return <Component key={index} model={child} moduleData={this.props.moduleData} />
				})} */}
				{this.props.children}
			</OboComponent>
		)
	}
}

export default Page
