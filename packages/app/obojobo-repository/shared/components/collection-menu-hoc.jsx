const CollectionMenu = require('./collection-menu')
const connect = require('react-redux').connect
const {
	showCollectionAddModule,
	showCollectionRename,
	deleteCollection
} = require('../actions/dashboard-actions')
const mapActionsToProps = { showCollectionAddModule, showCollectionRename, deleteCollection }
module.exports = connect(
	null,
	mapActionsToProps
)(CollectionMenu)
