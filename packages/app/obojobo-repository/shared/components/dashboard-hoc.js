const Dashboard = require('./dashboard')
const connect = require('react-redux').connect
const { closeModal, addUserToModule, loadUsersForModule, deleteModulePermissions, createNewModule, filterModules}  = require('../actions/dashboard-actions')
const mapStoreStateToProps = (state) => state
const mapActionsToProps = { createNewModule, closeModal, addUserToModule, loadUsersForModule, deleteModulePermissions, filterModules }
module.exports = connect(mapStoreStateToProps, mapActionsToProps)(Dashboard)
