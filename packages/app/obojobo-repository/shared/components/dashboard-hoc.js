const Dashboard = require('./dashboard')
const connect = require('react-redux').connect
const {
	closeModal,
	addUserToModule,
	bulkAddUserToModules,
	loadUsersForModule,
	deleteModulePermissions,
	createNewModule,
	filterModules,
	selectModules,
	deselectModules,
	deleteModule,
	bulkDeleteModules,
	bulkCopyModules,
	showModulePermissions,
	showVersionHistory,
	showAssessmentScoreData,
	restoreVersion,
	importModuleFile,
	checkModuleLock
} = require('../actions/dashboard-actions')
const mapStoreStateToProps = state => state
const mapActionsToProps = {
	createNewModule,
	closeModal,
	addUserToModule,
	bulkAddUserToModules,
	loadUsersForModule,
	deleteModulePermissions,
	filterModules,
	selectModules,
	deselectModules,
	deleteModule,
	bulkDeleteModules,
	bulkCopyModules,
	showModulePermissions,
	showVersionHistory,
	showAssessmentScoreData,
	restoreVersion,
	importModuleFile,
	checkModuleLock
}
module.exports = connect(
	mapStoreStateToProps,
	mapActionsToProps
)(Dashboard)
