const untestedView = assessment => {
	let child = assessment.props.model.children.at(0)
	let Component = child.getComponentClass()

	return (
		<div className="untested">
			<Component model={child} moduleData={assessment.props.moduleData} />
		</div>
	)
}

export default untestedView
