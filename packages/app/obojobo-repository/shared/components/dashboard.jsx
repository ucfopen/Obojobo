require('./modal.scss')
require('./dashboard.scss')

const React = require('react')
const { useState, useEffect } = require('react')
const RepositoryNav = require('./repository-nav')
const RepositoryBanner = require('./repository-banner')
const Module = require('./module')
const ModulePermissionsDialog = require('./module-permissions-dialog')
const ModuleOptionsDialog = require('./module-options-dialog')
const VersionHistoryDialog = require('./version-history-dialog')
const Button = require('./button')
const MultiButton = require('./multi-button')
const Search = require('./search')
const ReactModal = require('react-modal')

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

	ReactModal.setAppElement('#dashboard-root')

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

function Dashboard(props) {
	const [sortOrder, setSortOrder] = useState(props.sortOrder)
	const [newModuleId, setNewModuleId] = useState(null)

	const moduleList = props.filteredModules ? props.filteredModules : props.myModules
	const [selectStates, setSelectStates] = useState(moduleList.map(() => false))

	const handleCreateNewModule = useTutorial => {
		props.createNewModule(useTutorial).then(data => {
			data.payload.value.sort(getSortMethod('newest'))
			setNewModuleId(data.payload.value[0].draftId)
		})
	}

	const handleSelectModule = (draft, index) => {
		selectStates[index] = !selectStates[index]
		setSelectStates([...selectStates])

		selectStates[index] ? props.selectModule(draft) : props.deselectModule(draft)
	}

	// Set a cookie when sortOrder changes on the client
	// can't undefine document to test this 'else' case without breaking everything - maybe later
	/* istanbul ignore else */
	if (typeof document !== 'undefined') {
		useEffect(() => {
			const expires = new Date()
			expires.setFullYear(expires.getFullYear() + 1)
			document.cookie = `sortOrder=${sortOrder}; expires=${expires.toUTCString()}; path=/dashboard`
		}, [sortOrder])
	}

	// idea: SELECT_MODULES/DESELECT_MODULES in redux
	//       takes array instead of single module

	return (
		<span id="dashboard-root">
			<RepositoryNav
				userId={props.currentUser.id}
				avatarUrl={props.currentUser.avatarUrl}
				displayName={`${props.currentUser.firstName} ${props.currentUser.lastName}`}
				noticeCount={0} />
			<RepositoryBanner title={props.title} className="default-bg" facts={props.facts} />
			<div className="repository--section-wrapper">
				<section className="repository--main-content">
					{props.multiSelectMode ? 
						<div className="repository--main-content--control-bar is-multi-select-mode">
							<span className="stuff">{getModuleCount(props.selectedModules)}</span>
							<div>
								<Button className="multi-select secondary-button">Share...</Button>
							</div>
							<div>
								<Button className="multi-select secondary-button">Download XML</Button>
								<Button className="multi-select secondary-button">Download JSON</Button>
							</div>
							<Button className="multi-select secondary-button dangerous-button">Delete All</Button>
							<Button className="close-button">×</Button>
						</div> :
						<div className="repository--main-content--control-bar is-not-multi-select-mode">
							<MultiButton title="New Module">
								<Button onClick={() => handleCreateNewModule(false)}>New Module</Button>
								<Button onClick={() => handleCreateNewModule(true)}>New Tutorial</Button>
								<Button onClick={props.importModuleFile}>Upload...</Button>
							</MultiButton>
							<Search
								value={props.moduleSearchString}
								placeholder="Filter..."
								onChange={props.filterModules} />
						</div>
					}
					<div className="repository--main-content--title">
						<span>My Modules</span>
						<div className="repository--main-content--sort">
							<span>Sort</span>
							<select value={sortOrder} onChange={event => setSortOrder(event.target.value)}>
								<option value="newest">Newest</option>
								<option value="alphabetical">Alphabetical</option>
								<option value="last updated">Last updated</option>
							</select>
						</div>
					</div>
					<div className="repository--item-list--collection">
						<div className="repository--item-list--collection--item-wrapper">
							<div className="repository--item-list--row">
								<div className="repository--item-list--collection--item--multi-wrapper">
									{moduleList
										.sort(getSortMethod(sortOrder))
										.map((draft, index) => (
											<Module
												isNew={draft.draftId === newModuleId}
												isSelected={selectStates[index]}
												isMultiSelectMode={props.multiSelectMode}
												onSelect={() => handleSelectModule(draft, index)}
												key={draft.draftId}
												hasMenu={true}
												{...draft} />
										))}
								</div>
							</div>
						</div>
					</div>
				</section>
			</div>
			{props.dialog ? renderModalDialog(props) : null}
		</span>
	)
}

module.exports = Dashboard
