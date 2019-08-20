const ModuleMenu = require('./module-menu')
const connect = require('react-redux').connect
const { showModulePermissions, deleteModule, showModuleMore }  = require('../actions/dashboard-actions')
const mapActionsToProps = { showModulePermissions, deleteModule, showModuleMore }
module.exports = connect(null, mapActionsToProps)(ModuleMenu)
