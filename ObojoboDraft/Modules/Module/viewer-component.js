import './viewer-component.scss'

import React from 'react'

import Common from 'Common'
import Viewer from 'Viewer'

const { OboComponent } = Common.components
const { Dispatcher } = Common.flux
const { NavUtil } = Viewer.util

class Module extends React.Component {
	componentWillReceiveProps(nextProps) {
		if (nextProps.moduleData.navState.navTargetId !== this.props.moduleData.navState.navTargetId) {
			Dispatcher.trigger('viewer:focusOnContent')
		}
	}

	render() {
		let childEl = null
		const navTargetModel = NavUtil.getNavTargetModel(this.props.moduleData.navState)

		if (navTargetModel && navTargetModel.getComponentClass) {
			const ChildComponent = navTargetModel.getComponentClass()
			childEl = <ChildComponent model={navTargetModel} moduleData={this.props.moduleData} />
		}

		return (
			<OboComponent
				model={this.props.model}
				moduleData={this.props.moduleData}
				className="obojobo-draft--modules--module"
				tabIndex="-1"
				role="main"
			>
				<div>{childEl}</div>
			</OboComponent>
		)
	}
}

export default Module
