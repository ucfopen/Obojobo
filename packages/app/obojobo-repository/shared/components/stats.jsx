require('./modal.scss')
require('./stats.scss')

const React = require('react')
const { useState } = require('react')
const RepositoryNav = require('./repository-nav')
const RepositoryBanner = require('./repository-banner')
const Button = require('./button')
const DataGridDrafts = require('./stats/data-grid-drafts')
const AssessmentStats = require('./stats/assessment-stats')

const renderAssessmentStats = assessmentStats => {
	if (assessmentStats.isFetching) {
		return 'Loading...'
	}

	if (assessmentStats.hasFetched) {
		return <AssessmentStats attempts={assessmentStats.items} />
	}

	return null
}

function Stats({ currentUser, title, allModules, assessmentStats, loadModuleAssessmentAnalytics }) {
	const [selectedDrafts, setSelectedDrafts] = useState([])

	const loadStats = () => {
		loadModuleAssessmentAnalytics(selectedDrafts)
	}

	return (
		<span id="stats-root">
			<RepositoryNav
				userId={currentUser.id}
				userPerms={currentUser.perms}
				avatarUrl={currentUser.avatarUrl}
				displayName={`${currentUser.firstName} ${currentUser.lastName}`}
				noticeCount={0}
			/>
			<RepositoryBanner title={title} className="default-bg" />
			<div className="repository--section-wrapper">
				<section className="repository--main-content">
					<DataGridDrafts rows={allModules} onSelectedDraftsChanged={setSelectedDrafts} />
					<Button
						disabled={selectedDrafts.length === 0}
						onClick={loadStats}
					>{`Load stats for ${selectedDrafts.length} selected modules`}</Button>
					<div className="stats">{renderAssessmentStats(assessmentStats)}</div>
				</section>
			</div>
		</span>
	)
}

module.exports = Stats
