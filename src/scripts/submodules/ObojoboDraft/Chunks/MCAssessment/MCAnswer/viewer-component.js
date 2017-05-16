import './viewer-component.scss';

import ObojoboDraft from 'ObojoboDraft'

let { OboComponent } = ObojoboDraft.components;

let MCAnswer = React.createClass({
	render() {
		return <OboComponent
			model={this.props.model}
			moduleData={this.props.moduleData}
			className="obojobo-draft--chunks--mc-assessment--mc-answer"
		>
			{
				this.props.model.children.models.map(((child, index) => {
					let Component = child.getComponentClass();
					return <Component key={child.get('id')} model={child} moduleData={this.props.moduleData} />;
				}))
			}
		</OboComponent>;
	}
});

export default MCAnswer;