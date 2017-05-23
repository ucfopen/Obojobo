import './viewer-component.scss';

import Common from 'Common'
let { OboComponent } = Common.components;

let QuestionBank = React.createClass({
	render() {
		return <OboComponent
			model={this.props.model}
			moduleData={this.props.moduleData}
			className="obojobo-draft--chunks--question-bank"
		>
			{
				this.props.model.children.models.map(((child, index) => {
					let Component = child.getComponentClass();

					return <Component key={index} model={child} moduleData={this.props.moduleData} />;
				}))
			}
		</OboComponent>;
	}
});


export default QuestionBank;