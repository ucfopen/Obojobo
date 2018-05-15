import './viewer-component.scss'

import Common from 'Common'
import Viewer from 'Viewer'

let { OboComponent } = Common.components
let { OboModel } = Common.models

const ContentRaw = props => {
	let childEl = null

	if (props.navTargetModel) {
		let ChildComponent = props.navTargetModel.getComponentClass()
		childEl = <ChildComponent model={props.navTargetModel} moduleData={props.moduleData} />
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

import { connect } from 'react-redux'
let { NavUtil } = Viewer.util

// Connect to the redux store
const mapStateToProps = (state, ownProps) => ({
	navTargetModel: NavUtil.getNavTargetModel(state.nav.context.itemsById, state.nav.context.navTargetId)
})

const Content = connect(mapStateToProps)(ContentRaw)

export default Content
