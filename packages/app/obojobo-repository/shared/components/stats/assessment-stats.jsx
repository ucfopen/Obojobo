require('./assessment-stats.scss')

const React = require('react')
const DataGridAttempts = require('./data-grid-attempts')
const DataGridAssessments = require('./data-grid-assessments')
const AssessmentStatsFilterControls = require('./assessment-stats-filter-controls')

const VIEW_MODE_FINAL_ASSESSMENT_SCORE = 'final-assessment-scores'
const VIEW_MODE_ALL_ATTEMPTS = 'all-attempts'

const renderDataGrid = (viewMode, attempts, filterSettings) => {
	switch (viewMode) {
		case VIEW_MODE_FINAL_ASSESSMENT_SCORE:
			return <DataGridAssessments rows={attempts} filterSettings={filterSettings} />

		case VIEW_MODE_ALL_ATTEMPTS:
			return <DataGridAttempts rows={attempts} filterSettings={filterSettings} />
	}

	return null
}

const AssessmentStats = ({ attempts }) => {
	const [viewMode, setViewMode] = React.useState(VIEW_MODE_FINAL_ASSESSMENT_SCORE)
	const [filterSettings, setFilterSettings] = React.useState({
		showIncompleteAttempts: false,
		showPreviewAttempts: false
	})

	const onChangeViewMode = event => {
		setViewMode(event.target.value)
	}

	return (
		<div className="repository--assessment-stats">
			<div className="settings">
				<label className="view-mode">
					<span>Showing:</span>
					<select onChange={onChangeViewMode} value={viewMode}>
						<option value={VIEW_MODE_FINAL_ASSESSMENT_SCORE}>Final Assessment Scores</option>
						<option value={VIEW_MODE_ALL_ATTEMPTS}>All Attempt Scores</option>
					</select>
				</label>
				<div className="filters">
					<span>Filters:</span>
					<AssessmentStatsFilterControls
						filterSettings={filterSettings}
						onChangeFilterSettings={setFilterSettings}
					/>
				</div>
			</div>

			{renderDataGrid(viewMode, attempts, filterSettings)}
		</div>
	)
}

module.exports = AssessmentStats
