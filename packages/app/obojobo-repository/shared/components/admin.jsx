require('./modal.scss')
require('./admin.scss')

const React = require('react')
const { useState, useEffect } = require('react')
const RepositoryNav = require('./repository-nav')
const RepositoryBanner = require('./repository-banner')

function Admin({
	currentUser,
	title,
	doSomething
}) {

	const [selectedDrafts, setSelectedDrafts] = useState([])
	const [search, setSearch] = useState('')
	const [selectedUser, setSelectedUser] = useState(null)
	const [selectedModule, setSelectedModule] = useState(null)

	// When the component is mounted in the browser, request the list of available modules for the current user
	useEffect(() => {
		loadUserModuleList()
	}, [])

	const loadStats = () => {
		loadModuleAssessmentDetails(selectedDrafts)
	}

	const onSearchChange = event => {
		setSearch(event.target.value)
	}

	const onAddModuleAccess = () => {
		console.log("onAddModuleAccess called")
		doSomething()
	}

	const onRemoveModuleAccess = () => {

	}

	// Renders any tools involving adding, deleting, or modifying module access
	let toolsModuleAccess = [
		<div className="tool" key="tool-add-module-access">
			<p className="title">Add module access</p>

			<div className="row">
				<p>Select user:</p>
				<select name="user-id"></select>
			</div>
			<div className="row">
				<p>Select module:</p>
				<select name="module-id"></select>
			</div>
			<button onClick={onAddModuleAccess}>Add</button>
		</div>,
		<div className="tool" key="tool-remove-module-access">
			<p className="title">Remove module access</p>

			<div className="row">
				<p>Select user:</p>
				<select name="user-id"></select>
			</div>
			<div className="row">
				<p>Select module:</p>
				<select name="module-id"></select>
			</div>
			<button onClick={onRemoveModuleAccess}>Remove</button>
		</div>
	]

	return (
		<span id="admin-root">
			<RepositoryNav
				userId={currentUser.id}
				userPerms={currentUser.perms}
				avatarUrl={currentUser.avatarUrl}
				displayName={`${currentUser.firstName} ${currentUser.lastName}`}
				noticeCount={0}
			/>
			<RepositoryBanner title={title} className="default-bg" />
			{toolsModuleAccess}
		</span>
	)
}

module.exports = Admin
