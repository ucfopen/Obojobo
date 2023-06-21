require('./course-stats.scss')

const React = require('react')
const DataGridAttempts = require('./data-grid-attempts')
const DataGridAssessments = require('./data-grid-assessments')
const AssessmentStatsFilterControls = require('./assessment-stats-filter-controls')
const AssessmentStatsSearchControls = require('./assessment-stats-search-controls')

const VIEW_MODE_FINAL_ASSESSMENT_SCORE = 'final-assessment-scores'
const VIEW_MODE_ALL_ATTEMPTS = 'all-attempts'

// const renderDataGrid = (
// 	viewMode,
// 	filteredAttempts,
// 	filterSettings,
// 	searchSettings,
// 	searchContent
// ) => {
// 	switch (viewMode) {
// 		case VIEW_MODE_ALL_ATTEMPTS:
// 			return (
// 				<DataGridAttempts
// 					attempts={filteredAttempts}
// 					filterSettings={filterSettings}
// 					searchSettings={searchSettings}
// 					searchContent={searchContent}
// 				/>
// 			)

// 		case VIEW_MODE_FINAL_ASSESSMENT_SCORE:
// 		default:
// 			return (
// 				<DataGridAssessments
// 					attempts={filteredAttempts}
// 					filterSettings={filterSettings}
// 					searchSettings={searchSettings}
// 					searchContent={searchContent}
// 				/>
// 			)
// 	}
// }

// const filterAttempts = (attempts, { showIncompleteAttempts, showPreviewAttempts }) => {
// 	if (showIncompleteAttempts && showPreviewAttempts) {
// 		return attempts
// 	}

// 	return attempts.filter(
// 		attempt =>
// 			(showIncompleteAttempts || attempt.completedAt !== null) &&
// 			(showPreviewAttempts || !attempt.isPreview)
// 	)
// }

const CourseStats = ({ courses, defaultFilterSettings = {} }) => {
	const [viewMode, setViewMode] = React.useState(VIEW_MODE_FINAL_ASSESSMENT_SCORE)
	const [searchSettings, setSearchSettings] = React.useState('')
	const [searchContent, setSearchContent] = React.useState('')
	const [filterSettings, setFilterSettings] = React.useState(
		Object.assign(
			{ showIncompleteAttempts: false, showPreviewAttempts: false, showAdvancedFields: false },
			defaultFilterSettings
		)
	)
	const [searchVisible, setSearchVisible] = React.useState(false)

	const onChangeViewMode = event => {
		setViewMode(event.target.value)
	}

	const toggleSearchVisible = () => {
		setSearchVisible(!searchVisible)
	}

	// const filteredAttempts = filterAttempts(attempts, filterSettings)

	return (
		<div className="repository--course-stats">
			
			<div className="settings-sidebar">
				<div className="course-selection">
					{ courses.map((course) => {
						return <div>{ course.contextTitle }</div>
					}) }
				</div>
				<div className="toggle-filter" onClick={toggleSearchVisible}>
					<div className="toggle-filter-text">Advanced Search</div>
					<div className={'toggle-filter-icon' + (searchVisible ? '' : ' closed')}></div>
				</div>
				<div className={'settings' + (searchVisible ? '' : ' closed')}>
					<label className="view-mode">
						<span>Showing:</span>
						<select onChange={onChangeViewMode} value={viewMode}>
							<option value={VIEW_MODE_FINAL_ASSESSMENT_SCORE}>Final Assessment Scores</option>
							<option value={VIEW_MODE_ALL_ATTEMPTS}>All Attempt Scores</option>
						</select>
					</label>
					<hr />
					<div className="filters">
						<AssessmentStatsSearchControls
							onChangeSearchSettings={setSearchSettings}
							onChangeSearchContent={setSearchContent}
						/>
						<hr />
						<AssessmentStatsFilterControls
							filterSettings={filterSettings}
							onChangeFilterSettings={setFilterSettings}
						/>
					</div>
				</div>
			</div>

			{ JSON.stringify(courses)
			/*renderDataGrid(viewMode, filteredAttempts, filterSettings, searchSettings, searchContent) */}
		</div>
	)
}

module.exports = CourseStats
