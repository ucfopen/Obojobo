import './viewer-component.scss'

import Common from 'Common'
import Viewer from 'Viewer'

let { OboComponent } = Common.components
let { NavUtil } = Viewer.util

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
					let Component = child.getComponentClass()

					return <Component key={index} model={child} moduleData={this.props.moduleData} />
				})}
			</OboComponent>
		)
	}
}
