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
const AssessmentScoreDataDialog = require('./assessment-score-data-dialog')
const Spinner = require('./spinner')
const Collection = require('./collection')
const ModuleManageCollectionsDialog = require('./module-manage-collections-dialog')
const CollectionBulkAddModulesDialog = require('./collection-bulk-add-modules-dialog')
const CollectionManageModulesDialog = require('./collection-manage-modules-dialog')
const CollectionRenameDialog = require('./collection-rename-dialog')
const ButtonLink = require('./button-link')
const { FULL, PARTIAL, MINIMAL } = require('obojobo-express/server/constants')

const short = require('short-uuid')

const { MODE_RECENT, MODE_ALL, MODE_COLLECTION, MODE_DELETED } = require('../repository-constants')

const renderOptionsDialog = (props, extension) => (
	<ModuleOptionsDialog
		title=""
		{...props.selectedModule}
		showModulePermissions={props.showModulePermissions}
		deleteModule={extension.deleteModule}
		onClose={props.closeModal}
		showVersionHistory={props.showVersionHistory}
		showAssessmentScoreData={props.showAssessmentScoreData}
		startLoadingAnimation={props.startLoadingAnimation}
		stopLoadingAnimation={props.stopLoadingAnimation}
		showModuleManageCollections={props.showModuleManageCollections}
	/>
)

const renderPermissionsDialog = (props, extension) => (
	<ModulePermissionsDialog
		title=""
		{...props.selectedModule}
		searchState={props.searchPeople}
		loadUsersForModule={props.loadUsersForModule}
		onClose={props.closeModal}
		addUserToModule={props.addUserToModule}
		changeAccessLevel={props.changeAccessLevel}
		draftPermissions={props.draftPermissions}
		deleteModulePermissions={extension.deleteModulePermissions}
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

const renderAssessmentScoreDataDialog = props => {
	return (
		<AssessmentScoreDataDialog
			{...props.selectedModule}
			title={`${props.selectedModule.title} - Assessment Scores`}
			onClose={props.closeModal}
			isAttemptsLoading={props.attempts.isFetching}
			attempts={props.attempts.items}
		/>
	)
}

const renderModalDialog = props => {
	let dialog
	let title

	const extendedOptions = {
		mode: props.mode
	}
	const extendedProps = extendedPropsDefault(props)
	switch (props.mode) {
		case MODE_COLLECTION:
			extendedOptions.collectionId = props.collection.id
			extendedProps.renameCollection = (collectionId, newTitle) => {
				props.renameCollection(collectionId, newTitle, extendedOptions)
			}
			extendedProps.collectionAddModule = (draftId, collectionId) => {
				props.collectionAddModule(draftId, collectionId, extendedOptions)
			}
			extendedProps.collectionRemoveModule = (draftId, collectionId) => {
				props.collectionRemoveModule(draftId, collectionId, extendedOptions)
			}
			extendedProps.moduleAddToCollection = (draftId, collectionId) => {
				props
					.moduleAddToCollection(draftId, collectionId)
					.then(() => props.loadCollectionModules(collectionId, extendedOptions))
			}
			extendedProps.moduleRemoveFromCollection = (draftId, collectionId) => {
				props
					.moduleRemoveFromCollection(draftId, collectionId)
					.then(() => props.loadCollectionModules(collectionId, extendedOptions))
			}
			extendedProps.deleteModule = draftId => props.deleteModule(draftId, extendedOptions)
			extendedProps.deleteModulePermissions = (draftId, userId) => {
				props.deleteModulePermissions(draftId, userId, extendedOptions)
			}
			break

		default:
			extendedProps.deleteModule = draftId => props.deleteModule(draftId, extendedOptions)
			extendedProps.deleteModulePermissions = (draftId, userId) => {
				props.deleteModulePermissions(draftId, userId, extendedOptions)
			}
	}

	switch (props.dialog) {
		case 'module-more':
			title = 'Module Options'
			dialog = renderOptionsDialog(props, extendedProps)
			break

		case 'module-permissions':
			title = 'Module Access'
			dialog = renderPermissionsDialog(props, extendedProps)
			break

		case 'module-version-history':
			title = 'Module Version History'
			dialog = renderVersionHistoryDialog(props)
			break

		case 'module-assessment-score-data':
			title = 'Module Assessment Score Data'
			dialog = renderAssessmentScoreDataDialog(props)
			break

		case 'module-manage-collections':
			title = 'Module Collections'
			dialog = renderModuleManageCollectionsDialog(props, extendedProps)
			break

		case 'collection-manage-modules':
			title = ''
			dialog = renderCollectionManageModulesDialog(props, extendedProps)
			break

		case 'collection-bulk-add-modules':
			title = ''
			dialog = renderCollectionBulkAddModulesDialog(props)
			break

		case 'collection-rename':
			title = 'Rename Collection'
			dialog = renderCollectionRenameDialog(props, extendedProps)
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

const renderModuleManageCollectionsDialog = (props, extension) => (
	<ModuleManageCollectionsDialog
		title=""
		{...props.selectedModule}
		collections={props.myCollections}
		onClose={props.closeModal}
		loadModuleCollections={props.loadModuleCollections}
		draftCollections={props.draftCollections}
		moduleAddToCollection={extension.moduleAddToCollection}
		moduleRemoveFromCollection={extension.moduleRemoveFromCollection}
	/>
)

const renderCollectionBulkAddModulesDialog = props => (
	<CollectionBulkAddModulesDialog
		title=""
		collections={props.myCollections}
		selectedModules={props.selectedModules}
		bulkAddModulesToCollection={props.bulkAddModulesToCollection}
		onClose={props.closeModal}
	/>
)

const renderCollectionManageModulesDialog = (props, extension) => (
	<CollectionManageModulesDialog
		title=""
		collection={props.selectedCollection}
		loadCollectionModules={props.loadCollectionModules}
		collectionModules={props.collectionModules}
		collectionAddModule={extension.collectionAddModule}
		collectionRemoveModule={extension.collectionRemoveModule}
		onClose={props.closeModal}
	/>
)

const renderCollectionRenameDialog = (props, extension) => (
	<CollectionRenameDialog
		title="Rename Collection"
		collection={props.selectedCollection}
		onClose={props.closeModal}
		onAccept={extension.renameCollection}
	/>
)

const renderCollections = (collections, sortOrder, newCollectionButton) => {
	if (collections.length < 1) {
		return (
			<p className="repository--item-list--collection--empty-placeholder">
				<span className="repository--item-list--collection--empty-placeholder--text">
					Nothing to see here!
				</span>
				{newCollectionButton}
			</p>
		)
	}

	const sortFn = getSortMethod(sortOrder)
	return collections
		.sort(sortFn)
		.map(collection => <Collection key={collection.id} hasMenu={true} {...collection} />)
}

const renderCollectionManageArea = props => {
	const onManageButtonClick = () => props.showCollectionManageModules(props.collection)

	const onRenameButtonClick = () => props.showCollectionRename(props.collection)

	const onDeleteButtonClick = () => {
		//eslint-disable-next-line no-alert, no-undef
		const response = confirm(
			`Delete collection "${props.collection.title}"? Modules in this collection will not be deleted.`
		)
		if (!response) return
		props.deleteCollection(props.collection).then(() => {
			window.location.assign('/dashboard')
		})
	}

	return (
		<React.Fragment>
			<Button onClick={onManageButtonClick} className="manage-modules">
				Manage Modules
			</Button>
			<Button onClick={onRenameButtonClick} className="rename">
				Rename
			</Button>
			<Button onClick={onDeleteButtonClick} className="dangerous-button">
				Delete Collection
			</Button>
		</React.Fragment>
	)
}

const extendedPropsDefault = props => ({
	renameCollection: props.renameCollection,
	collectionAddModule: props.collectionAddModule,
	collectionRemoveModule: props.collectionRemoveModule,
	moduleAddToCollection: props.moduleAddToCollection,
	moduleRemoveFromCollection: props.moduleRemoveFromCollection,
	deleteModule: props.deleteModule,
	deleteModulePermissions: props.deleteModulePermissions
})

const getModuleCount = (numFull, numPartial, numMinimal) => {
	let string = ''

	if (numFull + numPartial + numMinimal === 1) {
		string += '1 Module Selected'
	} else {
		string += `${numFull + numPartial + numMinimal} Modules Selected`
	}

	string += ` (${numFull} Full, ${numPartial} Partial, ${numMinimal} Minimal):`

	return string
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
	const [moduleSortOrder, setModuleSortOrder] = useState(props.moduleSortOrder)
	const [collectionSortOrder, setCollectionSortOrder] = useState(props.collectionSortOrder)
	const [newModuleId, setNewModuleId] = useState(null)
	const [lastPreselectedIndex, setLastPreselectedIndex] = useState(null)
	const [lastSelectedIndex, setLastSelectedIndex] = useState(0)
	const [isLoading, setIsLoading] = useState(false)

	// Keep track of access levels of selected modules
	const [numFullSelected, setNumFullSelected] = useState(props.numFullSelected || 0)
	const [numPartialSelected, setNumPartialSelected] = useState(props.numPartialSelected || 0)
	const [numMinimalSelected, setNumMinimalSelected] = useState(props.numMinimalSelected || 0)

	const moduleList = props.filteredModules ? props.filteredModules : props.myModules

	const onKeyUp = e => {
		if (e.key === 'Escape' && props.multiSelectMode && props.deselectModules) {
			setLastPreselectedIndex(null)
			props.deselectModules(props.selectedModules)
		}
	}

	const modalProps = Object.assign({}, props)
	modalProps.startLoadingAnimation = () => setIsLoading(true)
	modalProps.stopLoadingAnimation = () => setIsLoading(false)

	const handleSelectModule = (event, draftId, index) => {
		let originIndex = lastSelectedIndex
		let isDeselecting

		if (event.shiftKey && lastSelectedIndex !== index) {
			// No module is 'selected' yet - set the shift-click 'origin' from the last one that was clicked
			if (!props.selectedModules.length) {
				// If shift-clicking a module without having first clicked another module, only select the one that was clicked
				originIndex = lastPreselectedIndex !== null ? lastPreselectedIndex : index
			}

			// Accommodates for group selecting backwards in the list and prevents duplicate selections
			const [startIdx, endIdx] =
				originIndex < index ? [originIndex, index + 1] : [index, originIndex + 1]

			// Get newly selected modules
			const currentSelection = moduleList.slice(startIdx, endIdx)
			const newlySelected = currentSelection.filter(
				currentModule =>
					!props.selectedModules.some(oldModule => oldModule.draftId === currentModule.draftId)
			)

			const updated = newlySelected.map(module => ({ module: module, action: 'select' }))
			updateAccessLevelCounts(updated)

			props.selectModules(newlySelected)
		} else {
			const selectedModule = moduleList.filter(draft => draft.draftId === draftId)[0]

			if (props.selectedModules.some(module => module.draftId === draftId)) {
				props.deselectModules([selectedModule])

				isDeselecting = true
			} else {
				props.selectModules([selectedModule])

				isDeselecting = false
			}

			updateAccessLevelCounts([
				{ module: selectedModule, action: isDeselecting ? 'deselect' : 'select' }
			])
		}

		setLastSelectedIndex(index)
	}

	const updateAccessLevelCounts = selection => {
		// Create and update non-state variables to avoid asynchronous state updates
		let totalFull = numFullSelected
		let totalPartial = numPartialSelected
		let totalMinimal = numMinimalSelected

		selection.forEach(({ module, action }) => {
			switch (module.accessLevel) {
				case FULL:
					action === 'select' ? (totalFull += 1) : (totalFull -= 1)
					break
				case PARTIAL:
					action === 'select' ? (totalPartial += 1) : (totalPartial -= 1)
					break
				case MINIMAL:
					action === 'select' ? (totalMinimal += 1) : (totalMinimal -= 1)
					break
			}
		})

		setNumFullSelected(totalFull)
		setNumPartialSelected(totalPartial)
		setNumMinimalSelected(totalMinimal)
	}

	const clearSelection = () => {
		setNumFullSelected(0)
		setNumMinimalSelected(0)
		setNumPartialSelected(0)

		props.deselectModules(props.selectedModules)
	}

	const renderModules = (modules, sortOrder, newModuleId, newModuleButton) => {
		if (modules.length < 1) {
			return (
				<p className="repository--item-list--collection--empty-placeholder">
					<span className="repository--item-list--collection--empty-placeholder--text">
						Nothing to see here!
					</span>
					{props.mode !== MODE_DELETED && newModuleButton}
				</p>
			)
		}

		const sortFn = getSortMethod(sortOrder)
		return modules.sort(sortFn).map((draft, index) => (
			<div
				className="repository--item-list--collection--module-container"
				key={draft.draftId}
				onClick={() => setLastPreselectedIndex(index)}
			>
				<Module
					isNew={draft.draftId === newModuleId}
					isSelected={props.selectedModules.some(module => module.draftId === draft.draftId)}
					isMultiSelectMode={props.multiSelectMode}
					onSelect={e => handleSelectModule(e, draft.draftId, index)}
					hasMenu={true}
					isDeleted={props.mode === MODE_DELETED}
					{...draft}
				/>
			</div>
		))
	}

	const removeModulesFromCollection = drafts => {
		setIsLoading(true)
		// eslint-disable-next-line no-alert, no-undef
		const response = prompt(
			`Are you sure you want to remove these ${drafts.length} selected modules from this collection? Type 'REMOVE' to confirm.`
		)
		if (response !== 'REMOVE') return setIsLoading(false)
		const draftIds = drafts.map(draft => draft.draftId)
		props
			.bulkRemoveModulesFromCollection(draftIds, props.collection.id)
			.then(() => setIsLoading(false))
		clearSelection()
	}

	const deleteModules = drafts => {
		setIsLoading(true)
		// eslint-disable-next-line no-alert, no-undef
		const response = prompt(
			`Are you sure you want to DELETE these ${drafts.length} selected modules? Type 'DELETE' to confirm.`
		)
		if (response !== 'DELETE') return setIsLoading(false)
		const draftIds = drafts.map(draft => draft.draftId)

		props.bulkDeleteModules(draftIds).then(() => setIsLoading(false))

		clearSelection()
	}

	const restoreModules = drafts => {
		const draftIds = drafts.map(draft => draft.draftId)

		setIsLoading(true)
		props.bulkRestoreModules(draftIds).then(() => {
			setIsLoading(false)
			// eslint-disable-next-line no-alert
			window.alert('The selected modules were successfully restored.')
		})
		clearSelection()
	}

	// Set a cookie when moduleSortOrder changes on the client
	// can't undefine document to test this 'else' case without breaking everything - maybe later
	/* istanbul ignore else */
	if (typeof document !== 'undefined') {
		useEffect(() => {
			const expires = new Date()
			expires.setFullYear(expires.getFullYear() + 1)
			let modeUrlString = '/dashboard'

			// Placeholder variable - will be set to an instance of shortUUID if needed
			let translator = null

			switch (props.mode) {
				case MODE_COLLECTION:
					translator = short()
					modeUrlString =
						'/collections/' +
						encodeURI(props.collection.title.replace(/\s+/g, '-').toLowerCase()) +
						'-' +
						translator.fromUUID(props.collection.id)
					break
				case MODE_RECENT:
					// Default view is 'only show the five most recent changes', do nothing with the path
					break
				case MODE_DELETED:
					modeUrlString = `${modeUrlString}/deleted`
					break
				case MODE_ALL:
				default:
					modeUrlString = `${modeUrlString}/all`
					break
			}

			const commonCookieString = `expires=${expires.toUTCString()}; path=${modeUrlString}`
			document.cookie = `moduleSortOrder=${moduleSortOrder}; ${commonCookieString}`
			document.cookie = `collectionSortOrder=${collectionSortOrder}; ${commonCookieString}`
		}, [moduleSortOrder, collectionSortOrder])
	}

	useEffect(() => {
		// Reset last selected index when leaving multi-select mode
		if (!props.multiSelectMode) setLastSelectedIndex(0)
	}, [props.multiSelectMode])

	useEffect(() => {
		document.addEventListener('keyup', onKeyUp)
		return () => {
			document.removeEventListener('keyup', onKeyUp)
		}
	}, [onKeyUp])

	const newCollectionButtonRender = (
		<Button onClick={props.createNewCollection}>New Collection</Button>
	)

	// Elements to render in the 'My Collections' part of the page
	// Will only appear when dashboard is in 'recent' mode
	let collectionAreaRender = null

	// Text content of the dashboard module section's title
	// Either 'My Recent Modules' (recent), 'My Modules' (all), or 'Modules In <collection title' (collection)
	let modulesTitle = 'My Recent Modules'

	// Extra class to apply to module section's title
	// Will be 'stretch-width' when module sort component is not present
	//  or an empty string when it is
	let modulesTitleExtraClass = ''

	// Components to render for module sort options
	// Will not be necessary when dashboard is in 'recent' mode
	let moduleSortRender = (
		<div className="repository--main-content--sort repository--module-sort">
			<span>Sort</span>
			<select value={moduleSortOrder} onChange={event => setModuleSortOrder(event.target.value)}>
				<option value="newest">Newest</option>
				<option value="alphabetical">Alphabetical</option>
				<option value="last updated">Last updated</option>
			</select>
		</div>
	)

	// Components to render for module filter input
	// Will not be necessary when dashboard is in 'recent' mode
	let moduleFilterRender = (
		<Search
			value={props.moduleSearchString}
			placeholder="Filter Modules..."
			onChange={props.filterModules}
		/>
	)

	// Components to render an 'All Modules' button (default mode)
	// Will not be necessary when dashboard is in 'all' or 'collection' modes
	let allModulesButtonRender = null

	// 'New Collection' button and horizontal divider
	// Will only appear when dashboard is in 'recent' mode
	let newCollectionOptionsRender = null

	const createNewModuleOptions = {
		mode: props.mode
	}

	// Components for managing the current collection
	// Will only appear when dashboard is in 'collection' mode
	let collectionManageAreaRender = null

	// reusable function to build a 'collections' list below the module list in 'all' and 'recent' modes
	const renderCollectionArea = () => {
		newCollectionOptionsRender = (
			<React.Fragment>
				{newCollectionButtonRender}
				<hr />
			</React.Fragment>
		)

		let collectionFilterRender = null

		if (props.myCollections.length > 0) {
			collectionFilterRender = (
				<Search
					value={props.collectionSearchString}
					placeholder="Filter Collections..."
					onChange={props.filterCollections}
				/>
			)
		}

		collectionAreaRender = (
			<React.Fragment>
				<div className="repository--main-content--title repository--my-collections-title">
					<span>My Collections</span>
					<div className="repository--main-content--sort repository--collection-sort">
						<span>Sort</span>
						<select
							value={collectionSortOrder}
							onChange={event => setCollectionSortOrder(event.target.value)}
						>
							<option value="newest">Newest</option>
							<option value="alphabetical">Alphabetical</option>
						</select>
					</div>
				</div>
				{collectionFilterRender}
				<div className="repository--item-list--collection">
					<div className="repository--item-list--collection--item-wrapper">
						<div className="repository--item-list--row">
							<div className="repository--item-list--collection--item--multi-wrapper">
								{renderCollections(
									props.filteredCollections ? props.filteredCollections : props.myCollections,
									collectionSortOrder,
									newCollectionButtonRender
								)}
							</div>
						</div>
					</div>
				</div>
			</React.Fragment>
		)
	}

	switch (props.mode) {
		// url is /collections/collection-name-and-short-uuid
		case MODE_COLLECTION:
			collectionManageAreaRender = renderCollectionManageArea(props)
			createNewModuleOptions.collectionId = props.collection.id
			modulesTitle = `Modules in '${props.collection.title}'`
			break
		// url is /dashboard/all
		case MODE_ALL:
			renderCollectionArea()
			modulesTitle = 'My Modules'
			break
		// url is /dashboard/deleted
		case MODE_DELETED:
			modulesTitle = 'My Deleted Modules'
			break
		// url is /dashboard
		case MODE_RECENT:
		default:
			if (props.myModules.length < props.moduleCount) {
				allModulesButtonRender = (
					<ButtonLink
						className="repository--all-modules--button"
						url="/dashboard/all"
						target="_blank"
					>
						All Modules
					</ButtonLink>
				)
			}

			renderCollectionArea()

			moduleFilterRender = null
			moduleSortRender = null
			modulesTitleExtraClass = 'stretch-width'
	}

	const onNewModuleClick = useTutorial => {
		setIsLoading(true)

		props.createNewModule(useTutorial, createNewModuleOptions).then(data => {
			setIsLoading(false)
			data.payload.value.modules.sort(getSortMethod('newest'))
			setNewModuleId(data.payload.value.modules[0].draftId)
		})
	}

	const newModuleButtonRender = <Button onClick={() => onNewModuleClick(false)}>New Module</Button>

	const deletedModulesButtonLinkRender =
		props.mode === MODE_ALL ? (
			<ButtonLink className="dashboard-menu-button" url="/dashboard/deleted">
				<div className="trash-can-icon"></div>
				<span>Deleted Modules</span>
			</ButtonLink>
		) : null

	let mainControlBarRender = (
		<div className="repository--main-content--control-bar is-not-multi-select-mode">
			{props.mode === MODE_DELETED ? (
				<ButtonLink className="dashboard-menu-button go-back-container" url="/dashboard/all">
					<div className="go-back-icon">
						<svg viewBox="0 0 134 150" version="1.1" xmlns="http://www.w3.org/2000/svg">
							<path d="M 25,50 97.5,5 97.5,95 Z" />
						</svg>
					</div>
					<span>Return to All Modules</span>
				</ButtonLink>
			) : (
				<MultiButton title="New...">
					{newCollectionOptionsRender}
					{newModuleButtonRender}
					<Button onClick={() => onNewModuleClick(true)}>New Tutorial</Button>
					<Button onClick={props.importModuleFile}>Upload...</Button>
				</MultiButton>
			)}
			{deletedModulesButtonLinkRender}
			{collectionManageAreaRender}
			{moduleFilterRender}
		</div>
	)
	if (props.multiSelectMode && props.selectedModules.length > 0) {
		let bulkCollectionActionButton = null
		let bulkActionButton = (
			<Button
				className="multi-select secondary-button dangerous-button"
				onClick={() => deleteModules(props.selectedModules)}
				disabled={numMinimalSelected > 0 || numPartialSelected > 0}
			>
				Delete All
			</Button>
		)
		switch (props.mode) {
			case MODE_COLLECTION:
				bulkCollectionActionButton = (
					<Button
						className="multi-select secondary-button"
						onClick={() => removeModulesFromCollection(props.selectedModules)}
					>
						Remove All From Collection
					</Button>
				)
				break
			case MODE_DELETED:
				bulkActionButton = (
					<Button
						className="multi-select secondary-button dangerous-button"
						onClick={() => restoreModules(props.selectedModules)}
					>
						Restore All
					</Button>
				)
				break
			case MODE_ALL:
			case MODE_RECENT:
			default:
				bulkCollectionActionButton = (
					<Button
						className="multi-select secondary-button"
						onClick={() => props.showCollectionBulkAddModulesDialog(props.selectedModules)}
					>
						Add All To Collection
					</Button>
				)
				break
		}

		mainControlBarRender = (
			<div className="repository--main-content--control-bar is-multi-select-mode">
				<span className="module-count">
					{getModuleCount(numFullSelected, numPartialSelected, numMinimalSelected)}
				</span>
				{bulkCollectionActionButton}
				{bulkActionButton}
				<Button className="close-button" onClick={clearSelection}>
					×
				</Button>
			</div>
		)
	}

	useEffect(() => {
		// Reset last selected index when leaving multi-select mode
		if (!props.multiSelectMode) setLastSelectedIndex(0)
	}, [props.multiSelectMode])

	useEffect(() => {
		document.addEventListener('keyup', onKeyUp)
		return () => {
			document.removeEventListener('keyup', onKeyUp)
		}
	}, [onKeyUp])

	let itemCollectionMultiWrapperClassName =
		'repository--item-list--collection--item--multi-wrapper '
	itemCollectionMultiWrapperClassName += isLoading ? 'fade' : ''

	return (
		<span id="dashboard-root">
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
					{mainControlBarRender}
					<div
						className={`repository--main-content--title repository--my-modules-title ${modulesTitleExtraClass}`}
					>
						<span>{modulesTitle}</span>
						{moduleSortRender}
					</div>
					<div className="repository--item-list--collection">
						<div className="repository--item-list--collection--item-wrapper">
							<div className="repository--item-list--row">
								{isLoading && <Spinner color="#6714bd" />}
								<div className={itemCollectionMultiWrapperClassName}>
									{renderModules(
										props.filteredModules ? props.filteredModules : props.myModules,
										moduleSortOrder,
										newModuleId,
										newModuleButtonRender
									)}
									{allModulesButtonRender}
								</div>
							</div>
						</div>
					</div>
					{collectionAreaRender}
				</section>
			</div>
			{props.dialog ? renderModalDialog(modalProps) : null}
		</span>
	)
}

module.exports = Dashboard
