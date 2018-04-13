import './viewer-component.scss'

export default props => (
	<div className="obojobo-draft--chunks--mc-question--content">
		{props.model.children.models.slice(0, -1).map((child, index) => {
			let Component = child.getComponentClass()
			return <Component key={child.get('id')} model={child} moduleData={props.moduleData} />
		})}
	</div>
)
