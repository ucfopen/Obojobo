require('./modal.scss')
require('./stats.scss')

const React = require('react')
const { useState, useEffect } = require('react')
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
		return (
			<AssessmentStats
				attempts={assessmentStats.items}
				defaultFilterSettings={{ showAdvancedFields: true }}
			/>
		)
	}

	return null
}

function Stats({
	currentUser,
	title,
	availableModules,
	assessmentStats,
	loadUserModuleList,
	loadModuleAssessmentDetails
}) {
	const [selectedDrafts, setSelectedDrafts] = useState([])
	const [search, setSearch] = useState('')

	// When the component is mounted in the browser, request the list of available modules for the current user
	useEffect(() => {
		loadUserModuleList()
	}, [])

	const loadStats = () => {
		loadModuleAssessmentDetails(selectedDrafts)
	}

	const onSearchChange = event => {
		setSearch(event.target.value)
	}

	const filteredModules =
		search.length === 0
			? availableModules.items
			: availableModules.items.filter(module => {
					const lcSearch = search.toLowerCase()
					return (
						module.draftId.indexOf(lcSearch) > -1 ||
						module.title.toLowerCase().indexOf(lcSearch) > -1
					)
			  })

	let moduleListRender = 'Loading...'
	if (availableModules.hasFetched) {
		moduleListRender = (
			<div className="repository--section-wrapper">
				<section className="repository--main-content">
					<input
						className="repository--drafts-search"
						placeholder="Search (By title or draftId)"
						value={search}
						onChange={onSearchChange}
					/>
					<DataGridDrafts rows={filteredModules} onSelectedDraftsChanged={setSelectedDrafts} />
					<Button
						disabled={selectedDrafts.length === 0 || selectedDrafts.length > 20}
						onClick={loadStats}
					>
						{selectedDrafts.length > 20
							? `Too many modules selected - Reduce the number of modules selected to 20 or less`
							: `Load stats for ${selectedDrafts.length} selected modules`}
					</Button>
					<div className="stats">{renderAssessmentStats(assessmentStats)}</div>
				</section>
			</div>
		)
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
			{moduleListRender}
		</span>
	)
}

module.exports = Stats
