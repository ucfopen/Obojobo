import './viewer-component.scss'

import React from 'react'

import Common from 'obojobo-document-engine/src/scripts/common/index'
import Viewer from 'obojobo-document-engine/src/scripts/viewer/index'

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
