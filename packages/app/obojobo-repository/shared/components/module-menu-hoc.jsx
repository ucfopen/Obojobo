const ModuleMenu = require('./module-menu')
const connect = require('react-redux').connect
const { showModulePermissions, deleteModule }  = require('../actions/dashboard-actions')
const mapActionsToProps = { showModulePermissions, deleteModule }
module.exports = connect(null, mapActionsToProps)(ModuleMenu)
