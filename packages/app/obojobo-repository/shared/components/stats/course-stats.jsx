require('./assessment-stats.scss')

const { useState, useEffect } = require('react')
const DataGridAttempts = require('./data-grid-attempts')
const DataGridAssessments = require('./data-grid-assessments')
const AssessmentStatsFilterControls = require('./assessment-stats-filter-controls')
const AssessmentStatsSearchControls = require('./assessment-stats-search-controls')

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

const CourseStats = ({ attempts, viewMode, searchSettings, searchContent, filterSettings }) => {

	const filteredAttempts = filterAttempts(attempts, filterSettings)

	return (
		<div className="repository--assessment-stats">
			{renderDataGrid(viewMode, filteredAttempts, filterSettings, searchSettings, searchContent)}
		</div>
	)
}

module.exports = CourseStats
