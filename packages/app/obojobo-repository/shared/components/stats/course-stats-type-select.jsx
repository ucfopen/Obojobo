const React = require('react')

const VIEW_MODE_FINAL_ASSESSMENT_SCORE = 'final-assessment-scores'
const VIEW_MODE_ALL_ATTEMPTS = 'all-attempts'

function CourseStatsTypeSelect({ viewMode, onChangeViewMode }) {
	const changeViewMode = event => {
		onChangeViewMode(event.target.value)
	}

	return (
		<label className="view-mode">
			Show:
			<select className="view-mode-selector" onChange={changeViewMode} value={viewMode}>
				<option value={VIEW_MODE_FINAL_ASSESSMENT_SCORE}>Final Assessment Scores</option>
				<option value={VIEW_MODE_ALL_ATTEMPTS}>All Attempt Scores</option>
			</select>
		</label>
	)
}

module.exports = CourseStatsTypeSelect
