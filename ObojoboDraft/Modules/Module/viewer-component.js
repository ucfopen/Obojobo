import './viewer-component.scss'

import Common from 'Common'
import Viewer from 'Viewer'

let { navStore } = Viewer.stores
let { OboComponent } = Common.components
let { OboModel } = Common.models
let { Dispatcher } = Common.flux
let { NavUtil } = Viewer.util
import { connect } from 'react-redux'

const ModuleRaw = props => {
	let childEl = null
	let navTargetModel = NavUtil.getNavTargetModel(props.nav.itemsById, props.nav.navTargetId)

	if (navTargetModel) {
		let ChildComponent = navTargetModel.getComponentClass()
		childEl = <ChildComponent model={navTargetModel} moduleData={props.moduleData} />
	}

	return (
		<OboComponent
			model={props.model}
			moduleData={props.moduleData}
			className="obojobo-draft--modules--module"
		>
			<div>{childEl}</div>
		</OboComponent>
	)
}

// Connect to the redux store
const mapStateToProps = (state, ownProps) => ({
	nav: state.nav
})
const Module = connect(mapStateToProps)(ModuleRaw)

export default Module
