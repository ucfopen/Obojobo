import './viewer-component.scss'

import Common from 'Common'
import Viewer from 'Viewer'

let { navStore } = Viewer.stores
let { OboComponent } = Common.components
let { OboModel } = Common.models
let { Dispatcher } = Common.flux
let { NavUtil } = Viewer.util

export default class Module extends React.Component {
	render() {
		let childEl = null
		let navTargetModel = NavUtil.getNavTargetModel(this.props.moduleData.navState)

		if (navTargetModel) {
			let ChildComponent = navTargetModel.getComponentClass()
			childEl = <ChildComponent model={navTargetModel} moduleData={this.props.moduleData} />
		}

		return (
			<OboComponent
				model={this.props.model}
				moduleData={this.props.moduleData}
				className="obojobo-draft--modules--module"
			>
				<div>
					{childEl}
				</div>
			</OboComponent>
		)
	}
}
