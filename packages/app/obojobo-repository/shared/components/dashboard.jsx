require('./modal.scss')
require('./dashboard.scss')

const React = require('react')
const { useState } = require('react')
const RepositoryNav = require('./repository-nav')
const RepositoryBanner = require('./repository-banner')
const Module = require('./module')
const ModulePermissionsDialog = require('./module-permissions-dialog')
const ModuleOptionsDialog = require('./module-options-dialog')
const Button = require('./button')
const MultiButton = require('./multi-button')
const Search = require('./search')
const ReactModal = require('react-modal')

ReactModal.setAppElement('#dashboard-root')

const renderModalDialog = props => {
	let child
	let title
	switch (props.dialog) {
		case 'module-more':
			title = 'Module Options'
			child = (
				<ModuleOptionsDialog
					title=""
					{...props.selectedModule}
					showModulePermissions={props.showModulePermissions}
					deleteModule={props.deleteModule}
					onClose={props.closeModal}
				/>
			)
			break

		case 'module-permissions':
			title = 'Module Access'
			child = (
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
			break

		default:
			return null
	}

	return (
		<ReactModal
			isOpen={true}
			contentLabel={title}
			className="repository--modal"
			overlayClassName="repository--modal-overlay"
			onRequestClose={props.closeModal}
		>
			{child}
		</ReactModal>
	)
}

const sortModules = (modules, sortOrder) => {
	switch (sortOrder) {
		case 'alphabetical':
			modules.sort((a, b) => a.title.localeCompare(b.title))
			break
		case 'newest':
			modules.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
			break
		case 'last updated':
			modules.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
			break
	}
}

const renderModules = (modules, sortOrder) => {
	sortModules(modules, sortOrder)
	return modules.map(draft => <Module key={draft.draftId} hasMenu={true} {...draft} />)
}

const Dashboard = props => {
	const [sortOrder, setSortOrder] = useState(props.sortOrder)

	const handleSortChange = sortOrder => {
		const expires = new Date()

		expires.setFullYear(expires.getFullYear() + 1)
		document.cookie = `sortOrder=${sortOrder}; expires=${expires.toUTCString()}`

		setSortOrder(sortOrder)
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
						<span>My Modules</span>
						<div className="repository--main-content--sort">
							<span>Sort</span>
							<select value={sortOrder} onChange={event => handleSortChange(event.target.value)}>
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
										sortOrder
									)}
								</div>
							</div>
						</div>
					</div>
				</section>
			</div>
			{renderModalDialog(props)}
		</span>
	)
}

module.exports = Dashboard
