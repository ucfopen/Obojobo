const Dashboard = require('./dashboard')
const connect = require('react-redux').connect
const {
	closeModal,
	addUserToModule,
	loadUsersForModule,
	deleteModulePermissions,
	createNewCollection,
	loadCollectionModules,
	collectionAddModule,
	collectionRemoveModule,
	renameCollection,
	createNewModule,
	filterModules,
	deleteModule,
	showModulePermissions,
	showModuleManageCollections,
	loadModuleCollections,
	moduleAddToCollection,
	moduleRemoveFromCollection
} = require('../actions/dashboard-actions')
const mapStoreStateToProps = state => state
const mapActionsToProps = {
	createNewCollection,
	loadCollectionModules,
	collectionAddModule,
	collectionRemoveModule,
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
	moduleAddToCollection,
	moduleRemoveFromCollection
}
module.exports = connect(
	mapStoreStateToProps,
	mapActionsToProps
)(Dashboard)
