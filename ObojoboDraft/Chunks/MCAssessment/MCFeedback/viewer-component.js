import './viewer-component.scss'

import Common from 'Common'

let { OboComponent } = Common.components

export default class MCFeedback extends React.Component {
	render() {
		return (
			<OboComponent
				model={this.props.model}
				moduleData={this.props.moduleData}
				className={`obojobo-draft--chunks--mc-assessment--mc-feedback${
					this.props.model.parent.modelState.score === 100
						? ' is-correct-feedback'
						: ' is-incorrect-feedback'
				}`}
				data-choice-label={this.props.label}
			>
				{this.props.model.children.models.map((child, index) => {
					let Component = child.getComponentClass()
					return (
						<Component key={child.get('id')} model={child} moduleData={this.props.moduleData} />
					)
				})}
			</OboComponent>
		)
	}
}
