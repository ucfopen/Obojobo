require('./module-manage-collections-dialog.scss')

const React = require('react')
const { useEffect, useState } = require('react')
const ModuleImage = require('./module-image')
const Button = require('./button')

const ModuleManageCollectionsDialog = props => {
	const [selectedCollectionId, setSelectedCollectionId] = useState(null)

	const onSelectChange = event => {
		event.stopPropagation()
		setSelectedCollectionId(event.target.value)
	}

	// Load collections this module is in on the initial render
	useEffect(() => {
		props.loadModuleCollections(props.draftId)
	}, [])

	const onAddClick = () => {
		props.moduleAddToCollection(props.draftId, selectedCollectionId).then(() => {
			setSelectedCollectionId(null)
		})
	}

	const onRemoveCollectionClick = collectionId => {
		props.moduleRemoveFromCollection(props.draftId, collectionId)
	}

	//this is still being dumb
	const renderCollectionOptions = () => {
		let firstValidOption = selectedCollectionId

		const options = props.collections
			.filter(collection => {
				const omitCollectionsModuleIsIn = draftCollection => {
					return collection.id === draftCollection.id
				}

				if (props.draftCollections && props.draftCollections.some(omitCollectionsModuleIsIn)) {
					if (firstValidOption === collection.id) {
						firstValidOption = null
					}
					return false
				}
				return true
			})
			.map(collection => {
				if (!firstValidOption) {
					firstValidOption = collection.id
				}
				return (
					<option key={`add-${collection.id}`} value={collection.id}>
						{collection.title}
					</option>
				)
			})

		// if we have something to set the selected option to, do it
		if (selectedCollectionId !== firstValidOption) {
			setSelectedCollectionId(firstValidOption)
		}
		return options
	}

	const renderModuleCollections = () => {
		if (!props.draftCollections) return null
		return props.draftCollections.map(collection => (
			<li key={`has-${collection.id}`} className="collection-list--collection">
				<span>{collection.title}</span>
				<Button
					className="close-button"
					onClick={() => {
						onRemoveCollectionClick(collection.id)
					}}
				>
					×
				</Button>
			</li>
		))
	}

	const collectionOptionsRender = renderCollectionOptions()

	let addAreaRender = (
		<React.Fragment>
			<div className="module-manage-collections-dialog--select-collection-container">
				<label>Select a Collection:</label>
				<select value={selectedCollectionId} onChange={onSelectChange}>
					{collectionOptionsRender}
				</select>
			</div>
			<Button className="add-button" onClick={onAddClick}>
				Add to Selected Collection
			</Button>
		</React.Fragment>
	)

	if (collectionOptionsRender.length === 0) {
		addAreaRender = (
			<div className="module-manage-collections-dialog--select-collection-container">
				<label>This module is already in all available collections</label>
			</div>
		)
	}

	return (
		<div className="module-manage-collections-dialog">
			<div className="top-bar">
				<ModuleImage id={props.draftId} />
				<div className="module-title">{props.title}</div>
				<Button className="close-button" onClick={props.onClose}>
					×
				</Button>
			</div>
			<div className="wrapper">
				<h1 className="title">Manage Collections</h1>
				<div className="sub-title">
					Add this module to or remove this module from private collections
				</div>
				{addAreaRender}
			</div>
			<div className="collection-list-wrapper">
				<ul className="collection-list">{renderModuleCollections()}</ul>
			</div>
			<div className="wrapper">
				<Button className="done-button secondary-button" onClick={props.onClose}>
					Done
				</Button>
			</div>
		</div>
	)
}

module.exports = ModuleManageCollectionsDialog
