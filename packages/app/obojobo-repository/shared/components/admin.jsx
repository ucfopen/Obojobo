require('./modal.scss')
require('./admin.scss')

const React = require('react')
const { useState, useEffect } = require('react')
const RepositoryNav = require('./repository-nav')
const RepositoryBanner = require('./repository-banner')
const Search = require('./search')
const Button = require('./button')
const PeopleListItem = require('./people-list-item')

const { POSSIBLE_PERMS, PERMS_PER_ROLE } = require('../util/implicit-perms')

const NO_SELECTION_PERMISSION = 'no-select-permission'

const Admin = props => {
	// storing selected user in state by choosing one from the list fetched by the search may not work
	// perms attached to a user via the search didn't previously include explicitly added perms, just role perms
	// that was changed but may slow down the initial fetch due to a join in the query
	// may be faster to instead run a new action to fetch the single user explicitly, which will get all perms
	// but that would put the selected user in props, as opposed to doing this
	const [selectedUser, setSelectedUser] = useState(null)
	const [selectedPermission, setSelectedPermission] = useState(NO_SELECTION_PERMISSION)

	// make sure user/module search results are zero'd out on first render
	useEffect(() => {
		props.clearPeopleSearchResults()
	}, [])

	const onAddUserPermission = async () => {
		if (selectedPermission === NO_SELECTION_PERMISSION) return

		const action = await props.addUserPermission(selectedUser.id, selectedPermission)
		if (action.payload.status === 'ok') setSelectedUser(action.payload.value)
	}

	const onRemoveUserPermission = async () => {
		if (selectedPermission === NO_SELECTION_PERMISSION) return

		const action = await props.removeUserPermission(selectedUser.id, selectedPermission)
		if (action.payload.status === 'ok') setSelectedUser(action.payload.value)
	}

	const renderPermissionSelectList = () => {
		return (
			<select
				name="select-user-permission"
				value={selectedPermission}
				onChange={e => setSelectedPermission(e.target.value)}
			>
				<option key={NO_SELECTION_PERMISSION} value={NO_SELECTION_PERMISSION}>
					Select permission
				</option>
				{POSSIBLE_PERMS.map((r, i) => {
					return (
						<option key={i} value={r}>
							{r}
						</option>
					)
				})}
			</select>
		)
	}

	const renderListItem = u => {
		if (u.id !== props.currentUser.id) {
			return (
				<PeopleListItem key={u.id} isMe={false} {...u}>
					<Button className="select-button" onClick={() => setSelectedUser(u)}>
						Select
					</Button>
				</PeopleListItem>
			)
		}
	}

	const renderContent = () => {
		if (selectedUser) {
			const allRolePerms = new Set()
			const rolePermsRender = selectedUser.roles.map(role => {
				const roles = PERMS_PER_ROLE[role].map(perm => {
					allRolePerms.add(perm)

					return <li key={`${role}.${perm}`}>{perm}</li>
				})
				return (
					<div key={role} className="existing-perms">
						<label>{role}</label>
						<ul>{roles}</ul>
					</div>
				)
			})

			const nonRolePerms = selectedUser.perms
				.filter(p => !allRolePerms.has(p))
				.map(p => <li key={`nonrole.${p}`}>{p}</li>)

			return (
				<React.Fragment>
					<div className="wrapper">
						<p className="title">Managing:</p>
						<PeopleListItem {...selectedUser}></PeopleListItem>
					</div>
					<div className="tool" key="tool-manage-permissions">
						<p className="title">Manage User Permissions</p>
						<div className="implicit-perms-container">
							{selectedUser.roles.length > 0 ? (
								<React.Fragment>
									<span>
										Current implicit permissions from role{selectedUser.roles.length > 1 ? 's' : ''}
										:
									</span>
									{rolePermsRender}
								</React.Fragment>
							) : (
								'None'
							)}
						</div>
						<div className="explicit-perms-container">
							<span>Current explicit permissions:</span>
							{nonRolePerms.length < 1 ? 'None' : <ul>{nonRolePerms}</ul>}
						</div>
						<div className="row">
							<p>Select permission:</p>
							{renderPermissionSelectList()}
						</div>
						<div className="row buttons">
							<Button className="tool-button" onClick={onAddUserPermission}>
								{'Add'}
							</Button>
							<Button className="tool-button" onClick={onRemoveUserPermission}>
								{'Remove'}
							</Button>
						</div>
					</div>
				</React.Fragment>
			)
		}
		return (
			<React.Fragment>
				<div className="wrapper">
					<p className="title">Find Users to Manage</p>
					<Search
						onChange={props.searchForUser}
						focusOnMount={true}
						placeholder="Search..."
						value={props.userSearchString}
					/>
				</div>
				<div className="user-list-wrapper">
					<ul className="user-list">
						{props.searchUsers && props.searchUsers.items
							? props.searchUsers.items.map(renderListItem)
							: null}
					</ul>
				</div>
			</React.Fragment>
		)
	}

	return (
		<span id="admin-root">
			<RepositoryNav
				userId={props.currentUser.id}
				userPerms={props.currentUser.perms}
				avatarUrl={props.currentUser.avatarUrl}
				displayName={`${props.currentUser.firstName} ${props.currentUser.lastName}`}
				noticeCount={0}
			/>
			<RepositoryBanner title={props.title} className="default-bg" />
			<div className="repository--section-wrapper">
				<section className="repository--main-content">{renderContent()}</section>
			</div>
		</span>
	)
}

module.exports = Admin
