const CollectionMenu = require('./collection-menu')
const connect = require('react-redux').connect
const { showCollectionRename, deleteCollection } = require('../actions/dashboard-actions')
const mapActionsToProps = { showCollectionRename, deleteCollection }
module.exports = connect(
	null,
	mapActionsToProps
)(CollectionMenu)
