const ModuleMenu = require('./module-menu')
const connect = require('react-redux').connect
const {
	showModulePermissions,
	deleteModule,
	showModuleMore,
	showModuleSync
} = require('../actions/dashboard-actions')
const mapActionsToProps = { showModulePermissions, deleteModule, showModuleMore, showModuleSync }
module.exports = connect(
	null,
	mapActionsToProps
)(ModuleMenu)
