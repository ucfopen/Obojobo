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
	controls,
	filteredRows,
	setFilteredRows,
	isDebouncing
) => {
	switch (viewMode) {
		case VIEW_MODE_ALL_ATTEMPTS:
			return (
				<DataGridAttempts
					attempts={filteredAttempts}
					controls={controls}
					filteredRows={filteredRows}
					setFilteredRows={setFilteredRows}
					isDebouncing={isDebouncing}
				/>
			)

		case VIEW_MODE_FINAL_ASSESSMENT_SCORE:
		default:
			return (
				<DataGridAssessments
					attempts={filteredAttempts}
					controls={controls}
					filteredRows={filteredRows}
					setFilteredRows={setFilteredRows}
					isDebouncing={isDebouncing}
				/>
			)
	}
}

const filterAttempts = (attempts, controls) => {
	if (!attempts || attempts.length <= 0) return []

	attempts = attempts.map(attempt => {
		attempt.studentName = attempt.userFirstName + ' ' + attempt.userLastName
		return attempt
	})

	if (controls.showIncompleteAttempts && controls.showPreviewAttempts) {
		return attempts
	}

	return attempts.filter(
		attempt =>
			(controls.showIncompleteAttempts || attempt.completedAt !== null) &&
			(controls.showPreviewAttempts || !attempt.isPreview)
	)
}

const convertDateForDateInput = date => {
	// Converting to YYYY-MM-DD format (an acceptable format by <input type="date" />)
	let day = date.getDate()
	day = day < 10 ? '0' + day : day

	let month = date.getMonth() + 1
	month = month < 10 ? '0' + month : month

	const year = date.getFullYear()

	return `${year}-${month}-${day}`
}

const getLowerAndUpperDateBounds = attempts => {
	if (attempts.length <= 0) return { start: null, end: null }

	const dates = attempts.map(attempt => new Date(attempt.completedAt))
	let end = convertDateForDateInput(new Date(Math.max.apply(Math, dates)))
	let start = convertDateForDateInput(new Date(Math.min.apply(Math, dates)))

	return { start, end }
}

const AssessmentStats = ({ attempts, defaultFilterSettings = {} }) => {
	const [viewMode, setViewMode] = React.useState(VIEW_MODE_FINAL_ASSESSMENT_SCORE)
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

	// Used in order to display all possible values based on parameter search in
	// obo's hybrid text-input/select component.
	const [filteredRows, setFilteredRows] = React.useState([])
	const [isDebouncing, setIsDebouncing] = React.useState(false)

	const onChangeViewMode = event => {
		setViewMode(event.target.value)
	}

	const filteredAttempts = filterAttempts(attempts, controls)
	const dateBounds = getLowerAndUpperDateBounds(filteredAttempts)

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
				<div className="controls">
					<AssessmentStatsControls
						controls={controls}
						dateBounds={dateBounds}
						onChangeControls={setControls}
						dropdownValues={filteredRows}
						setIsDebouncing={setIsDebouncing}
					/>
				</div>
			</div>

			{renderDataGrid(viewMode, filteredAttempts, controls, filteredRows, setFilteredRows, isDebouncing)}
		</div>
	)
}

module.exports = AssessmentStats
