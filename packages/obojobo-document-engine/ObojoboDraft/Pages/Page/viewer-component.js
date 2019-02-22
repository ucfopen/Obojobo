import './viewer-component.scss'

import React from 'react'

import Viewer from 'Viewer'

const { OboComponent } = Viewer.components
const { NavUtil, FocusUtil } = Viewer.util

export default class Page extends React.Component {
	static focusOnContent(model, opts) {
		const firstModel = model.children.at(0)
		if (!firstModel) return

		FocusUtil.focusComponent(firstModel.get('id'), opts)
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.moduleData.navState.navTargetId !== this.props.moduleData.navState.navTargetId) {
			NavUtil.setFlag(this.props.moduleData.navState.navTargetId, 'visited', true)
		}
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
