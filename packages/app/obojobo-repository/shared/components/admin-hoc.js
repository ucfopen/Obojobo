const Admin = require('./admin')
const connect = require('react-redux').connect
const {
	loadModuleList,
	loadUserList,
	addUserPermission,
	removeUserPermission
} = require('../actions/admin-actions')
const mapStoreStateToProps = state => state
const mapActionsToProps = {
	loadModuleList,
	loadUserList,
	addUserPermission,
	removeUserPermission
}
module.exports = connect(
	mapStoreStateToProps,
	mapActionsToProps
)(Admin)
