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
		selector: 'userUsername',
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
		name: 'Attempt ID',
		selector: 'attemptId',
		sortable: true,
		advanced: false
	},
	{
		name: 'Imported Attempt ID',
		selector: 'importedAttemptId',
		cell: row => <div>{String(row.importedAttemptId)}</div>,
		sortable: true,
		advanced: false
	},
	{
		name: 'Attempt Score',
		selector: 'attemptScore',
		cell: row => <div>{String(row.attemptScore)}</div>,
		sortable: true,
		advanced: false
	},
	{
		name: 'Assessment Status',
		selector: 'assessmentStatus',
		cell: row => <div>{String(row.assessmentStatus)}</div>,
		sortable: true,
		advanced: true
	},
	{
		name: 'Mod Reward Total',
		selector: 'modRewardTotal',
		cell: row => <div>{String(row.modRewardTotal)}</div>,
		sortable: true,
		advanced: true
	},
	{
		name: 'Assessment Score',
		selector: 'assessmentScore',
		sortable: true,
		advanced: false
	},
	{
		name: 'LTI Score Sent',
		selector: 'ltiScoreSent',
		sortable: true,
		advanced: true
	},
	{
		name: 'LTI Status',
		selector: 'ltiStatus',
		sortable: true,
		advanced: true
	},
	{
		name: 'LTI Gradebook Status',
		selector: 'ltiGradebookStatus',
		sortable: true,
		advanced: true
	},
	{
		name: 'Started Time',
		selector: 'createdAt',
		sortable: true,
		advanced: false
	},
	{
		name: 'Submitted Time',
		selector: 'completedAt',
		sortable: true,
		advanced: false
	},
	{
		name: 'Invalid',
		selector: 'isInvalid',
		cell: row => <div>{String(row.isInvalid)}</div>,
		sortable: true,
		advanced: true
	},
	{
		name: 'Preview Mode',
		selector: 'isPreview',
		cell: row => <div>{String(row.isPreview)}</div>,
		sortable: true,
		advanced: false
	}
]

function DataGridAttempts({ attempts = [], filterSettings, searchSettings, searchContent }) {
	return (
		<div className="repository--data-grid-attempts">
			<DataGridScores
				tableName="Attempt Scores"
				csvFileName="attempt-scores"
				columns={columns}
				rows={attempts}
				filterSettings={filterSettings}
				searchSettings={searchSettings}
				searchContent={searchContent}
			/>
		</div>
	)
}

module.exports = DataGridAttempts
