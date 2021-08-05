require('./assessment-stats.scss')

const React = require('react')
const DataGridAttempts = require('./data-grid-attempts')
const DataGridAssessments = require('./data-grid-assessments')
const AssessmentStatsControls = require('./assessment-stats-controls')

const VIEW_MODE_FINAL_ASSESSMENT_SCORE = 'final-assessment-scores'
const VIEW_MODE_ALL_ATTEMPTS = 'all-attempts'

const renderDataGrid = (
	viewMode,
	filteredAttempts,
	filterSettings,
	searchSettings,
	searchContent
) => {
	switch (viewMode) {
		case VIEW_MODE_ALL_ATTEMPTS:
			return (
				<DataGridAttempts
					attempts={filteredAttempts}
					filterSettings={filterSettings}
					searchSettings={searchSettings}
					searchContent={searchContent}
				/>
			)

		case VIEW_MODE_FINAL_ASSESSMENT_SCORE:
		default:
			return (
				<DataGridAssessments
					attempts={filteredAttempts}
					filterSettings={filterSettings}
					searchSettings={searchSettings}
					searchContent={searchContent}
				/>
			)
	}
}

const filterAttempts = (attempts, { showIncompleteAttempts, showPreviewAttempts }) => {
	if (showIncompleteAttempts && showPreviewAttempts) {
		return attempts
	}

	return attempts.filter(
		attempt =>
			(showIncompleteAttempts || attempt.completedAt !== null) &&
			(showPreviewAttempts || !attempt.isPreview)
	)
}

const AssessmentStats = ({ attempts, defaultFilterSettings = {} }) => {
	const [viewMode, setViewMode] = React.useState(VIEW_MODE_FINAL_ASSESSMENT_SCORE)
	// const [searchSettings, setSearchSettings] = React.useState('')
	// const [searchContent, setSearchContent] = React.useState('')
	// const [filterSettings, setFilterSettings] = React.useState(
	// 	Object.assign(
	// 		{ showIncompleteAttempts: false, showPreviewAttempts: false, showAdvancedFields: false },
	// 		defaultFilterSettings
	// 	)
	// )
	const [controls, setControls] = React.useState(
		Object.assign(
			{
				showIncompleteAttempts: false,
				showPreviewAttempts: false,
				showAdvancedFields: false,
				searchBy: '',
				searchContent: {
					searchString: '',
					date: { start: '', end: '' }
				}
			},
			defaultFilterSettings
		)
	)

	const onChangeViewMode = event => {
		setViewMode(event.target.value)
	}

	const filteredAttempts = filterAttempts(attempts, filterSettings)

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
				<hr />
				<div className="filters">
					<AssessmentStatsControls
						filterSettings={filterSettings}
						onChangeFilterSettings={setFilterSettings}
						onChangeSearchSettings={setSearchSettings}
						onChangeSearchContent={setSearchContent}
						
						controls={controls}
						onChangeControls={setControls}
					/>
				</div>
			</div>

			{renderDataGrid(viewMode, filteredAttempts, filterSettings, searchSettings, searchContent)}
		</div>
	)
}

module.exports = AssessmentStats
