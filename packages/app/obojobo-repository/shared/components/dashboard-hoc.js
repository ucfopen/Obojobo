const Dashboard = require('./dashboard')
const connect = require('react-redux').connect
const {
	closeModal,
	addUserToModule,
	loadUsersForModule,
	deleteModulePermissions,
	createNewCollection,
	renameCollection,
	createNewModule,
	filterModules,
	deleteModule,
	showModulePermissions,
	showModuleManageCollections,
	loadModuleCollections,
	addModuleToCollection,
	removeModuleFromCollection
} = require('../actions/dashboard-actions')
const mapStoreStateToProps = state => state
const mapActionsToProps = {
	createNewCollection,
	renameCollection,
	createNewModule,
	closeModal,
	addUserToModule,
	loadUsersForModule,
	deleteModulePermissions,
	filterModules,
	deleteModule,
	showModulePermissions,
	showModuleManageCollections,
	loadModuleCollections,
	addModuleToCollection,
	removeModuleFromCollection
}
module.exports = connect(
	mapStoreStateToProps,
	mapActionsToProps
)(Dashboard)
