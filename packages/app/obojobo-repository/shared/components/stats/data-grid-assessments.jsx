require('./data-grid-assessments.scss')

const React = require('react')
const DataTable = require('react-data-table-component').default
const ButtonLink = require('../button-link')

const columns = [
	{
		name: 'Course ID',
		selector: 'contextId',
		sortable: true,
		advanced: true
	},
	{
		name: 'Course Title',
		selector: 'courseTitle',
		sortable: true,
		advanced: false
	},
	{
		name: 'Resource Link ID',
		selector: 'resourceLinkId',
		sortable: true,
		advanced: true
	},
	{
		name: 'Resource Link Title',
		selector: 'resourceLinkTitle',
		sortable: true,
		advanced: false
	},
	{
		name: 'URL',
		selector: 'launchPresentationReturnUrl',
		cell: row => (
			<div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
				<a target="_blank" href={row.launchPresentationReturnUrl}>
					{row.launchPresentationReturnUrl}
				</a>
			</div>
		),
		sortable: true,
		advanced: false
	},
	{
		name: 'Draft ID',
		selector: 'draftId',
		sortable: true,
		advanced: true
	},
	{
		name: 'Draft Content ID',
		selector: 'draftContentId',
		sortable: true,
		advanced: true
	},
	{
		name: 'Module Title',
		selector: 'moduleTitle',
		sortable: true,
		advanced: true
	},
	{
		name: 'Assessment ID',
		selector: 'assessmentId',
		sortable: true,
		advanced: true
	},
	{
		name: 'Username',
		selector: 'username',
		sortable: true,
		advanced: true
	},
	{
		name: 'First Name',
		selector: 'userFirstName',
		sortable: true,
		advanced: false
	},
	{
		name: 'Last Name',
		selector: 'userLastName',
		sortable: true,
		advanced: false
	},
	{
		name: 'User Roles',
		selector: 'userRoles',
		sortable: true,
		advanced: true
	},
	{
		name: 'Final Assessment Score',
		sortable: true,
		advanced: false,
		selector: 'highestAssessmentScore',
		cell: row => <div>{String(row.highestAssessmentScore)}</div>
	},
	{
		name: 'Preview Mode',
		sortable: true,
		advanced: false,
		selector: 'isPreview',
		cell: row => <div>{String(row.isPreview)}</div>
	}
]

const simpleColumns = columns.filter(col => !col.advanced)

const getColumns = (columns, showAdvancedFields) => {
	return showAdvancedFields ? columns : simpleColumns
}

const statsToCSV = (showAdvancedFields, attempts) => {
	const filteredColumns = columns.filter(c => showAdvancedFields || !c.advanced)
	const cols = `"${filteredColumns.map(c => c.name).join('","')}"`
	const colOrder = filteredColumns.map(c => c.selector)
	const rows = attempts.map(attempt => `"${colOrder.map(key => attempt[key]).join('","')}"`)
	return `${cols}\n${rows.join('\n')}`
}

const getAssessmentScoresFromAttempts = (
	attempts,
	{ showIncompleteAttempts, showPreviewAttempts }
) => {
	const assessmentScoresByDraftAndUserAndResourceLinkIdAndAssessmentId = {}

	attempts
		.filter(
			row =>
				(showIncompleteAttempts || row.completedAt !== null) &&
				(showPreviewAttempts || !row.isPreview)
		)
		.forEach(attemptRow => {
			const key =
				attemptRow.draftId +
				':' +
				attemptRow.userId +
				':' +
				attemptRow.resourceLinkId +
				':' +
				attemptRow.assessmentId

			if (!assessmentScoresByDraftAndUserAndResourceLinkIdAndAssessmentId[key]) {
				assessmentScoresByDraftAndUserAndResourceLinkIdAndAssessmentId[key] = {
					draftId: attemptRow.draftId,
					draftContentId: attemptRow.draftContentId,
					resourceLinkId: attemptRow.resourceLinkId,
					assessmentId: attemptRow.assessmentId,
					username: attemptRow.userUsername,
					userFirstName: attemptRow.userFirstName,
					userLastName: attemptRow.userLastName,
					userRoles: attemptRow.userRoles,
					isPreview: attemptRow.isPreview,
					contextId: attemptRow.contextId,
					courseTitle: attemptRow.courseTitle,
					resourceLinkTitle: attemptRow.resourceLinkTitle,
					launchPresentationReturnUrl: attemptRow.launchPresentationReturnUrl,
					moduleTitle: attemptRow.moduleTitle,
					highestAssessmentScore: null
				}
			}

			const assessmentRow = assessmentScoresByDraftAndUserAndResourceLinkIdAndAssessmentId[key]

			if (
				attemptRow.completedAt !== null &&
				attemptRow.assessmentScore !== null &&
				attemptRow.assessmentScore > assessmentRow.highestAssessmentScore
			) {
				assessmentRow.highestAssessmentScore = attemptRow.assessmentScore
			}
		})

	return Object.values(assessmentScoresByDraftAndUserAndResourceLinkIdAndAssessmentId)
}

const getFileName = (
	filteredRows,
	{ showIncompleteAttempts, showPreviewAttempts, showAdvancedFields }
) => {
	const drafts = [...new Set(filteredRows.map(row => row.draftId))]
	return (
		[
			'final-assessment-scores',
			showIncompleteAttempts ? 'with-incomplete-attempts' : '',
			showPreviewAttempts ? 'with-preview-attempts' : '',
			showAdvancedFields ? 'with-advanced-fields' : ''
		]
			.filter(s => s)
			.join('-') +
		'__' +
		drafts.join('_')
	)
}

function DataGridAssessments({ rows = [], filterSettings }) {
	const assessmentScores = getAssessmentScoresFromAttempts(rows, filterSettings)

	return (
		<div className="repository--data-grid-assessments">
			<div className="data-grid">
				<DataTable
					title="Final Assessment Scores"
					columns={getColumns(columns, filterSettings.showAdvancedFields)}
					data={assessmentScores}
					striped={true}
					keyField={'attemptId'}
					dense={true}
				/>
			</div>
			{assessmentScores.length > 0 ? (
				<ButtonLink
					url={`data:text/csv;charset=utf-8,${escape(
						statsToCSV(filterSettings.showAdvancedFields, assessmentScores)
					)}`}
					download={getFileName(assessmentScores, filterSettings)}
				>
					⬇️&nbsp;&nbsp;&nbsp;Download Table as CSV File ({assessmentScores.length} row
					{assessmentScores.length === 1 ? '' : 's'})
				</ButtonLink>
			) : null}
		</div>
	)
}

module.exports = DataGridAssessments
