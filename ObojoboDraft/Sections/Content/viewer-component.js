import './viewer-component.scss'

import React from 'react'

import Common from 'Common'
import Viewer from 'Viewer'

const { OboComponent } = Common.components
const { NavUtil } = Viewer.util

const Content = props => {
	let childEl = null
	const navTargetModel = NavUtil.getNavTargetModel(props.moduleData.navState)

	if (navTargetModel) {
		const ChildComponent = navTargetModel.getComponentClass()
		childEl = <ChildComponent model={navTargetModel} moduleData={props.moduleData} />
	}

	return (
		<OboComponent
			model={props.model}
			moduleData={props.moduleData}
			className="obojobo-draft--sections--content"
		>
			<div>{childEl}</div>
		</OboComponent>
	)
}

export default Content
