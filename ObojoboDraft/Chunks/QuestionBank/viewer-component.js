import './viewer-component.scss'

import Common from 'Common'
let { OboComponent } = Common.components

export default props => (
	<OboComponent
		model={props.model}
		moduleData={props.moduleData}
		className="obojobo-draft--chunks--question-bank"
	>
		{props.model.children.models.map((child, index) => {
			let Component = child.getComponentClass()

			return <Component key={index} model={child} moduleData={props.moduleData} />
		})}
	</OboComponent>
)
