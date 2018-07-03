export default props => {
	const lti = props.ltiState
	const isLTIDataComplete = !!(lti && lti.state)
	const gradebookStatus = lti && lti.state ? lti.state.gradebookStatus : null
	const networkState = lti ? lti.networkState : null
	const resyncState = lti ? lti.resyncState : null
	const isPreviewing = props.isPreviewing
	const externalSystemLabel = props.externalSystemLabel
	const roundedAssessmentScore = Math.round(props.assessmentScore)

	return {
		isLTIDataComplete,
		gradebookStatus,
		networkState,
		resyncState,
		isPreviewing,
		externalSystemLabel,
		roundedAssessmentScore
	}
}
