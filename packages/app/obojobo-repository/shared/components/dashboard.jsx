require('./modal.scss')
require('./dashboard.scss')

const React = require('react')
const { useState, useEffect } = require('react')
const RepositoryNav = require('./repository-nav')
const RepositoryBanner = require('./repository-banner')
const Collection = require('./collection')
const CollectionManageModulesDialog = require('./collection-manage-modules')
const CollectionRenameDialog = require('./collection-rename-dialog')
const Module = require('./module')
const ModuleManageCollectionsDialog = require('./module-manage-collections-dialog')
const ModulePermissionsDialog = require('./module-permissions-dialog')
const ModuleOptionsDialog = require('./module-options-dialog')
const Button = require('./button')
const ButtonLink = require('./button-link')
const MultiButton = require('./multi-button')
const Search = require('./search')
const ReactModal = require('react-modal')

const { MODE_RECENT, MODE_ALL } = require('../repository-constants')

const renderOptionsDialog = (props, extension) => (
	<ModuleOptionsDialog
		title=""
		{...props.selectedModule}
		showModuleManageCollections={props.showModuleManageCollections}
		showModulePermissions={props.showModulePermissions}
		deleteModule={extension.deleteModule}
		onClose={props.closeModal}
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
		draftPermissions={props.draftPermissions}
		deleteModulePermissions={extension.deleteModulePermissions}
		currentUserId={props.currentUser.id}
	/>
)

const renderModuleManageCollectionsDialog = props => (
	<ModuleManageCollectionsDialog
		title=""
		{...props.selectedModule}
		collections={props.myCollections}
		onClose={props.closeModal}
		loadModuleCollections={props.loadModuleCollections}
		draftCollections={props.draftCollections}
		moduleAddToCollection={props.moduleAddToCollection}
		moduleRemoveFromCollection={props.moduleRemoveFromCollection}
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

const extendedPropsDefault = props => ({
	renameCollection: props.renameCollection,
	collectionAddModule: props.collectionAddModule,
	collectionRemoveModule: props.collectionRemoveModule,
	deleteModule: props.deleteModule,
	deleteModulePermissions: props.deleteModulePermissions
})

const renderModalDialog = props => {
	let dialog
	let title
	const extendedOptions = {
		mode: props.mode
	}
	const extendedProps = extendedPropsDefault(props)
	switch (props.mode) {
		// case MODE_COLLECTION:
		// 	extendedOptions.collectionId = props.collection.id
		// 	extendedProps.renameCollection = (collectionId, newTitle) => {
		// 		props.renameCollection(collectionId, newTitle, extendedOptions)
		// 	}
		// 	extendedProps.collectionAddModule = (draftId, collectionId) => {
		// 		props.collectionAddModule(draftId, collectionId, extendedOptions)
		// 	}
		// 	extendedProps.collectionRemoveModule = (draftId, collectionId) => {
		// 		props.collectionRemoveModule(draftId, collectionId, extendedOptions)
		// 	}
		// 	extendedProps.deleteModule = draftId => {
		// 		props.deleteModule(draftId, extendedOptions)
		// 	}
		// 	extendedProps.deleteModulePermissions = (draftId, userId) => {
		// 		props.deleteModulePermissions(draftId, userId, extendedOptions)
		// 	}

		// 	break
		case MODE_RECENT:
		default:
			extendedProps.deleteModule = draftId => {
				props.deleteModule(draftId, extendedOptions)
			}
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

		case 'module-manage-collections':
			title = 'Module Collections'
			dialog = renderModuleManageCollectionsDialog(props)
			break

		case 'collection-manage-modules':
			title = ''
			dialog = renderCollectionManageModulesDialog(props, extendedProps)
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

const renderModules = (modules, sortOrder, newModuleButton) => {
	if (modules.length < 1) {
		return (
			<p className="repository--item-list--collection--empty-placeholder">
				<span className="repository--item-list--collection--empty-placeholder--text">
					Nothing to see here!
				</span>
				{newModuleButton}
			</p>
		)
	}

	const sortFn = getSortMethod(sortOrder)
	return modules.sort(sortFn).map(draft => <Module key={draft.draftId} hasMenu={true} {...draft} />)
}

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

const Dashboard = props => {
	const [moduleSortOrder, setModuleSortOrder] = useState(props.moduleSortOrder)
	const [collectionSortOrder, setCollectionSortOrder] = useState(props.collectionSortOrder)

	// Set a cookie when moduleSortOrder or collectionSortOrder change on the client
	if (typeof document !== 'undefined') {
		useEffect(() => {
			const expires = new Date()
			expires.setFullYear(expires.getFullYear() + 1)
			const modeUrlString = props.mode === MODE_ALL ? '/all' : ''
			const commonCookieString = `expires=${expires.toUTCString()}; path=/dashboard${modeUrlString}`
			document.cookie = `moduleSortOrder=${moduleSortOrder}; ${commonCookieString}`
			document.cookie = `collectionSortOrder=${collectionSortOrder}; ${commonCookieString}`
		}, [moduleSortOrder, collectionSortOrder])
	}

	const onNewModuleClick = useTutorial => {
		props.createNewModule(useTutorial, { mode: props.mode })
	}

	const newCollectionButtonRender = (
		<Button onClick={() => props.createNewCollection()}>New Collection</Button>
	)
	const newModuleButtonRender = <Button onClick={() => onNewModuleClick(false)}>New Module</Button>

	// Elements to render in the 'My Collections' part of the page
	// Will not appear when dashboard is in 'all' mode
	let collectionAreaRender = (
		<React.Fragment>
			<div className="repository--main-content--title">
				<span>My Collections</span>
				<div className="repository--main-content--sort">
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

	// Text content of the dashboard module section's title
	// Either 'My Recent Modules' (recent) or 'My Modules' (all)
	let modulesTitle = 'My Recent Modules'

	// Extra class to apply to module section's title
	// Will be 'stretch-width' when module sort component is not present
	//  or an empty string when it is
	let modulesTitleExtraClass = ''

	// Components to render for module sort options
	// Will not be necessary when dashboard is in 'recent' mode
	let moduleSortRender = (
		<div className="repository--main-content--sort">
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
			placeholder="Filter..."
			onChange={props.filterModules}
		/>
	)

	// Components to render an 'All Modules' button (default/collection mode)
	// Will not be necessary when dashboard is in 'module' mode
	let moduleModeRender = (
		<ButtonLink className="repository--all-modules--button" url="/dashboard/all" target="_blank">
			All Modules
		</ButtonLink>
	)

	if (props.myModules.length === props.moduleCount) {
		moduleModeRender = null
	}

	let newCollectionOptionsRender = (
		<React.Fragment>
			{newCollectionButtonRender}
			<hr />
		</React.Fragment>
	)

	switch (props.mode) {
		// url is /dashboard/collections/collection-name-and-short-uuid
		// case MODE_COLLECTION:
		// 	createNewModuleOptions.collectionId = props.collection.id
		// 	modulesTitle = `Modules in '${props.collection.title}'`
		// 	break
		// url is /dashboard/modules
		case MODE_ALL:
			collectionAreaRender = null
			newCollectionOptionsRender = null
			modulesTitle = 'My Modules'
			moduleModeRender = null
			break
		// url is /dashboard
		case MODE_RECENT:
		default:
			moduleFilterRender = null
			moduleSortRender = null
			modulesTitleExtraClass = 'stretch-width'
	}

	return (
		<span id="dashboard-root">
			<RepositoryNav
				userId={props.currentUser.id}
				avatarUrl={props.currentUser.avatarUrl}
				displayName={`${props.currentUser.firstName} ${props.currentUser.lastName}`}
				noticeCount={0}
			/>
			<RepositoryBanner title={props.title} className="default-bg" facts={props.facts} />
			<div className="repository--section-wrapper">
				<section className="repository--main-content">
					<div className="repository--main-content--control-bar">
						<MultiButton title="Create New" className="repository--main-content--new-module-button">
							{newCollectionOptionsRender}
							{newModuleButtonRender}
							<Button onClick={() => onNewModuleClick(true)}>New Tutorial</Button>
						</MultiButton>
						{moduleFilterRender}
					</div>

					{collectionAreaRender}

					<div className={`repository--main-content--title ${modulesTitleExtraClass}`}>
						<span>{modulesTitle}</span>
						{moduleSortRender}
					</div>
					<div className="repository--item-list--collection">
						<div className="repository--item-list--collection--item-wrapper">
							<div className="repository--item-list--row">
								<div className="repository--item-list--collection--item--multi-wrapper">
									{renderModules(
										props.filteredModules ? props.filteredModules : props.myModules,
										moduleSortOrder,
										newModuleButtonRender
									)}
									{moduleModeRender}
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
