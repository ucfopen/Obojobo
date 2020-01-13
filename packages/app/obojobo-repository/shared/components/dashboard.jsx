require('./modal.scss')
require('./dashboard.scss')

const React = require('react')
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

class Dashboard extends React.Component {
	constructor(props) {
		super(props)

		const selectedSort = props.selectedSort

		this.state = {
			selectedSort,
			sortOptions: ['Newest', 'Alphabetical', 'Last updated']
		}
	}

	updateSort(event) {
		const selectedSort = event.target.value
		const expires = new Date()

		this.setState({ selectedSort })

		expires.setFullYear(expires.getFullYear() + 1)
		document.cookie = `selectedSort=${selectedSort}; expires=${expires.toUTCString()}`
	}

	renderModules(modules) {
		switch (this.state.selectedSort) {
			case 'Alphabetical':
				modules.sort((a, b) => a.title.localeCompare(b.title))
				break
			case 'Newest':
				modules.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
				break
			case 'Last updated':
				modules.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
				break
		}

		return modules.map(draft => <Module key={draft.draftId} hasMenu={true} {...draft} />)
	}

	render() {
		return (
			<span id="dashboard-root">
				<RepositoryNav
					userId={this.props.currentUser.id}
					avatarUrl={this.props.currentUser.avatarUrl}
					displayName={`${this.props.currentUser.firstName} ${this.props.currentUser.lastName}`}
					noticeCount={0}
				/>
				<RepositoryBanner
					title={this.props.title}
					className="default-bg"
					facts={this.props.facts}
				/>
				<div className="repository--section-wrapper">
					<section className="repository--main-content">
						<div className="repository--main-content--control-bar">
							<MultiButton title="New Module">
								<Button
									onClick={() => {
										this.props.createNewModule(false)
									}}
								>
									New Module
								</Button>
								<Button
									onClick={() => {
										this.props.createNewModule(true)
									}}
								>
									New Tutorial
								</Button>
							</MultiButton>
							<Search
								value={this.props.moduleSearchString}
								placeholder="Filter..."
								onChange={this.props.filterModules}
							/>
						</div>
						<div className="repository--main-content--title">
							<span>My Modules</span>
							<div className="repository--main-content--sort">
								<span>Sort</span>
								<select value={this.state.selectedSort} onChange={this.updateSort.bind(this)}>
									{this.state.sortOptions.map(opt => (
										<option key={opt} value={opt}>
											{opt}
										</option>
									))}
								</select>
							</div>
						</div>
						<div className="repository--item-list--collection">
							<div className="repository--item-list--collection--item-wrapper">
								<div className="repository--item-list--row">
									<div className="repository--item-list--collection--item--multi-wrapper">
										{this.renderModules(
											this.props.filteredModules ? this.props.filteredModules : this.props.myModules
										)}
									</div>
								</div>
							</div>
						</div>
					</section>
				</div>
				{renderModalDialog(this.props)}
			</span>
		)
	}
}

module.exports = Dashboard
