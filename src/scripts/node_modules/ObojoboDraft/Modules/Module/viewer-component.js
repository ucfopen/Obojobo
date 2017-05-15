import './viewer-component.scss';

import ObojoboDraft from 'ObojoboDraft'
import Viewer from 'Viewer'

let { navStore } = Viewer.stores;
let { OboComponent } = ObojoboDraft.components;
let { OboModel } = ObojoboDraft.models;
let { Dispatcher } = ObojoboDraft.flux;
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
			className="obojobo-draft--modules--module"
		>
			<div>
				{childEl}
			</div>
		</OboComponent>;
	}
});