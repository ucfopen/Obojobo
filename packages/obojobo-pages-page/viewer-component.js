import './viewer-component.scss'

import React from 'react'

import Common from 'obojobo-document-engine/src/scripts/common/index'
import Viewer from 'obojobo-document-engine/src/scripts/viewer/index'

const { OboComponent } = Common.components
const { NavUtil } = Viewer.util

export default class Page extends React.Component {
	componentWillReceiveProps(nextProps) {
		if (nextProps.moduleData.navState.navTargetId !== this.props.moduleData.navState.navTargetId) {
			return NavUtil.setFlag(this.props.moduleData.navState.navTargetId, 'visited', true)
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
