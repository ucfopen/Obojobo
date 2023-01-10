require('./collection-bulk-add-modules-dialog.scss')

const whitespaceRegex = /\s+/g

const React = require('react')
const { useState } = require('react')
const Button = require('./button')
const Checkbox = require('./checkbox')
const Search = require('./search')

const CollectionBulkAddModulesDialog = props => {
	const [filterString, setfilterString] = useState('')
	const [selectedCollections, setSelectedCollections] = useState([])

	const handleAddClick = () => {
		props.bulkAddModulesToCollection(props.selectedModules, selectedCollections)
		props.onClose()
	}

	const filterCollections = collection => {
		const searchString = ('' + filterString).replace(whitespaceRegex, '').toLowerCase()
		if (!searchString) return true

		return (collection.title || '')
			.replace(whitespaceRegex, '')
			.toLowerCase()
			.includes(searchString)
	}

	const handleCollectionClick = collectionId => {
		const newSelectedCollections = [...selectedCollections]
		const collectionIdIndex = selectedCollections.indexOf(collectionId)
		if (collectionIdIndex > -1) {
			newSelectedCollections.splice(collectionIdIndex, 1)
		} else {
			newSelectedCollections.push(collectionId)
		}
		setSelectedCollections(newSelectedCollections)
	}

	const renderCollectionOptions = () => {
		if (!props.collections) return null

		return props.collections.filter(filterCollections).map(collection => {
			return (
				<li
					key={collection.id}
					className="collection-list--collection"
					onClick={() => handleCollectionClick(collection.id)}
				>
					<Checkbox checked={selectedCollections.includes(collection.id)} />
					<span>{collection.title}</span>
				</li>
			)
		})
	}

	return (
		<div className="collections-bulk-add-modules-dialog">
			<div className="top-bar">
				<div className="module-count">{props.selectedModules.length} Modules Selected</div>
				<Button ariaLabel="Close" className="close-button" onClick={props.onClose}>
					×
				</Button>
			</div>
			<div className="wrapper">
				<h1 className="title">Add Modules to Collections</h1>
				<div className="sub-title">Add the selected modules to one or more collections</div>
				<Search placeholder="Filter..." onChange={setfilterString} />
			</div>
			<div className="collection-list-wrapper">
				<ul className="collection-list">{renderCollectionOptions()}</ul>
			</div>
			<div className="wrapper buttons-list">
				<Button className="cancel-button secondary-button dangerous-button" onClick={props.onClose}>
					Cancel
				</Button>
				<Button className="done-button secondary-button" onClick={handleAddClick}>
					Add
				</Button>
			</div>
		</div>
	)
}

module.exports = CollectionBulkAddModulesDialog
