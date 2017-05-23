import './viewer-component.scss';

import Common from 'Common';
import Viewer from 'Viewer';

let { OboComponent } = Common.components;
let { OboModel } = Common.models;
let { NavUtil } = Viewer.util;

export default React.createClass({
	render() {
		let childEl = null;
		let navTargetModel = NavUtil.getNavTargetModel(this.props.moduleData.navState);
		if (navTargetModel) {
			let child = this.props.model.getChildContainingModel(navTargetModel);
			let ChildComponent = child.getComponentClass();
			childEl = <ChildComponent model={child} moduleData={this.props.moduleData} />;
		}

		return <OboComponent
			model={this.props.model}
			moduleData={this.props.moduleData}
			className="obojobo-draft--sections--content"
		>
			<div>
				{childEl}
			</div>

		</OboComponent>;
	}
});