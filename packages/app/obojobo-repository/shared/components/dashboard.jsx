require('./modal.scss')
require('./dashboard.scss')

const React = require('react')
const { useState, useEffect } = require('react')
const RepositoryNav = require('./repository-nav')
const RepositoryBanner = require('./repository-banner')
const Collection = require('./collection')
const CollectionRenameDialog = require('./collection-rename-dialog')
const Module = require('./module')
const ModulePermissionsDialog = require('./module-permissions-dialog')
const ModuleOptionsDialog = require('./module-options-dialog')
const Button = require('./button')
const ButtonLink = require('./button-link')
const MultiButton = require('./multi-button')
const Search = require('./search')
const ReactModal = require('react-modal')

const { MODE_DASHBOARD, MODE_MODULES, MODE_COLLECTION } = require('../repository-constants')

const renderOptionsDialog = props => (
	<ModuleOptionsDialog
		title=""
		{...props.selectedModule}
		showModulePermissions={props.showModulePermissions}
		deleteModule={props.deleteModule}
		onClose={props.closeModal}
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

const renderCollectionRenameDialog = props => (
	<CollectionRenameDialog
		title="Rename Collection"
		collection={props.collection}
		onClose={props.closeModal}
		onAccept={props.renameCollection}
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

		case 'collection-rename':
			title = 'Rename Collection'
			dialog = renderCollectionRenameDialog(props)
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

const renderModules = (modules, sortOrder) => {
	const sortFn = getSortMethod(sortOrder)
	return modules.sort(sortFn).map(draft => <Module key={draft.draftId} hasMenu={true} {...draft} />)
}

const renderCollections = collections => {
	return collections.map(collection => (
		<Collection key={collection.id} hasMenu={true} {...collection} />
	))
}

const Dashboard = props => {
	const [moduleSortOrder, setModuleSortOrder] = useState(props.moduleSortOrder)

	// Set a cookie when moduleSortOrder changes on the client
	if (typeof document !== 'undefined') {
		useEffect(() => {
			const expires = new Date()
			expires.setFullYear(expires.getFullYear() + 1)
			document.cookie = `moduleSortOrder=${moduleSortOrder}; expires=${expires.toUTCString()}; path=/dashboard`
		}, [moduleSortOrder])
	}

	// Components to render for 'New Collection' option in New Module... button
	// Will only be visible when dashboard is in 'default' mode
	let newCollectionRender = (
		<React.Fragment>
			<Button onClick={() => props.createNewCollection()}>New Collection</Button>
			<hr />
		</React.Fragment>
	)

	// Text content of the dashboard collection section's title
	// Either 'My Collections' (default/module mode) or the title
	//  of the chosen collection (collection mode)
	let collectionsTitle = 'My Collections'

	// Text content of the dashboard module section's title
	// Either 'My Recent Modules' (default) or 'My Modules' (module mode)
	//  or 'Modules in Collection' (collection mode)
	let modulesTitle = 'My Recent Modules'

	// Extra class to apply to module section's title
	// Will be 'stretch-width' when module sort component is not present
	//  or an empty string when it is
	let modulesTitleExtraClass = ''

	// Components to render for module sort options
	// Will not be necessary when dashboard is in 'default' mode
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
	// Will not be necessary when dashboard is in 'default' mode
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
		<ButtonLink
			className="repository--all-modules--button"
			url="/dashboard/modules"
			target="_blank"
		>
			All Modules
		</ButtonLink>
	)

	switch (props.mode) {
		// url is /dashboard/collections/collection-name-and-short-uuid
		case MODE_COLLECTION:
			newCollectionRender = null
			collectionsTitle = `Collection "Collection Title Here - Soon!"`
			modulesTitle = 'Modules in Collection'
			break
		// url is /dashboard/modules
		case MODE_MODULES:
			newCollectionRender = null
			modulesTitle = 'My Modules'
			moduleModeRender = null
			break
		// url is /dashboard
		case MODE_DASHBOARD:
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
						<MultiButton title="New Module">
							{newCollectionRender}
							<Button onClick={() => props.createNewModule(false)}>New Module</Button>
							<Button onClick={() => props.createNewModule(true)}>New Tutorial</Button>
						</MultiButton>
						{moduleFilterRender}
					</div>

					<div className="repository--main-content--title stretch-width">
						<span>{collectionsTitle}</span>
					</div>
					<div className="repository--item-list--collection">
						<div className="repository--item-list--collection--item-wrapper">
							<div className="repository--item-list--row">
								<div className="repository--item-list--collection--item--multi-wrapper">
									{renderCollections(
										props.filteredCollections ? props.filteredCollections : props.myCollections
									)}
								</div>
							</div>
						</div>
					</div>

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
										moduleSortOrder
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
