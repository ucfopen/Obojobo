require('./modal.scss')
require('./dashboard.scss')

const React = require('react')
const { useState, useEffect } = require('react')
const RepositoryNav = require('./repository-nav')
const RepositoryBanner = require('./repository-banner')
const Module = require('./module')
const ModulePermissionsDialog = require('./module-permissions-dialog')
const ModuleOptionsDialog = require('./module-options-dialog')
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

const renderCollections = (collections, sortOrder) => {
	const sortFn = getSortMethod(sortOrder)
	return collections.sort(sortFn).map(collection => <div key={collection.id}>{collection.title}</div>)
}

const Dashboard = props => {
	const [collectionSortOrder, setCollectionSortOrder] = useState(props.collectionSortOrder)
	const [moduleSortOrder, setModuleSortOrder] = useState(props.moduleSortOrder)

	// Set a cookie when sortOrder changes on the client
	if (typeof document !== 'undefined') {
		useEffect(() => {
			const expires = new Date()
			expires.setFullYear(expires.getFullYear() + 1)
			document.cookie = `moduleSortOrder=${moduleSortOrder}; expires=${expires.toUTCString()}; path=/dashboard`
		}, [moduleSortOrder])
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
							<Button onClick={() => props.createNewCollection()}>New Collection</Button>
							<hr/>
							<Button onClick={() => props.createNewModule(false)}>New Module</Button>
							<Button onClick={() => props.createNewModule(true)}>New Tutorial</Button>
						</MultiButton>
						<Search
							value={props.moduleSearchString}
							placeholder="Filter..."
							onChange={props.filterModules}
						/>
					</div>

					<div className="repository--main-content--title">
						<span>My Collections</span>
						<div className="repository--main-content--sort">
							<span>Sort</span>
							<select value={collectionSortOrder} onChange={event => setCollectionSortOrder(event.target.value)}>
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
										collectionSortOrder
									)}
								</div>
							</div>
						</div>
					</div>

					<div className="repository--main-content--title">
						<span>My Modules</span>
						<div className="repository--main-content--sort">
							<span>Sort</span>
							<select value={moduleSortOrder} onChange={event => setModuleSortOrder(event.target.value)}>
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
									{renderModules(
										props.filteredModules ? props.filteredModules : props.myModules,
										moduleSortOrder
									)}
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
