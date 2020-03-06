const CollectionMenu = require('./collection-menu')
const connect = require('react-redux').connect
const { showCollectionRename } = require('../actions/dashboard-actions')
const mapActionsToProps = { showCollectionRename }
module.exports = connect(
	null,
	mapActionsToProps
)(CollectionMenu)
