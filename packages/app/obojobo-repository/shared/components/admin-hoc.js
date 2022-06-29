const Admin = require('./admin')
const connect = require('react-redux').connect
const { doSomething } = require('../actions/admin-actions')
const mapStoreStateToProps = state => state
const mapActionsToProps = {
	doSomething
}
module.exports = connect(
	mapStoreStateToProps,
	mapActionsToProps
)(Admin)
