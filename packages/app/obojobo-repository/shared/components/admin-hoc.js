const Admin = require('./admin')
const connect = require('react-redux').connect
const {
	addUserPermission,
	removeUserPermission,
	searchForUser,
	clearPeopleSearchResults
} = require('../actions/admin-actions')
const mapStoreStateToProps = state => state
const mapActionsToProps = {
	addUserPermission,
	removeUserPermission,
	searchForUser,
	clearPeopleSearchResults
}
module.exports = connect(
	mapStoreStateToProps,
	mapActionsToProps
)(Admin)
