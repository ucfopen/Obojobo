require('./assessment-score-data-dialog.scss')

const React = require('react')
const ModuleImage = require('./module-image')
const Button = require('./button')
const Loading = require('./loading')
const AssessmentStats = require('./stats/assessment-stats')

const AssessmentScoreDataDialog = ({ draftId, title, onClose, isAttemptsLoading, attempts }) => {
	return (
		<div className="assessment-score-data-dialog">
			<div className="assessment-score-data-dialog--header">
				<ModuleImage id={draftId} />
				<div className="title">{title}</div>
				<Button className="close-button" onClick={onClose} ariaLabel="Close dialog">
					×
				</Button>
			</div>
			<div className="assessment-score-data-dialog--body">
				<Loading isLoading={isAttemptsLoading} loadingText={'Loading attempt data...'}>
					<AssessmentStats attempts={attempts} />
				</Loading>
			</div>
		</div>
	)
}

module.exports = AssessmentScoreDataDialog
