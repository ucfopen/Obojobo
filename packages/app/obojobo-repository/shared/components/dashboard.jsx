require('./modal.scss')

const React = require('react');
const RepositoryNav = require('./repository-nav')
const RepositoryBanner = require('./repository-banner')
const Module = require('./module')
const ModuleMenu = require('./module-menu')
const RepositoryListItemFeedback = require('./repository-list-item-feedback')
const RepositoryListItemScores = require('./repository-list-item-scores')
const RepositoryListItemEdited = require('./repository-list-item-edited')
const ModulePermissionsDialog = require('./module-permissions-dialog')
const Button = require('./button')
const Search = require('./search')
const ReactModal = require('react-modal')

ReactModal.setAppElement('#dashboard-root')

const renderModalDialog = (props) => {
	switch(props.dialog){
		case 'module-permissions':
			return <ReactModal
				isOpen={true}
				contentLabel="Module Access"
				className="repository--modal"
				overlayClassName="repository--modal-overlay"
				onRequestClose={props.closeModal}
				>
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
				</ReactModal>
		default:
			return null
	}
}

const onModuleFilter = (props, input) => {
	props.filterModules(input)
}

const renderModules = (modules) => {
	return modules.map(draft => <Module key={draft.draftId} hasMenu={true} {...draft} ></Module>)
}

const Dashboard = (props) =>
	<span id="dashboard-root">
		<RepositoryNav
			userId={props.currentUser.id}
			avatarUrl={props.currentUser.avatarUrl}
			displayName={`${props.currentUser.firstName} ${props.currentUser.lastName}`}
			noticeCount={12}
			/>
		<RepositoryBanner title={props.title} className="default-bg" facts={props.facts} />
		<div className="repository--section-wrapper">
			<section className="repository--main-content">
				<div className="repository--main-content--title">My Modules</div>
				<div className="repository--item-list--group">
					<div className="repository--item-list--group--item-wrapper">
						<div className="repository--item-list--row">
							<Search onChange={(input) => {onModuleFilter(props, input)}} />
							<div className="repository--item-list--group--item--multi-wrapper">
								{
									renderModules(props.filteredModules ? props.filteredModules : props.myModules)
								}
							</div>
						</div>
					</div>
				</div>
				<Button onClick={() => {props.createNewModule(false)}}>New XML Module</Button>
				<Button onClick={() => {props.createNewModule(false)}}>New Visual Editor Module</Button>
				<Button onClick={() => {props.createNewModule(true)}}>New Visual Editor Tutorial</Button>
			</section>
		</div>
		{ renderModalDialog(props) }
	</span>

module.exports = Dashboard;
