require('./modal.scss')
require('./admin.scss')

const React = require('react')
const { useState, useEffect } = require('react')
const RepositoryNav = require('./repository-nav')
const RepositoryBanner = require('./repository-banner')
const Button = require('./button')

const POSSIBLE_ROLES = [
	'canViewEditor',
	'canCreateDrafts',
	'canDeleteDrafts',
	'canPreviewDrafts',
	'canViewStatsPage',
	'canViewSystemStats',
	'canViewAdminPage',
]

const NO_SELECTION_USER = 'no-select-user'
const NO_SELECTION_MODULE = 'no-select-module'
const NO_SELECTION_PERMISSION = 'no-select-permission'

function Admin({
	currentUser,
	title,
	loadUserList,
	addUserPermission,
	removeUserPermission,
}) {
	const [users, setUsers] = useState([])
	const [fetching, setFetching] = useState(true)
	const [selectedUser, setSelectedUser] = useState(NO_SELECTION_USER)
	const [selectedPermission, setSelectedPermission] = useState(NO_SELECTION_PERMISSION)

	useEffect(() => {
		// Load all modules on this obo instance
		loadAllUsers()
		.then(() => setFetching(null))
	}, [])

	const loadAllUsers = () => {
		return new Promise(async resolve => {
			const allUsers = await loadUserList()
			if (allUsers &&
				allUsers.payload && 
				allUsers.payload.value &&
				allUsers.payload.value && 
				allUsers.payload.value.length > 0) {

				setUsers(allUsers.payload.value)
			}else {
				setUsers([])
			}

			resolve()
		})
	}

	const onAddUserPermission = async () => {
		if (selectedUser === NO_SELECTION_USER) return
		if (selectedPermission === NO_SELECTION_PERMISSION) return

		await addUserPermission(selectedUser, selectedPermission)
	}

	const onRemoveUserPermission = async () => {
		if (selectedUser === NO_SELECTION_USER) return
		if (selectedPermission === NO_SELECTION_PERMISSION) return

		await removeUserPermission(selectedUser, selectedPermission)
	}

	const renderPermissionSelectList = () => {
		return (
			<select
				name="select-user-permission"
				value={selectedPermission}
				onChange={e => setSelectedPermission(e.target.value)}
			>
				<option
					key={NO_SELECTION_PERMISSION}
					value={NO_SELECTION_PERMISSION}
				>
					Select permission
				</option>
				{POSSIBLE_ROLES.map((r, i) => {
					return (
						<option key={i} value={r}>{r}</option>
					)
				})}
			</select>
		)
	}

	const renderUserSelectList = () => {
		return (
			<select
				name="select-user"
				value={selectedUser}
				onChange={e => setSelectedUser(e.target.value)}
			>
				<option
					key={NO_SELECTION_USER}
					value={NO_SELECTION_USER}
				>
					Select user
				</option>
				{users.map((u, i) => {
					return (
						<option key={i} value={u.id}>
							{u.lastName}, {u.firstName}
						</option>
					)
				})}
			</select>
		)
	}

	// Contains any tools involving modifying module access, user permission, etc
	const getTools = () => [
		<div className="tool" key="tool-add-module-access">
			<p className="title">Manage User Permissions</p>
			<div className="row">
				<p>Select user:</p>
				{renderUserSelectList()}
			</div>
			<div className="row">
				<p>Select permission:</p>
				{renderPermissionSelectList()}
			</div>
			<div className="row buttons">
				<Button className="tool-button" onClick={onAddUserPermission}>{"Add"}</Button>
				<Button className="tool-button" onClick={onRemoveUserPermission}>{"Remove"}</Button>
			</div>
		</div>,
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
			<div className="repository--section-wrapper">
				<section className="repository--main-content">
					{fetching ? <p>Loading...</p> : getTools()}
				</section>
			</div>
		</span>
	)
}

module.exports = Admin
