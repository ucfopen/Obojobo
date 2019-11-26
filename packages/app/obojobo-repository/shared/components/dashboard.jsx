require('./modal.scss')
require('./dashboard.scss')

const React = require('react')
const { useState, useEffect } = require('react')
const RepositoryNav = require('./repository-nav')
const RepositoryBanner = require('./repository-banner')
const Module = require('./module')
const RepositoryListItemFeedback = require('./repository-list-item-feedback')
const RepositoryListItemScores = require('./repository-list-item-scores')
const RepositoryListItemEdited = require('./repository-list-item-edited')
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
	switch(props.dialog){
		case 'module-more':
			title = "Module Options"
			child = <ModuleOptionsDialog
					title=""
					{...props.selectedModule}
					showModulePermissions={props.showModulePermissions}
					deleteModule={props.deleteModule}
					onClose={props.closeModal}
				/>
			break

		case 'module-permissions':
			title = "Module Access"
			child = <ModulePermissionsDialog
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
			break

		default:
			return null
	}

	return <ReactModal
		isOpen={true}
		contentLabel={title}
		className="repository--modal"
		overlayClassName="repository--modal-overlay"
		onRequestClose={props.closeModal}
		>{child}</ReactModal>
}

const renderModules = modules => {
	return modules.map(draft => <Module key={draft.draftId} hasMenu={true} {...draft} ></Module>)
}

const Dashboard = props =>{
	return <span id="dashboard-root">
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
						<Button onClick={() => {props.createNewModule(false)}}>New Module</Button>
						<Button onClick={() => {props.createNewModule(true)}}>New Tutorial</Button>
					</MultiButton>
					<Search value={props.moduleSearchString} placeholder="Filter..." onChange={props.filterModules} />
				</div>
				<div className="repository--main-content--title">My Modules</div>
				<div className="repository--item-list--collection">
					<div className="repository--item-list--collection--item-wrapper">
						<div className="repository--item-list--row">
							<div className="repository--item-list--collection--item--multi-wrapper">
								{
									renderModules(props.filteredModules ? props.filteredModules : props.myModules)
								}
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
		{ renderModalDialog(props) }
	</span>
}

module.exports = Dashboard;
