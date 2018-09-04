import './viewer-component.scss'

import Common from 'Common'

let { OboComponent } = Common.components

export default props => (
	<OboComponent
		model={props.model}
		moduleData={props.moduleData}
		className="obojobo-draft--chunks--mc-assessment--mc-answer"
	>
		{props.model.children.models.map((child, index) => {
			let Component = child.getComponentClass()
			return <Component key={child.get('id')} model={child} moduleData={props.moduleData} />
		})}
	</OboComponent>
)
