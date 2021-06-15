require('./modal.scss')
require('./stats.scss')

const React = require('react')
const { useState, useEffect } = require('react')
const RepositoryNav = require('./repository-nav')
const RepositoryBanner = require('./repository-banner')
const ModulePermissionsDialog = require('./module-permissions-dialog')
const ModuleOptionsDialog = require('./module-options-dialog')
const VersionHistoryDialog = require('./version-history-dialog')
const Button = require('./button')
const ReactModal = require('react-modal')
const DataGridDrafts = require('./stats/data-grid-drafts')
const AssessmentStats = require('./stats/assessment-stats')

const getAttemptSummariesFromResData = attempts => {
	return attempts.map(attempt => {
		attempt.userRoles = attempt.userRoles.join(',')
		attempt.attemptScore = attempt.attemptResult ? attempt.attemptResult.attemptScore : null
		attempt.assessmentStatus = attempt.scoreDetails ? attempt.scoreDetails.status : null
		attempt.modRewardTotal = attempt.scoreDetails ? attempt.scoreDetails.rewardTotal : null
		attempt.isInvalid = attempt.state && attempt.state.invalid === true ? true : false

		return attempt
	})
}

const renderOptionsDialog = props => (
	<ModuleOptionsDialog
		title=""
		{...props.selectedModule}
		showModulePermissions={props.showModulePermissions}
		deleteModule={props.deleteModule}
		onClose={props.closeModal}
		showVersionHistory={props.showVersionHistory}
	/>
)

const renderPermissionsDialog = props => (
	<ModulePermissionsDialog
		title=""
		{...props.selectedModule}
		searchState={props.searchPeople}
		loadUsersForModule={props.loadUsersForModule}
		onClose={props.closeModal}
		addUserToModule={props.addUserToModule}
		draftPermissions={props.draftPermissions}
		deleteModulePermissions={props.deleteModulePermissions}
		currentUserId={props.currentUser.id}
	/>
)

const renderVersionHistoryDialog = props => (
	<VersionHistoryDialog
		{...props.selectedModule}
		title={`${props.selectedModule.title} - Version History`}
		onClose={props.closeModal}
		isHistoryLoading={props.versionHistory.isFetching}
		hasHistoryLoaded={props.versionHistory.hasFetched}
		versionHistory={props.versionHistory.items}
		restoreVersion={props.restoreVersion}
		checkModuleLock={props.checkModuleLock}
		currentUserId={props.currentUser.id}
	/>
)

const renderModalDialog = props => {
	let dialog
	let title
	switch (props.dialog) {
		case 'module-more':
			title = 'Module Options'
			dialog = renderOptionsDialog(props)
			break

		case 'module-permissions':
			title = 'Module Access'
			dialog = renderPermissionsDialog(props)
			break

		case 'module-version-history':
			title = 'Module Version History'
			dialog = renderVersionHistoryDialog(props)
			break

		default:
			return null
	}

	ReactModal.setAppElement('#stats-root')

	return (
		<ReactModal
			isOpen={true}
			contentLabel={title}
			className="repository--modal"
			overlayClassName="repository--modal-overlay"
			onRequestClose={props.closeModal}
		>
			{dialog}
		</ReactModal>
	)
}

const getModuleCount = modules => {
	if (modules.length === 1) {
		return '1 Module Selected: '
	} else {
		return `${modules.length} Modules Selected:`
	}
}

const getSortMethod = sortOrder => {
	let sortFn
	switch (sortOrder) {
		case 'alphabetical':
			sortFn = (a, b) => a.title.localeCompare(b.title)
			break

		case 'newest':
			sortFn = (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
			break

		case 'last updated':
			sortFn = (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
			break
	}

	return sortFn
}

function Stats(props) {
	const [sortOrder, setSortOrder] = useState(props.sortOrder)
	const [newModuleId, setNewModuleId] = useState(null)
	const [stats, setStats] = useState([])
	const [drafts, setDrafts] = useState([])
	const [selectedDrafts, setSelectedDrafts] = useState([])

	const moduleList = props.filteredModules ? props.filteredModules : props.myModules

	const onKeyUp = e => {
		if (e.key === 'Escape' && props.multiSelectMode && props.deselectModules) {
			props.deselectModules(props.selectedModules)
		}
	}

	const handleCreateNewModule = useTutorial => {
		props.createNewModule(useTutorial).then(data => {
			data.payload.value.sort(getSortMethod('newest'))
			setNewModuleId(data.payload.value[0].draftId)
		})
	}

	const loadStats = (event, draftId, index) => {
		console.log("@TODO Don't do this here!")

		Promise.all(
			selectedDrafts.map(id => {
				return fetch(`/api/assessments/${id}/analytics`).then(res => res.json())
			})
		).then(results => {
			console.log('results', results)
			setStats(results.flatMap(result => getAttemptSummariesFromResData(result.value)))
		})
	}

	// Set a cookie when sortOrder changes on the client
	// can't undefine document to test this 'else' case without breaking everything - maybe later
	/* istanbul ignore else */
	if (typeof document !== 'undefined') {
		useEffect(() => {
			const expires = new Date()
			expires.setFullYear(expires.getFullYear() + 1)
			document.cookie = `sortOrder=${sortOrder}; expires=${expires.toUTCString()}; path=/stats`
		}, [sortOrder])
	}

	useEffect(() => {
		document.addEventListener('keyup', onKeyUp)
		return () => {
			document.removeEventListener('keyup', onKeyUp)
		}
	}, [onKeyUp])

	return (
		<span id="stats-root">
			<RepositoryNav
				userId={props.currentUser.id}
				userPerms={props.currentUser.perms}
				avatarUrl={props.currentUser.avatarUrl}
				displayName={`${props.currentUser.firstName} ${props.currentUser.lastName}`}
				noticeCount={0}
			/>
			<RepositoryBanner title={props.title} className="default-bg" facts={props.facts} />
			<div className="repository--section-wrapper">
				<section className="repository--main-content">
					<DataGridDrafts rows={props.allModules} onSelectedDraftsChanged={setSelectedDrafts} />
					<Button
						disabled={selectedDrafts.length === 0}
						onClick={loadStats}
					>{`Load stats for ${selectedDrafts.length} selected modules`}</Button>
					<AssessmentStats attempts={stats} />
				</section>
			</div>
			{props.dialog ? renderModalDialog(props) : null}
		</span>
	)
}

module.exports = Stats
