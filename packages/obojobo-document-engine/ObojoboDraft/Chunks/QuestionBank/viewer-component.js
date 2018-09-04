import './viewer-component.scss'

import Common from 'Common'
let { OboComponent } = Common.components

export default class QuestionBank extends React.Component {
	render() {
		return (
			<OboComponent
				model={this.props.model}
				moduleData={this.props.moduleData}
				className="obojobo-draft--chunks--question-bank"
			>
				{this.props.model.children.models.map((child, index) => {
					let Component = child.getComponentClass()

					return <Component key={index} model={child} moduleData={this.props.moduleData} />
				})}
			</OboComponent>
		)
	}
}
