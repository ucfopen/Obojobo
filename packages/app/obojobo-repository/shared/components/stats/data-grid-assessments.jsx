const React = require('react')
const DataGridScores = require('./data-grid-scores')

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

const composeKey = ({ draftId, userId, resourceLinkId, assessmentId }) =>
	draftId + ' ' + userId + ' ' + resourceLinkId + ' ' + assessmentId

const getAssessmentScoresFromAttempts = (attempts, searchSettings, searchContent) => {
	const assessmentScoresByDraftAndUserAndResourceLinkIdAndAssessmentId = {}

	attempts.forEach(attemptRow => {
		const key = composeKey(attemptRow)

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
				highestAssessmentScore: null,
				completedAt: attemptRow.completedAt ? attemptRow.completedAt : null
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

	const text = searchContent.text;
	const dates = searchContent.date;
	const rows = assessmentScoresByDraftAndUserAndResourceLinkIdAndAssessmentId;

	if (rows && rows.length > 0) {
		// Filtering according to starting and ending dates.
		if (dates) {
			rows.filter(row => {
				const dateCompleted = new Date(row.completedAt)
				const start = dates.start ? new Date(dates.start) : null
				const end = dates.end ? new Date(dates.end) : null

				if (!start && !end) return row
				if (!start) return dateCompleted <= end
				if (!end) return dateCompleted >= start

				return dateCompleted >= start && dateCompleted <= end
			})
		}

		if (text) {
			let param = searchSettings
							.split("-")
							.map(word => word.charAt(0).toUpperCase() + word.substring(1))
							.join("")
			param = param.charAt(0).toLowerCase() + param.substring(1)

			// Filtering according to search params (course title, user's first name, etc)
			rows.filter(row => {
				return row[param].toLowerCase().match(text) && true;
			})
		}
	}

	return Object.values(rows)
}

function DataGridAssessments({ attempts = [], filterSettings, searchSettings, searchContent }) {
	const assessmentScores = getAssessmentScoresFromAttempts(attempts, searchSettings, searchContent)

	return (
		<div className="repository--data-grid-assessments">
			<DataGridScores
				tableName="Final Assessment Scores"
				csvFileName="final-assessment-scores"
				columns={columns}
				rows={assessmentScores}
				filterSettings={filterSettings}
			/>
		</div>
	)
}

module.exports = DataGridAssessments
